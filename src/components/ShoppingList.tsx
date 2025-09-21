import React from 'react';
import { LogOut, ShoppingCart, Package, Folder, History, Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useShoppingItems } from '../hooks/useShoppingItems';
import { useFolders } from '../hooks/useFolders';
import { ShoppingItemCard } from './ShoppingItemCard';
import { AddItemForm } from './AddItemForm';
import { AddFolderForm } from './AddFolderForm';
import { useState } from 'react';

export function ShoppingList() {
  const { user, signOut } = useAuth();
  const { items, loading, addItem, updateItem, deleteItem, getItemsByStatus, getItemsByFolder } = useShoppingItems(user?.id);
  const { folders, loading: foldersLoading, addFolder, updateFolder, deleteFolder } = useFolders(user?.id);
  const [activeTab, setActiveTab] = useState<'shopping' | 'history'>('shopping');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [showAddFolder, setShowAddFolder] = useState(false);

  const pendingItems = getItemsByStatus('pending');
  const completedItems = getItemsByStatus('completed');
  const cancelledItems = getItemsByStatus('cancelled');

  const getFilteredItems = (itemList: typeof items) => {
    if (selectedFolder === null) {
      return itemList;
    }
    return getItemsByFolder(selectedFolder || undefined);
  };

  const filteredPendingItems = getFilteredItems(pendingItems);
  const filteredCompletedItems = getFilteredItems(completedItems);
  const filteredCancelledItems = getFilteredItems(cancelledItems);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-green-500 p-2 rounded-xl">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Lista Zakupów</h1>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Wyloguj</span>
            </button>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('shopping')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'shopping'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <ShoppingCart className="w-5 h-5 inline mr-2" />
                Lista zakupów
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <History className="w-5 h-5 inline mr-2" />
                Historia
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {(loading || foldersLoading) ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {activeTab === 'shopping' && (
              <div className="space-y-8">
                {/* Folder Filter */}
                <div className="flex items-center space-x-4 overflow-x-auto pb-2">
                  <button
                    onClick={() => setSelectedFolder(null)}
                    className={`flex items-center px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                      selectedFolder === null
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Wszystkie
                  </button>
                  {folders.map((folder) => (
                    <button
                      key={folder.id}
                      onClick={() => setSelectedFolder(folder.id)}
                      className={`flex items-center px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                        selectedFolder === folder.id
                          ? 'text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      style={{
                        backgroundColor: selectedFolder === folder.id ? folder.color : undefined
                      }}
                    >
                      <Folder className="w-4 h-4 mr-2" />
                      {folder.name}
                    </button>
                  ))}
                  <button
                    onClick={() => setShowAddFolder(true)}
                    className="flex items-center px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nowy folder
                  </button>
                </div>

                {filteredPendingItems.length === 0 && items.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">Brak produktów na liście</h2>
                    <p className="text-gray-500">Dodaj swój pierwszy produkt do listy zakupów</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {filteredPendingItems.length > 0 && (
                      <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                          <ShoppingCart className="w-6 h-6 mr-2 text-blue-500" />
                          Do kupienia ({filteredPendingItems.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredPendingItems.map((item) => (
                            <ShoppingItemCard
                              key={item.id}
                              item={item}
                              folders={folders}
                              onUpdate={updateItem}
                              onDelete={deleteItem}
                            />
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-8">
                {filteredCompletedItems.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <Package className="w-6 h-6 mr-2 text-green-500" />
                      Kupione ({filteredCompletedItems.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredCompletedItems.map((item) => (
                        <ShoppingItemCard
                          key={item.id}
                          item={item}
                          folders={folders}
                          onUpdate={updateItem}
                          onDelete={deleteItem}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {filteredCancelledItems.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <X className="w-6 h-6 mr-2 text-red-500" />
                      Anulowane ({filteredCancelledItems.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredCancelledItems.map((item) => (
                        <ShoppingItemCard
                          key={item.id}
                          item={item}
                          folders={folders}
                          onUpdate={updateItem}
                          onDelete={deleteItem}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {filteredCompletedItems.length === 0 && filteredCancelledItems.length === 0 && (
                  <div className="text-center py-12">
                    <History className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">Brak historii</h2>
                    <p className="text-gray-500">Tutaj pojawią się kupione i anulowane produkty</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {user && <AddItemForm userId={user.id} folders={folders} onAdd={addItem} />}
      {user && (
        <AddFolderForm
          userId={user.id}
          onAdd={addFolder}
          isOpen={showAddFolder}
          onClose={() => setShowAddFolder(false)}
        />
      )}
    </div>
  );
}