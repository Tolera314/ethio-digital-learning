import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    const { courseId, courseTitle, completionData } = await req.json();

    if (!courseId || !courseTitle) {
      throw new Error("Missing required fields: courseId and courseTitle");
    }

    // Use service role to create certificate
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get user profile for certificate
    const { data: profile } = await supabaseService
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    const userName = profile?.full_name || user.email?.split('@')[0] || 'Student';

    // Check if certificate already exists
    const { data: existingCert } = await supabaseService
      .from('certificates')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single();

    if (existingCert) {
      return new Response(JSON.stringify({ 
        error: "Certificate already exists for this course" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Create certificate
    const { data: certificate, error: certError } = await supabaseService
      .from('certificates')
      .insert({
        user_id: user.id,
        course_id: courseId,
        title: `Certificate of Completion - ${courseTitle}`,
        description: `This certificate confirms that ${userName} has successfully completed the course "${courseTitle}".`,
        certificate_type: 'completion',
        is_verified: true,
        metadata: {
          completion_date: new Date().toISOString(),
          course_title: courseTitle,
          user_name: userName,
          ...completionData
        }
      })
      .select()
      .single();

    if (certError) throw certError;

    // Log analytics event
    await supabaseService.from('analytics_events').insert({
      user_id: user.id,
      event_name: 'certificate_generated',
      event_category: 'achievement',
      properties: {
        certificate_id: certificate.id,
        course_id: courseId,
        course_title: courseTitle
      }
    });

    return new Response(JSON.stringify({ 
      success: true, 
      certificate: {
        id: certificate.id,
        verification_code: certificate.verification_code,
        title: certificate.title,
        issued_date: certificate.issued_date
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Certificate generation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});