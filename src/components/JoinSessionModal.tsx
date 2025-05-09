
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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface JoinSessionModalProps {
  open: boolean;
  onClose: () => void;
  session: any;
  onJoin: (username: string, email: string) => void;
}

const JoinSessionModal = ({ 
  open, 
  onClose, 
  session, 
  onJoin 
}: JoinSessionModalProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !email) {
      toast({
        title: "Missing information",
        description: "Please enter your name and email",
        variant: "destructive"
      });
      return;
    }

    if (!email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // In a real implementation, we would:
      // 1. Verify the user's identity
      // 2. Add them to the session participants
      
      onJoin(username, email);
      onClose();
    } catch (error) {
      console.error("Error joining session:", error);
      toast({
        title: "Error",
        description: "Failed to join session. Please try again.",
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
          <DialogTitle className="text-xl text-white">Join Live Session</DialogTitle>
          <DialogDescription>
            {session ? `Join "${session.title}" session` : "Enter your details to join the session"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right col-span-1">
                Name
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="col-span-3 bg-black/60 border-white/20"
                placeholder="Your display name"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right col-span-1">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3 bg-black/60 border-white/20"
                placeholder="your.email@example.com"
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
              {isLoading ? "Joining..." : "Join Session"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinSessionModal;
