
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Book } from "@/types/library";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { logActivity } from "@/utils/activityLogger";

interface CreateSessionModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  onSessionCreated: () => void;
}

interface FormData {
  title: string;
  description: string;
  meetingLink: string;
}

const CreateSessionModal = ({ book, isOpen, onClose, onSessionCreated }: CreateSessionModalProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    defaultValues: {
      title: `${book.title} - Reading Group`,
      description: "",
      meetingLink: ""
    }
  });
  
  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast.error("You must be logged in to create a reading session");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data: sessionData, error } = await supabase
        .from("reading_sessions")
        .insert({
          book_id: book.id,
          created_by: user.id,
          title: data.title,
          description: data.description || null,
          meeting_link: data.meetingLink || null
        })
        .select("*")
        .single();
        
      if (error) throw error;
      
      // Join the session as the creator
      await supabase
        .from("session_participants")
        .insert({
          session_id: sessionData.id,
          user_id: user.id,
        });
        
      // Log activity
      await logActivity(
        'session_join',
        sessionData.id,
        'reading_session',
        { 
          title: data.title,
          book_title: book.title,
          book_id: book.id
        }
      );
      
      toast.success("Reading session created successfully!");
      reset();
      onSessionCreated();
      onClose();
    } catch (error: any) {
      toast.error(`Failed to create reading session: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-black/80 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create a Reading Session</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="title">Session Title</Label>
            <Input
              id="title"
              className="bg-black/50 border-white/20 text-white mt-1"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              className="bg-black/50 border-white/20 text-white mt-1 h-24"
              placeholder="What will this reading session focus on?"
              {...register("description")}
            />
          </div>
          
          <div>
            <Label htmlFor="meetingLink">Meeting Link (Optional)</Label>
            <Input
              id="meetingLink"
              className="bg-black/50 border-white/20 text-white mt-1"
              placeholder="https://meet.google.com/..."
              {...register("meetingLink")}
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-white/20 text-white"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Session"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSessionModal;
