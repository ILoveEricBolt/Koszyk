import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Folder } from '../types';

export function useFolders(userId?: string) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchFolders();
    }
  }, [userId]);

  const fetchFolders = async () => {
    if (!userId) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setFolders(data);
    }
    setLoading(false);
  };

  const addFolder = async (folder: Omit<Folder, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('folders')
      .insert([folder])
      .select()
      .single();

    if (!error && data) {
      setFolders(prev => [data, ...prev]);
    }
    return { error };
  };

  const updateFolder = async (id: string, updates: Partial<Folder>) => {
    const { data, error } = await supabase
      .from('folders')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setFolders(prev => prev.map(folder => folder.id === id ? data : folder));
    }
    return { error };
  };

  const deleteFolder = async (id: string) => {
    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', id);

    if (!error) {
      setFolders(prev => prev.filter(folder => folder.id !== id));
    }
    return { error };
  };

  return { folders, loading, addFolder, updateFolder, deleteFolder, refetch: fetchFolders };
}