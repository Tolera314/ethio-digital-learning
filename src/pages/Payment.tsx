import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, CreditCard, DollarSign, Loader2, Shield, Star } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";

const pricingPlans = [
  {
    id: "basic",
    name: "Basic Plan",
    price: 29.99,
    interval: "month",
    features: [
      "Access to basic courses",
      "Community forum access",
      "Email support",
      "Mobile app access"
    ],
    popular: false
  },
  {
    id: "premium",
    name: "Premium Plan", 
    price: 49.99,
    interval: "month",
    features: [
      "Access to all courses",
      "Live session participation",
      "1-on-1 mentoring sessions",
      "Priority support",
      "Downloadable content",
      "Certificate of completion"
    ],
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise Plan",
    price: 99.99,
    interval: "month",
    features: [
      "Everything in Premium",
      "Custom learning paths",
      "Team management",
      "Advanced analytics",
      "API access",
      "Dedicated account manager"
    ],
    popular: false
  }
];

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check for payment success/cancel in URL params
    const status = searchParams.get('status');
    if (status === 'success') {
      toast({
        title: "Payment Successful!",
        description: "Welcome to your new plan. You now have access to premium features.",
      });
    } else if (status === 'cancel') {
      toast({
        title: "Payment Cancelled",
        description: "Your payment was cancelled. No charges were made.",
        variant: "destructive"
      });
    }
  }, [searchParams, toast]);

  useEffect(() => {
    async function loadPaymentHistory() {
      if (!user) return;
      
      try {
        // Note: This will fail until types are updated, using any for now
        const { data, error } = await (supabase as any)
          .from('payments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPaymentHistory(data || []);
      } catch (error) {
        console.error("Error loading payment history:", error);
      } finally {
        setLoadingHistory(false);
      }
    }

    loadPaymentHistory();
  }, [user]);

  const handlePlanSelect = async (planId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe to a plan",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    setLoading(true);
    setSelectedPlan(planId);

    try {
      const plan = pricingPlans.find(p => p.id === planId);
      if (!plan) throw new Error("Plan not found");

      // Create payment session via edge function
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          planId,
          planName: plan.name,
          amount: plan.price * 100, // Convert to cents
          currency: 'usd',
          interval: plan.interval,
          successUrl: `${window.location.origin}/payment?status=success`,
          cancelUrl: `${window.location.origin}/payment?status=cancel`
        }
      });

      if (error) throw error;

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  const PlanCard = ({ plan }: { plan: typeof pricingPlans[0] }) => (
    <Card className={`relative overflow-hidden bg-black/40 border backdrop-blur-lg shadow-lg transition-all duration-300 hover:shadow-purple-500/20 ${
      plan.popular ? 'border-purple-500 scale-105' : 'border-white/10'
    }`}>
      {plan.popular && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-blue-500 text-white text-center py-2 text-sm font-semibold">
          Most Popular
        </div>
      )}
      <CardHeader className={plan.popular ? "pt-12" : ""}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
          {plan.popular && <Star className="text-yellow-400 h-5 w-5" />}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">${plan.price}</span>
          <span className="text-gray-300">/{plan.interval}</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-gray-300">
              <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          onClick={() => handlePlanSelect(plan.id)}
          disabled={loading && selectedPlan === plan.id}
          className={`w-full ${
            plan.popular 
              ? 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600' 
              : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
          } text-white`}
        >
          {loading && selectedPlan === plan.id ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <CreditCard className="h-4 w-4 mr-2" />
          )}
          {loading && selectedPlan === plan.id ? 'Processing...' : 'Subscribe Now'}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <PageLayout
      title="Premium Plans & Billing"
      subtitle="Unlock advanced features with our premium plans"
      backgroundImage="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Security Notice */}
        <div className="glass-morphism p-4 rounded-xl mb-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <Shield className="text-green-400 h-6 w-6" />
            <div>
              <p className="text-white font-semibold">Secure Payment Processing</p>
              <p className="text-gray-300 text-sm">Powered by Stripe. Your payment information is encrypted and secure.</p>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {pricingPlans.map(plan => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Payment History */}
        {user && (
          <Card className="glass-morphism border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payment History
              </CardTitle>
              <CardDescription className="text-gray-300">
                View your recent transactions and subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingHistory ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
                </div>
              ) : paymentHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No payment history found
                </div>
              ) : (
                <div className="space-y-4">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{payment.product_type || 'Subscription'}</p>
                        <p className="text-gray-400 text-sm">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">
                          ${(payment.amount / 100).toFixed(2)} {payment.currency.toUpperCase()}
                        </p>
                        <Badge variant={payment.status === 'paid' ? 'default' : 'secondary'}>
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

export default Payment;