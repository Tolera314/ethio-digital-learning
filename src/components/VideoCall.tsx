
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VideoCallProps {
  sessionId: string;
  username: string;
  email: string;
  isHost: boolean;
  onExit: () => void;
}

type Participant = {
  id: string;
  username: string;
  isVideoOn: boolean;
  isAudioOn: boolean;
};

const VideoCall = ({ sessionId, username, email, isHost, onExit }: VideoCallProps) => {
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  
  // These would normally connect to a WebRTC service
  useEffect(() => {
    // Simulating joining a session
    const newParticipant = {
      id: email,
      username,
      isVideoOn,
      isAudioOn
    };
    
    setParticipants([newParticipant, {
      id: "host@example.com",
      username: "Session Host",
      isVideoOn: true,
      isAudioOn: true
    }]);

    // Simulate getting local video stream
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error("Error accessing media devices:", err);
          toast({
            title: "Camera access error",
            description: "Could not access your camera or microphone",
            variant: "destructive",
          });
        });
    }

    // In a real implementation, we would:
    // 1. Connect to a WebRTC signaling server
    // 2. Set up peer connections
    // 3. Exchange ICE candidates
    // 4. Set up media streams

    // Announce user join to the channel using Supabase Realtime
    const channel = supabase.channel(`session-${sessionId}`);
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        channel.track({
          user: username,
          email: email,
          event: 'joined',
          timestamp: new Date().toISOString()
        });
      }
    });

    return () => {
      // Cleanup: disconnect from session, stop tracks
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
      supabase.removeChannel(channel);
    };
  }, [sessionId, username, email]);

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    // In a real app, we would toggle the audio track
    toast({
      title: isAudioOn ? "Microphone Off" : "Microphone On",
      description: isAudioOn ? "Your microphone has been muted" : "Your microphone is now active",
    });
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    // In a real app, we would toggle the video track
    toast({
      title: isVideoOn ? "Camera Off" : "Camera On",
      description: isVideoOn ? "Your camera has been turned off" : "Your camera is now active",
    });
  };

  const endCall = () => {
    // In a real app, we would disconnect from the WebRTC session
    toast({
      title: "Call Ended",
      description: "You have left the session",
    });
    onExit();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-auto">
        {/* Local video (yourself) */}
        <div className="relative bg-gray-900 rounded-lg overflow-hidden h-60 md:h-80">
          <video 
            ref={localVideoRef} 
            autoPlay 
            muted 
            playsInline
            className={`w-full h-full object-cover ${!isVideoOn && 'hidden'}`}
          />
          {!isVideoOn && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-20 w-20 rounded-full bg-purple-700 flex items-center justify-center text-2xl text-white font-bold">
                {username.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="bg-black/70">
              {username} (You)
            </Badge>
          </div>
        </div>

        {/* Remote participants */}
        {participants.filter(p => p.id !== email).map(participant => (
          <div key={participant.id} className="relative bg-gray-900 rounded-lg overflow-hidden h-60 md:h-80">
            {participant.isVideoOn ? (
              <div className="w-full h-full bg-gradient-to-br from-purple-900/80 to-blue-900/80 flex items-center justify-center">
                <div className="h-20 w-20 rounded-full bg-purple-700 flex items-center justify-center text-2xl text-white font-bold">
                  {participant.username.charAt(0).toUpperCase()}
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-20 w-20 rounded-full bg-purple-700 flex items-center justify-center text-2xl text-white font-bold">
                  {participant.username.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
            <div className="absolute bottom-2 left-2 flex items-center space-x-2">
              <Badge variant="secondary" className="bg-black/70">
                {participant.username}
              </Badge>
              {!participant.isAudioOn && <MicOff size={14} className="text-red-500" />}
            </div>
          </div>
        ))}
      </div>

      {/* Controls bar */}
      <div className="bg-black/60 p-4 rounded-lg mt-4 flex justify-center items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          className={`rounded-full h-12 w-12 ${!isAudioOn ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-800'}`}
          onClick={toggleAudio}
        >
          {isAudioOn ? <Mic size={20} /> : <MicOff size={20} />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={`rounded-full h-12 w-12 ${!isVideoOn ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-800'}`}
          onClick={toggleVideo}
        >
          {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
        </Button>
        <Button
          variant="destructive"
          size="icon"
          className="rounded-full h-12 w-12 bg-red-600 hover:bg-red-700"
          onClick={endCall}
        >
          <PhoneOff size={20} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-12 w-12 bg-gray-800"
        >
          <Users size={20} />
          <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-green-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">{participants.length}</span>
        </Button>
      </div>
    </div>
  );
};

export default VideoCall;
