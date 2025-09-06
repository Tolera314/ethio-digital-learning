import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users, ScreenShare, MessageSquare, Edit3, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { useRealtimePresence } from "@/hooks/useRealtimePresence";
import { supabase } from "@/integrations/supabase/client";

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
  isScreenSharing?: boolean;
};

const OptimizedVideoCall = ({ sessionId, username, email, isHost, onExit }: VideoCallProps) => {
  // Media state
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  
  // UI state
  const [chatPanelOpen, setChatPanelOpen] = useState(false);
  const [messages, setMessages] = useState<{sender: string, text: string, timestamp: string}[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [layout, setLayout] = useState<"gallery" | "speaker">("gallery");
  const [videoTitle, setVideoTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  
  // Device state
  const [audioOutputDevice, setAudioOutputDevice] = useState<string>("default");
  const [availableDevices, setAvailableDevices] = useState<{
    videoInputs: MediaDeviceInfo[],
    audioInputs: MediaDeviceInfo[],
    audioOutputs: MediaDeviceInfo[]
  }>({
    videoInputs: [],
    audioInputs: [],
    audioOutputs: []
  });

  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const participantId = isHost ? email : `user_${Math.random().toString(36).substr(2, 9)}`;

  // Get available devices
  useEffect(() => {
    async function getAvailableDevices() {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        
        setAvailableDevices({
          videoInputs: devices.filter(device => device.kind === "videoinput"),
          audioInputs: devices.filter(device => device.kind === "audioinput"),
          audioOutputs: devices.filter(device => device.kind === "audiooutput")
        });
      } catch (err) {
        console.error("Error getting devices:", err);
        toast({
          title: "Device Access Error",
          description: "Please allow access to your camera and microphone",
          variant: "destructive"
        });
      }
    }
    
    getAvailableDevices();
  }, [toast]);

  // Initialize media streams
  useEffect(() => {
    initializeMediaStreams();
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Use optimized presence hook for better real-time communication
  const { trackPresence, sendBroadcast } = useRealtimePresence({
    channelName: `live-session-${sessionId}`,
    initialPresence: {
      username,
      isVideoOn,
      isAudioOn,
      isHost,
      isScreenSharing
    },
    onPresenceSync: (presenceState) => {
      const presentParticipants = Object.values(presenceState).flat().map((p: any) => ({
        id: p.user_id || p.id || participantId,
        username: p.username,
        isVideoOn: p.isVideoOn,
        isAudioOn: p.isAudioOn,
        isScreenSharing: p.isScreenSharing || false
      }));
      setParticipants(presentParticipants as Participant[]);
    },
    onUserJoin: (user) => {
      toast({
        title: "User Joined",
        description: `${user.username} joined the session`,
      });
    },
    onUserLeave: (user) => {
      toast({
        title: "User Left", 
        description: `${user.username} left the session`,
      });
    }
  });

  // Set up real-time chat messaging
  useEffect(() => {
    const chatChannel = supabase.channel(`session-chat-${sessionId}`);
    
    chatChannel
      .on('broadcast', { event: 'chat' }, (payload) => {
        if (payload.payload && payload.payload.message) {
          setMessages(prev => [...prev, {
            sender: payload.payload.sender,
            text: payload.payload.message,
            timestamp: new Date().toISOString()
          }]);
          
          // Scroll to bottom of chat
          if (chatContainerRef.current) {
            setTimeout(() => {
              if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
              }
            }, 100);
          }
        }
      })
      .on('broadcast', { event: 'title-update' }, (payload) => {
        if (payload.payload && payload.payload.title !== undefined) {
          setVideoTitle(payload.payload.title);
        }
      })
      .subscribe((status) => {
        console.log(`Chat channel status: ${status}`);
      });

    return () => {
      chatChannel.unsubscribe();
      supabase.removeChannel(chatChannel);
    };
  }, [sessionId]);

  // Handle audio/video status changes
  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = isVideoOn;
      });
      
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = isAudioOn;
      });

      // Update presence with new status
      trackPresence({
        isVideoOn,
        isAudioOn,
        isScreenSharing
      });
    }
  }, [isAudioOn, isVideoOn, isScreenSharing, trackPresence]);

  const initializeMediaStreams = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        
        localStreamRef.current = stream;
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          
          stream.getVideoTracks().forEach(track => {
            track.enabled = isVideoOn;
          });
          
          stream.getAudioTracks().forEach(track => {
            track.enabled = isAudioOn;
          });
        }
        
        toast({
          title: "You're live!",
          description: "Your camera and microphone are active",
        });
      }
    } catch (err) {
      console.error("Error accessing media devices:", err);
      toast({
        title: "Camera access error",
        description: "Could not access your camera or microphone. Please check your permissions.",
        variant: "destructive",
      });
      
      // Fall back to audio only if video fails
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStreamRef.current = audioStream;
        setIsVideoOn(false);
        
        toast({
          title: "Audio-only mode",
          description: "Connected with microphone only. Camera access was denied.",
          variant: "default",
        });
      } catch (audioErr) {
        console.error("Error accessing audio:", audioErr);
        toast({
          title: "Connection error",
          description: "Could not connect to audio or video. Please check your device permissions.",
          variant: "destructive",
        });
      }
    }
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    toast({
      title: isAudioOn ? "Microphone Off" : "Microphone On",
      description: isAudioOn ? "Your microphone has been muted" : "Your microphone is now active",
    });
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    toast({
      title: isVideoOn ? "Camera Off" : "Camera On",
      description: isVideoOn ? "Your camera has been turned off" : "Your camera is now active",
    });
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop screen sharing
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
        screenStreamRef.current = null;
      }
      setIsScreenSharing(false);
      toast({
        title: "Screen sharing stopped",
        description: "You are no longer sharing your screen",
      });
    } else {
      // Start screen sharing
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        screenStreamRef.current = screenStream;
        
        if (screenShareRef.current) {
          screenShareRef.current.srcObject = screenStream;
        }
        
        setIsScreenSharing(true);
        toast({
          title: "Screen sharing started",
          description: "You are now sharing your screen",
        });
        
        // Listen for when user stops sharing via browser UI
        screenStream.getVideoTracks()[0].addEventListener('ended', () => {
          setIsScreenSharing(false);
          screenStreamRef.current = null;
          toast({
            title: "Screen sharing stopped",
            description: "Screen sharing has ended",
          });
        });
      } catch (err) {
        console.error("Error starting screen share:", err);
        toast({
          title: "Screen sharing error",
          description: "Could not start screen sharing. Please check your browser permissions.",
          variant: "destructive",
        });
      }
    }
  };

  const sendChatMessage = () => {
    if (newMessage.trim()) {
      sendBroadcast('chat', {
        sender: username,
        message: newMessage.trim()
      });
      
      // Add to local messages immediately for better UX
      setMessages(prev => [...prev, {
        sender: username,
        text: newMessage.trim(),
        timestamp: new Date().toISOString()
      }]);
      
      setNewMessage("");
      
      if (chatInputRef.current) {
        chatInputRef.current.focus();
      }
    }
  };

  const updateVideoTitle = (title: string) => {
    setVideoTitle(title);
    sendBroadcast('title-update', { title });
  };

  const handleTitleEdit = () => {
    setTempTitle(videoTitle);
    setIsEditingTitle(true);
  };

  const cancelTitleEdit = () => {
    setIsEditingTitle(false);
    setTempTitle("");
  };

  const saveTitleEdit = () => {
    updateVideoTitle(tempTitle);
    setIsEditingTitle(false);
    setTempTitle("");
  };

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    onExit();
  };

  const changeAudioOutput = async (deviceId: string) => {
    setAudioOutputDevice(deviceId);
    
    if (localVideoRef.current && 'setSinkId' in localVideoRef.current) {
      try {
        await (localVideoRef.current as any).setSinkId(deviceId);
        toast({
          title: "Audio Output Changed",
          description: "Audio output device has been updated",
        });
      } catch (err) {
        console.error("Error changing audio output:", err);
        toast({
          title: "Audio Output Error",
          description: "Could not change audio output device",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center space-x-4">
          {isEditingTitle && isHost ? (
            <div className="flex items-center space-x-2">
              <Input
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white max-w-xs"
                placeholder="Enter session title..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') saveTitleEdit();
                  if (e.key === 'Escape') cancelTitleEdit();
                }}
                autoFocus
              />
              <Button size="sm" onClick={saveTitleEdit}>
                <Check className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={cancelTitleEdit}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white">
                {videoTitle || "Live Session"}
              </h1>
              {isHost && (
                <Button size="sm" variant="ghost" onClick={handleTitleEdit}>
                  <Edit3 className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-green-600 text-white">
            <Users className="w-4 h-4 mr-1" />
            {participants.length} participants
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 relative">
          {/* Layout Controls */}
          <div className="absolute top-4 left-4 z-10">
            <ToggleGroup type="single" value={layout} onValueChange={(value) => value && setLayout(value as "gallery" | "speaker")}>
              <ToggleGroupItem value="gallery" className="bg-black/50 text-white border-gray-600">
                Gallery
              </ToggleGroupItem>
              <ToggleGroupItem value="speaker" className="bg-black/50 text-white border-gray-600">
                Speaker
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Video Grid */}
          <div className={`h-full p-4 ${
            layout === "gallery" 
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" 
              : "flex flex-col"
          }`}>
            {/* Local Video */}
            <div className={`relative rounded-lg overflow-hidden bg-gray-800 ${
              layout === "speaker" ? "h-32 w-48" : "aspect-video"
            }`}>
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-1">
                <span className="text-white text-sm">{username} (You)</span>
              </div>
              {!isAudioOn && (
                <div className="absolute top-2 right-2 bg-red-600 rounded-full p-1">
                  <MicOff className="w-4 h-4 text-white" />
                </div>
              )}
              {!isVideoOn && (
                <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
                  <VideoOff className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Screen Share */}
            {isScreenSharing && (
              <div className={`relative rounded-lg overflow-hidden bg-gray-800 ${
                layout === "speaker" ? "flex-1" : "aspect-video col-span-2"
              }`}>
                <video
                  ref={screenShareRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-1">
                  <span className="text-white text-sm">Screen Share</span>
                </div>
              </div>
            )}

            {/* Other Participants */}
            {participants.filter(p => p.id !== participantId).map((participant) => (
              <div key={participant.id} className={`relative rounded-lg overflow-hidden bg-gray-800 ${
                layout === "speaker" ? "h-32 w-48" : "aspect-video"
              }`}>
                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <div className="text-white text-4xl font-bold">
                    {participant.username.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 bg-black/70 rounded px-2 py-1">
                  <span className="text-white text-sm">{participant.username}</span>
                </div>
                {!participant.isAudioOn && (
                  <div className="absolute top-2 right-2 bg-red-600 rounded-full p-1">
                    <MicOff className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Panel */}
        {chatPanelOpen && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-white font-medium">Chat</h3>
            </div>
            
            <ScrollArea className="flex-1 p-4" ref={chatContainerRef}>
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div key={index} className="text-sm">
                    <div className="text-gray-400 text-xs">{message.sender}</div>
                    <div className="text-white bg-gray-700 rounded p-2 mt-1">
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <Input
                  ref={chatInputRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700 border-gray-600 text-white"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') sendChatMessage();
                  }}
                />
                <Button onClick={sendChatMessage}>
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4 border-t border-gray-700">
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant={isAudioOn ? "default" : "destructive"}
            size="lg"
            onClick={toggleAudio}
            className="rounded-full w-12 h-12 p-0"
          >
            {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </Button>
          
          <Button
            variant={isVideoOn ? "default" : "destructive"}
            size="lg"
            onClick={toggleVideo}
            className="rounded-full w-12 h-12 p-0"
          >
            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </Button>
          
          <Button
            variant={isScreenSharing ? "secondary" : "outline"}
            size="lg"
            onClick={toggleScreenShare}
            className="rounded-full w-12 h-12 p-0"
          >
            <ScreenShare className="w-5 h-5" />
          </Button>
          
          <Button
            variant={chatPanelOpen ? "secondary" : "outline"}
            size="lg"
            onClick={() => setChatPanelOpen(!chatPanelOpen)}
            className="rounded-full w-12 h-12 p-0"
          >
            <MessageSquare className="w-5 h-5" />
          </Button>
          
          <Button
            variant="destructive"
            size="lg"
            onClick={endCall}
            className="rounded-full w-12 h-12 p-0"
          >
            <PhoneOff className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Audio Output Selector (Desktop only) */}
        {!isMobile && availableDevices.audioOutputs.length > 1 && (
          <div className="mt-4 flex items-center justify-center">
            <select
              value={audioOutputDevice}
              onChange={(e) => changeAudioOutput(e.target.value)}
              className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-1 text-sm"
            >
              {availableDevices.audioOutputs.map(device => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Speaker ${device.deviceId.slice(0, 8)}`}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptimizedVideoCall;
