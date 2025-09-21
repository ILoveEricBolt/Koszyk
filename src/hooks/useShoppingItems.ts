import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { ShoppingItem } from '../types';

export function useShoppingItems(userId?: string) {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchItems();
    }
  }, [userId]);

  const fetchItems = async () => {
    if (!userId) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('shopping_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setItems(data);
    }
    setLoading(false);
  };

  const addItem = async (item: Omit<ShoppingItem, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('shopping_items')
      .insert([item])
      .select()
      .single();

    if (!error && data) {
      setItems(prev => [data, ...prev]);
    }
    return { error };
  };

  const updateItem = async (id: string, updates: Partial<ShoppingItem>) => {
    const { data, error } = await supabase
      .from('shopping_items')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setItems(prev => prev.map(item => item.id === id ? data : item));
    }
    return { error };
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase
      .from('shopping_items')
      .delete()
      .eq('id', id);

    if (!error) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
    return { error };
  };

  return { items, loading, addItem, updateItem, deleteItem, refetch: fetchItems };
}