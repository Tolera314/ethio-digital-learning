import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users, ScreenShare, MessageSquare, Edit3, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";

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

const VideoCall = ({ sessionId, username, email, isHost, onExit }: VideoCallProps) => {
  // Set both audio and video to true by default for better user experience
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  // For hosts, automatically start the session
  const [hasStartedSession, setHasStartedSession] = useState(true);
  const [chatPanelOpen, setChatPanelOpen] = useState(false);
  const [messages, setMessages] = useState<{sender: string, text: string, timestamp: string}[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [layout, setLayout] = useState<"gallery" | "speaker">("gallery");
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
  const [videoTitle, setVideoTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Get available devices
  useEffect(() => {
    async function getAvailableDevices() {
      try {
        // Request permissions first to get accurate device list
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
          description: "Please allow access to your camera and microphone to join the session",
          variant: "destructive"
        });
      }
    }
    
    getAvailableDevices();
  }, [toast]);

  // Initialize WebRTC and media streams - automatically start when component mounts
  useEffect(() => {
    if (hasStartedSession) {
      initializeMediaStreams();
      
      // Announce user join to the channel using Supabase Realtime
      const channel = supabase.channel(`session-${sessionId}`);
      
      // Set up presence tracking for participants
      channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Add current user to presence
          await channel.track({
            id: email,
            username: username,
            isVideoOn,
            isAudioOn,
            isHost,
            timestamp: new Date().toISOString()
          });
          
          // Handle presence changes (users joining/leaving)
          channel.on('presence', { event: 'sync' }, () => {
            const state = channel.presenceState();
            const presentParticipants = Object.values(state).flat().map((p: any) => ({
              id: p.id,
              username: p.username,
              isVideoOn: p.isVideoOn,
              isAudioOn: p.isAudioOn,
              isScreenSharing: p.isScreenSharing || false
            }));
            
            setParticipants(presentParticipants as Participant[]);
          });
          
          // Listen for broadcast messages (chat)
          channel.on('broadcast', { event: 'chat' }, (payload) => {
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
          });
          
          // Listen for status updates (mic/camera toggle)
          channel.on('broadcast', { event: 'status-update' }, (payload) => {
            if (payload.payload) {
              setParticipants(prev => 
                prev.map(p => {
                  if (p.id === payload.payload.id) {
                    return {...p, ...payload.payload};
                  }
                  return p;
                })
              );
            }
          });
          
          // Listen for title updates
          channel.on('broadcast', { event: 'title-update' }, (payload) => {
            if (payload.payload && payload.payload.title !== undefined) {
              setVideoTitle(payload.payload.title);
            }
          });
        }
      });

      return () => {
        // Cleanup: disconnect from session, stop tracks
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach(track => track.stop());
        }
        
        if (screenStreamRef.current) {
          screenStreamRef.current.getTracks().forEach(track => track.stop());
        }
        
        supabase.removeChannel(channel);
      };
    }
  }, [sessionId, username, email, hasStartedSession, isHost, isVideoOn, isAudioOn]);

  // Handle audio/video status changes
  useEffect(() => {
    if (hasStartedSession) {
      // Update local stream tracks
      if (localStreamRef.current) {
        localStreamRef.current.getVideoTracks().forEach(track => {
          track.enabled = isVideoOn;
        });
        
        localStreamRef.current.getAudioTracks().forEach(track => {
          track.enabled = isAudioOn;
        });
      }
      
      // Broadcast status update to other participants
      const channel = supabase.channel(`session-${sessionId}`);
      channel.send({
        type: 'broadcast',
        event: 'status-update',
        payload: {
          id: email,
          isVideoOn,
          isAudioOn
        }
      });
    }
  }, [isAudioOn, isVideoOn, email, sessionId, hasStartedSession]);

  const initializeMediaStreams = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Request user media with camera and mic on by default
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
          
          // Set initial track states - default to ON
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
      
      if (screenShareRef.current) {
        screenShareRef.current.srcObject = null;
      }
      
      setIsScreenSharing(false);
      
      // Update status in presence
      const channel = supabase.channel(`session-${sessionId}`);
      await channel.track({
        id: email,
        username: username,
        isVideoOn,
        isAudioOn,
        isScreenSharing: false,
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: "Screen Sharing Stopped",
        description: "You are no longer sharing your screen",
      });
    } else {
      // Start screen sharing
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        
        screenStreamRef.current = stream;
        
        if (screenShareRef.current) {
          screenShareRef.current.srcObject = stream;
        }
        
        // Handle stream ending (user stops sharing via browser UI)
        stream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          screenStreamRef.current = null;
          
          if (screenShareRef.current) {
            screenShareRef.current.srcObject = null;
          }
          
          // Update status in presence
          const channel = supabase.channel(`session-${sessionId}`);
          channel.track({
            id: email,
            username: username,
            isVideoOn,
            isAudioOn,
            isScreenSharing: false,
            timestamp: new Date().toISOString()
          });
        };
        
        setIsScreenSharing(true);
        
        // Update status in presence
        const channel = supabase.channel(`session-${sessionId}`);
        await channel.track({
          id: email,
          username: username,
          isVideoOn,
          isAudioOn,
          isScreenSharing: true,
          timestamp: new Date().toISOString()
        });
        
        toast({
          title: "Screen Sharing Started",
          description: "Others can now see your screen",
        });
      } catch (err) {
        console.error("Error sharing screen:", err);
        toast({
          title: "Screen Sharing Error",
          description: "Failed to share your screen",
          variant: "destructive",
        });
      }
    }
  };

  const updateVideoTitle = (newTitle: string) => {
    setVideoTitle(newTitle);
    
    // Broadcast title update to other participants
    const channel = supabase.channel(`session-${sessionId}`);
    channel.send({
      type: 'broadcast',
      event: 'title-update',
      payload: { title: newTitle }
    });
  };

  const handleTitleEdit = () => {
    if (isEditingTitle) {
      updateVideoTitle(tempTitle);
      setIsEditingTitle(false);
    } else {
      setTempTitle(videoTitle);
      setIsEditingTitle(true);
    }
  };

  const cancelTitleEdit = () => {
    setIsEditingTitle(false);
    setTempTitle("");
  };
  
  const startSession = async () => {
    if (!isHost) return;
    
    // Session starts automatically now
    setHasStartedSession(true);
    toast({
      title: "Session Started",
      description: "Students can now join your live session",
    });
  };

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    toast({
      title: "Call Ended",
      description: "You have left the session",
    });
    
    onExit();
  };
  
  const sendChatMessage = () => {
    if (!newMessage.trim()) return;
    
    // Send message through Supabase Realtime
    const channel = supabase.channel(`session-${sessionId}`);
    channel.send({
      type: 'broadcast',
      event: 'chat',
      payload: { 
        sender: username,
        message: newMessage.trim()
      }
    });
    
    // Add message to local state
    setMessages(prev => [...prev, {
      sender: username,
      text: newMessage.trim(),
      timestamp: new Date().toISOString()
    }]);
    
    // Clear input
    setNewMessage("");
    
    // Focus input for next message
    if (chatInputRef.current) {
      chatInputRef.current.focus();
    }
    
    // Scroll to bottom of chat
    if (chatContainerRef.current) {
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  };
  
  const changeAudioOutput = (deviceId: string) => {
    setAudioOutputDevice(deviceId);
    
    // Set audio output device for all video elements
    if ('setSinkId' in HTMLMediaElement.prototype) {
      if (localVideoRef.current) {
        (localVideoRef.current as any).setSinkId(deviceId);
      }
      
      if (screenShareRef.current) {
        (screenShareRef.current as any).setSinkId(deviceId);
      }
      
      // Set for participant videos
      document.querySelectorAll('video.participant-video').forEach(el => {
        (el as any).setSinkId(deviceId);
      });
      
      toast({
        title: "Audio Output Changed",
        description: "Audio will now play through the selected device",
      });
    }
  };
  
  // Host pre-session screen - automatically starts now
  if (isHost && !hasStartedSession) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8">
        <div className="glass-morphism max-w-2xl w-full p-8 rounded-xl text-center">
          <h2 className="text-2xl font-bold mb-6 text-white">Ready to Start Your Live Session?</h2>
          
          <div className="relative bg-gray-900 rounded-lg overflow-hidden h-60 md:h-72 mb-6">
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
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center mb-6">
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
          </div>
          
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white w-full md:w-auto px-8"
            onClick={startSession}
          >
            Start Live Session
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Main content: Videos and chat */}
      <div className="flex-1 grid grid-cols-1 gap-4 overflow-hidden">
        <div className={`${chatPanelOpen ? 'md:col-span-2' : 'col-span-full'} flex flex-col`}>
          {/* Video layout toggle */}
          <div className="mb-4 flex justify-center">
            <ToggleGroup type="single" value={layout} onValueChange={(value) => value && setLayout(value as "gallery" | "speaker")}>
              <ToggleGroupItem value="gallery" aria-label="Gallery View">
                Gallery View
              </ToggleGroupItem>
              <ToggleGroupItem value="speaker" aria-label="Speaker View">
                Speaker View
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          {/* Active screen share */}
          {isScreenSharing && (
            <div className="relative bg-black rounded-lg overflow-hidden mb-4 h-96 lg:h-[500px]">
              <video 
                ref={screenShareRef}
                autoPlay 
                playsInline
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-2 left-2">
                <Badge variant="secondary" className="bg-black/70">
                  Screen Share: {username}
                </Badge>
              </div>
            </div>
          )}
          
          {/* Videos layout */}
          <div className={`flex-1 grid gap-4 overflow-auto p-4 ${layout === "gallery" 
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
            : "grid-cols-1"}`}
          >
            {/* Local video (yourself) */}
            <div className={`relative bg-gray-900 rounded-lg overflow-hidden ${layout === "gallery" 
              ? "h-60 md:h-64" 
              : "h-60 md:h-80 lg:h-96"}`}
            >
              <video 
                ref={localVideoRef} 
                autoPlay 
                muted 
                playsInline
                className={`w-full h-full object-cover ${!isVideoOn && 'hidden'} participant-video`}
              />
              {!isVideoOn && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-20 w-20 rounded-full bg-purple-700 flex items-center justify-center text-2xl text-white font-bold">
                    {username.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}
              
              {/* Video title overlay for host */}
              {isHost && (
                <div className="absolute top-2 left-2 right-2">
                  {isEditingTitle ? (
                    <div className="flex items-center gap-2 bg-black/70 rounded p-2">
                      <Input
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        placeholder="Enter video title..."
                        className="flex-1 text-sm bg-transparent border-white/30"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleTitleEdit();
                          if (e.key === 'Escape') cancelTitleEdit();
                        }}
                        autoFocus
                      />
                      <Button size="sm" variant="ghost" onClick={handleTitleEdit}>
                        <Check size={14} />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={cancelTitleEdit}>
                        <X size={14} />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-black/70 rounded p-2">
                      <span className="text-white text-sm flex-1">
                        {videoTitle || "Click to add title"}
                      </span>
                      <Button size="sm" variant="ghost" onClick={handleTitleEdit}>
                        <Edit3 size={14} />
                      </Button>
                    </div>
                  )}
                </div>
              )}
              
              {/* Host title display for participants */}
              {!isHost && videoTitle && (
                <div className="absolute top-2 left-2 right-2">
                  <div className="bg-black/70 rounded p-2">
                    <span className="text-white text-sm">{videoTitle}</span>
                  </div>
                </div>
              )}
              
              <div className="absolute bottom-2 left-2 flex items-center space-x-2">
                <Badge variant="secondary" className="bg-black/70">
                  {username} (You)
                </Badge>
                {!isAudioOn && <MicOff size={14} className="text-red-500" />}
              </div>
            </div>

            {/* Remote participants */}
            {participants.filter(p => p.id !== email).map((participant) => (
              <div 
                key={participant.id} 
                className={`relative bg-gray-900 rounded-lg overflow-hidden ${layout === "gallery" 
                  ? "h-60 md:h-64" 
                  : "h-60 md:h-80 lg:h-96"}`}
              >
                <div className="w-full h-full bg-gradient-to-br from-purple-900/80 to-blue-900/80 flex items-center justify-center">
                  <div className="h-20 w-20 rounded-full bg-purple-700 flex items-center justify-center text-2xl text-white font-bold">
                    {participant.username.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-black/70">
                    {participant.username} {participant.isScreenSharing && "(Sharing Screen)"}
                  </Badge>
                  {!participant.isAudioOn && <MicOff size={14} className="text-red-500" />}
                  {!participant.isVideoOn && <VideoOff size={14} className="text-red-500" />}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Chat panel (conditionally shown) */}
        {chatPanelOpen && (
          <div className="col-span-1 glass-morphism rounded-lg p-4 flex flex-col h-full max-h-[600px] md:max-h-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-white">Session Chat</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setChatPanelOpen(false)}
              >
                Close
              </Button>
            </div>
            
            {/* Chat messages */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 italic py-4">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex flex-col ${msg.sender === username ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`rounded-lg px-3 py-2 max-w-[85%] break-words ${
                      msg.sender === username 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-800 text-gray-100'
                    }`}>
                      <p className="text-xs font-medium mb-1">{msg.sender}</p>
                      <p>{msg.text}</p>
                    </div>
                    <span className="text-xs text-gray-400 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                ))
              )}
            </div>
            
            {/* Chat input */}
            <div className="flex space-x-2">
              <input
                ref={chatInputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              />
              <Button onClick={sendChatMessage}>Send</Button>
            </div>
          </div>
        )}
      </div>

      {/* Controls bar */}
      <div className="bg-black/60 p-4 rounded-lg mt-4 flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex space-x-3 md:space-x-4">
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
            variant="outline"
            size="icon"
            className={`rounded-full h-12 w-12 ${isScreenSharing ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-800'}`}
            onClick={toggleScreenShare}
          >
            <ScreenShare size={20} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full h-12 w-12 ${chatPanelOpen ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-800'}`}
            onClick={() => setChatPanelOpen(!chatPanelOpen)}
          >
            <MessageSquare size={20} />
            {messages.length > 0 && !chatPanelOpen && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-green-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {messages.length}
              </span>
            )}
          </Button>
        </div>
        
        <div className="h-px w-full md:h-10 md:w-px bg-gray-700 md:mx-2"></div>
        
        <div className="flex space-x-3 md:space-x-4">
          <Button
            variant="destructive"
            size="icon"
            className="rounded-full h-12 w-12"
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
      
      {/* Audio settings (collapsible) */}
      <div className="mt-2">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-sm text-gray-400">Audio Settings</span>
          <Switch id="audio-settings" />
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
