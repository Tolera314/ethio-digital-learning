import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface PresenceState {
  [key: string]: any;
}

interface UseRealtimePresenceOptions {
  channelName: string;
  initialPresence?: Record<string, any>;
  onPresenceSync?: (presence: PresenceState) => void;
  onUserJoin?: (user: any) => void;
  onUserLeave?: (user: any) => void;
}

export const useRealtimePresence = ({
  channelName,
  initialPresence = {},
  onPresenceSync,
  onUserJoin,
  onUserLeave
}: UseRealtimePresenceOptions) => {
  const { user } = useAuth();
  const [presence, setPresence] = useState<PresenceState>({});
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const trackPresence = useCallback(async (presenceData: Record<string, any>) => {
    if (!channel || !user) return;
    
    const trackData = {
      user_id: user.id,
      timestamp: new Date().toISOString(),
      ...initialPresence,
      ...presenceData
    };

    await channel.track(trackData);
  }, [channel, user, initialPresence]);

  const untrackPresence = useCallback(async () => {
    if (!channel) return;
    await channel.untrack();
  }, [channel]);

  const sendBroadcast = useCallback(async (event: string, payload: any) => {
    if (!channel) return;
    await channel.send({
      type: 'broadcast',
      event,
      payload
    });
  }, [channel]);

  useEffect(() => {
    if (!user) return;

    const newChannel = supabase.channel(channelName, {
      config: {
        presence: { key: user.id }
      }
    });

    newChannel
      .on('presence', { event: 'sync' }, () => {
        const newPresence = newChannel.presenceState();
        setPresence(newPresence);
        onPresenceSync?.(newPresence);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
        onUserJoin?.(newPresences[0]);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
        onUserLeave?.(leftPresences[0]);
      })
      .subscribe(async (status) => {
        console.log(`Presence channel ${channelName} status:`, status);
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          // Track initial presence
          await trackPresence(initialPresence);
        } else {
          setIsConnected(false);
        }
      });

    setChannel(newChannel);

    return () => {
      newChannel.unsubscribe();
      supabase.removeChannel(newChannel);
    };
  }, [channelName, user, initialPresence, onPresenceSync, onUserJoin, onUserLeave, trackPresence]);

  return {
    presence,
    channel,
    isConnected,
    trackPresence,
    untrackPresence,
    sendBroadcast
  };
};