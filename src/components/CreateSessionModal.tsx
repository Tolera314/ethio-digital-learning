
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
import { toast } from "sonner";

interface CreateSessionModalProps {
  open: boolean;
  onClose: () => void;
  onSessionCreated: (session: any) => void;
}

const CreateSessionModal = ({ open, onClose, onSessionCreated }: CreateSessionModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter a session title");
      return;
    }

    setIsLoading(true);

    try {
      const newSession = {
        id: crypto.randomUUID(),
        title: title.trim(),
        description: description.trim(),
        host: "Current User",
        date: new Date().toISOString(),
        time: `${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')} - ${new Date().getHours() + 1}:${String(new Date().getMinutes()).padStart(2, '0')} EAT`,
        participants: 0,
        status: "upcoming"
      };
      
      toast.success("Session created successfully!");
      onSessionCreated(newSession);
      
      // Reset form
      setTitle("");
      setDescription("");
      onClose();
    } catch (error) {
      console.error("Error creating session:", error);
      toast.error("Failed to create session. Please try again.");
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
                placeholder="Reading Discussion Session"
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
