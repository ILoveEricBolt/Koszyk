import React, { useState } from 'react';
import { ExternalLink, Trash2, Check, X, Edit3, Ban } from 'lucide-react';
import type { ShoppingItem, Folder } from '../types';

interface ShoppingItemCardProps {
  item: ShoppingItem;
  folders: Folder[];
  onUpdate: (id: string, updates: Partial<ShoppingItem>) => Promise<{ error: any }>;
  onDelete: (id: string) => Promise<{ error: any }>;
}

export function ShoppingItemCard({ item, folders, onUpdate, onDelete }: ShoppingItemCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(item.name);
  const [editedFolderId, setEditedFolderId] = useState(item.folder_id || '');
  const [editedLink, setEditedLink] = useState(item.purchase_link || '');
  const [editedImageUrl, setEditedImageUrl] = useState(item.image_url || '');

  const handleStatusChange = (status: 'pending' | 'completed' | 'cancelled') => {
    onUpdate(item.id, { status });
  };

  const handleSaveEdit = async () => {
    await onUpdate(item.id, {
      name: editedName,
      folder_id: editedFolderId || null,
      purchase_link: editedLink || null,
      image_url: editedImageUrl || null,
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedName(item.name);
    setEditedFolderId(item.folder_id || '');
    setEditedLink(item.purchase_link || '');
    setEditedImageUrl(item.image_url || '');
    setIsEditing(false);
  };

  const getStatusColor = () => {
    switch (item.status) {
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (item.status) {
      case 'completed': return <Check className="w-12 h-12 text-white" />;
      case 'cancelled': return <X className="w-12 h-12 text-white" />;
      default: return null;
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${item.status !== 'pending' ? 'opacity-75' : ''}`}>
      {item.image_url && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          {item.status !== 'pending' && (
            <div className={`absolute inset-0 ${getStatusColor()} bg-opacity-80 flex items-center justify-center`}>
              {getStatusIcon()}
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nazwa produktu"
            />
            <select
              value={editedFolderId}
              onChange={(e) => setEditedFolderId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Bez folderu</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
            <input
              type="url"
              value={editedLink}
              onChange={(e) => setEditedLink(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Link do zakupu"
            />
            <input
              type="url"
              value={editedImageUrl}
              onChange={(e) => setEditedImageUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Link do zdjęcia"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Zapisz
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Anuluj
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className={`text-xl font-semibold ${item.status !== 'pending' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Zaktualizowano: {new Date(item.updated_at).toLocaleDateString('pl-PL')}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {item.purchase_link && (
                  <a
                    href={item.purchase_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Kup teraz
                  </a>
                )}
              </div>
              
              <div className="flex space-x-2">
                {item.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange('completed')}
                      className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-all"
                      title="Oznacz jako kupione"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleStatusChange('cancelled')}
                      className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                      title="Anuluj"
                    >
                      <Ban className="w-5 h-5" />
                    </button>
                  </>
                )}
                {item.status !== 'pending' && (
                  <button
                    onClick={() => handleStatusChange('pending')}
                    className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                    title="Przywróć do listy"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}