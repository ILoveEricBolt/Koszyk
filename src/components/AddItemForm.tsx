import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { ShoppingItem } from '../types';

interface AddItemFormProps {
  userId: string;
  onAdd: (item: Omit<ShoppingItem, 'id' | 'created_at' | 'updated_at'>) => Promise<{ error: any }>;
}

export function AddItemForm({ userId, onAdd }: AddItemFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [purchaseLink, setPurchaseLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    const { error } = await onAdd({
      user_id: userId,
      name: name.trim(),
      purchase_link: purchaseLink.trim() || null,
      image_url: imageUrl.trim() || null,
      completed: false,
    });

    if (!error) {
      setName('');
      setPurchaseLink('');
      setImageUrl('');
      setIsOpen(false);
    }
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-green-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 z-10"
      >
        <Plus className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Dodaj produkt</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nazwa produktu *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Np. iPhone 15 Pro"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link do zakupu
            </label>
            <input
              type="url"
              value={purchaseLink}
              onChange={(e) => setPurchaseLink(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="https://sklep.pl/produkt"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link do zdjęcia
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-green-600 transition-all disabled:opacity-50"
            >
              {loading ? 'Dodawanie...' : 'Dodaj produkt'}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-400 transition-all"
            >
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}