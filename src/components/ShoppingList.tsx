import React from 'react';
import { LogOut, ShoppingCart, Package } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useShoppingItems } from '../hooks/useShoppingItems';
import { ShoppingItemCard } from './ShoppingItemCard';
import { AddItemForm } from './AddItemForm';

export function ShoppingList() {
  const { user, signOut } = useAuth();
  const { items, loading, addItem, updateItem, deleteItem } = useShoppingItems(user?.id);

  const completedItems = items.filter(item => item.completed);
  const pendingItems = items.filter(item => !item.completed);

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
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Brak produktów na liście</h2>
            <p className="text-gray-500">Dodaj swój pierwszy produkt do listy zakupów</p>
          </div>
        ) : (
          <div className="space-y-8">
            {pendingItems.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <ShoppingCart className="w-6 h-6 mr-2 text-blue-500" />
                  Do kupienia ({pendingItems.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingItems.map((item) => (
                    <ShoppingItemCard
                      key={item.id}
                      item={item}
                      onUpdate={updateItem}
                      onDelete={deleteItem}
                    />
                  ))}
                </div>
              </section>
            )}

            {completedItems.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Package className="w-6 h-6 mr-2 text-green-500" />
                  Kupione ({completedItems.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedItems.map((item) => (
                    <ShoppingItemCard
                      key={item.id}
                      item={item}
                      onUpdate={updateItem}
                      onDelete={deleteItem}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {user && <AddItemForm userId={user.id} onAdd={addItem} />}
    </div>
  );
}