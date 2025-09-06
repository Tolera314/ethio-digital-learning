import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface UseRealtimeDataOptions {
  table: string;
  filter?: string;
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
  enabled?: boolean;
}

export const useRealtimeData = ({
  table,
  filter,
  onInsert,
  onUpdate,
  onDelete,
  enabled = true
}: UseRealtimeDataOptions) => {
  const { user } = useAuth();
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const handleInsert = useCallback((payload: any) => {
    console.log(`${table} INSERT:`, payload);
    onInsert?.(payload);
  }, [table, onInsert]);

  const handleUpdate = useCallback((payload: any) => {
    console.log(`${table} UPDATE:`, payload);
    onUpdate?.(payload);
  }, [table, onUpdate]);

  const handleDelete = useCallback((payload: any) => {
    console.log(`${table} DELETE:`, payload);
    onDelete?.(payload);
  }, [table, onDelete]);

  useEffect(() => {
    if (!enabled || !user) return;

    const channelName = `realtime-${table}-${Date.now()}`;
    const newChannel = supabase.channel(channelName);

    const baseConfig = {
      event: '*',
      schema: 'public',
      table: table
    };

    const config = filter 
      ? { ...baseConfig, filter }
      : baseConfig;

    newChannel
      .on('postgres_changes', {
        ...config,
        event: 'INSERT'
      }, handleInsert)
      .on('postgres_changes', {
        ...config,
        event: 'UPDATE'
      }, handleUpdate)
      .on('postgres_changes', {
        ...config,
        event: 'DELETE'
      }, handleDelete)
      .subscribe((status) => {
        console.log(`Realtime ${table} channel status:`, status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    setChannel(newChannel);

    return () => {
      newChannel.unsubscribe();
      supabase.removeChannel(newChannel);
    };
  }, [table, filter, enabled, user, handleInsert, handleUpdate, handleDelete]);

  return {
    channel,
    isConnected
  };
};