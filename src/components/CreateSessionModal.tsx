
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CreateSessionModalProps {
  open: boolean;
  onClose: () => void;
  onSessionCreated: (session: any) => void;
}

const CreateSessionModal = ({ open, onClose, onSessionCreated }: CreateSessionModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // In a real implementation, we would:
      // 1. Create a session record in the database
      // 2. Generate a unique session ID
      // 3. Return the session details to the caller
      
      const newSession = {
        id: crypto.randomUUID(),
        title,
        description,
        category,
        host: "Current User",
        date: new Date().toISOString(),
        time: `${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')} - ${new Date().getHours() + 1}:${String(new Date().getMinutes()).padStart(2, '0')} EAT`,
        participants: 0,
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
        status: "upcoming"
      };
      
      toast({
        title: "Session Created",
        description: "Your live session has been successfully created"
      });
      
      onSessionCreated(newSession);
      onClose();
    } catch (error) {
      console.error("Error creating session:", error);
      toast({
        title: "Error",
        description: "Failed to create live session. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-black border border-purple-500/30">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Create Live Session</DialogTitle>
          <DialogDescription>
            Start a new live teaching session for others to join
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right col-span-1">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3 bg-black/60 border-white/20"
                placeholder="Advanced React Hooks"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right col-span-1">
                Category
              </Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="col-span-3 bg-black/60 border-white/20"
                placeholder="Web Development"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right col-span-1 pt-2">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3 bg-black/60 border-white/20"
                placeholder="Describe what will be covered in this session"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-purple-600 to-blue-500"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Session"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSessionModal;
