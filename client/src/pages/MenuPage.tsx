import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MenuItem } from '@/types';
import { MenuItemCard } from '@/components/MenuItemCard';
import { orderApi } from '@/api/orderApi';
import { useCartStore } from '@/store/cart.store';
import toast from 'react-hot-toast';

export const MenuPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { items: cartItems, getTotalItems } = useCartStore();
  const totalCartItems = getTotalItems();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const items = await orderApi.getMenuItems();
        setMenuItems(items);
      } catch (err) {
        setError('Failed to load menu items');
        toast.error('Failed to load menu items');
        console.error('Error fetching menu items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center fade-in">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-purple-600 animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
          </div>
          <p className="mt-6 text-white text-lg font-medium">
            Loading delicious menu<span className="loading-dots"></span>
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bounce-in">
          <div className="glass-card p-8 max-w-md mx-4">
            <div className="text-red-500 text-6xl mb-4">😞</div>
            <p className="text-gray-700 mb-6 text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-lg sticky top-0 z-[100] fade-in">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold gradient-text">🍽️ Delicious Bites</h1>
              <p className="text-gray-600 mt-1">Fresh food delivered to your door</p>
            </div>
            <Link
              to="/cart"
              className="relative btn-primary group"
            >
              <span className="flex items-center space-x-2">
                <span>🛒 Cart</span>
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-pulse">
                    {totalCartItems}
                  </span>
                )}
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {menuItems.length === 0 ? (
          <div className="text-center py-20 slide-up">
            <div className="glass-card p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">🍽️</div>
              <p className="text-gray-600 text-xl">No menu items available</p>
              <p className="text-gray-500 mt-2">Check back soon for delicious options!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {menuItems.map((item, index) => (
              <div
                key={item._id}
                className="fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <MenuItemCard item={item} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-3/4 w-48 h-48 bg-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
};