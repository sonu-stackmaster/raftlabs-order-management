import React, { useState } from 'react';
import { MenuItem } from '@/types';
import { useCartStore } from '@/store/cart.store';
import toast from 'react-hot-toast';

interface MenuItemCardProps {
  item: MenuItem;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    // Add a small delay for better UX
    setTimeout(() => {
      addItem({
        menuItemId: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
      });
      
      toast.success(`${item.name} added to cart! 🎉`, {
        icon: '🛒',
        style: {
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
        },
      });
      
      setIsAdding(false);
    }, 300);
  };

  return (
    <div className="glass-card overflow-hidden card-hover group">
      <div className="relative overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/300x200?text=🍽️+Delicious+Food';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Price badge */}
        <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full font-bold shadow-lg">
          ${item.price.toFixed(2)}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
          {item.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span className="text-yellow-400">⭐</span>
            <span className="text-sm text-gray-600">4.8 (120+ reviews)</span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`
              relative overflow-hidden font-semibold py-3 px-6 rounded-xl shadow-lg transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300
              ${isAdding 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 text-white'
              }
            `}
          >
            {isAdding ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Adding...</span>
              </div>
            ) : (
              <span className="flex items-center space-x-2">
                <span>🛒</span>
                <span>Add to Cart</span>
              </span>
            )}
            
            {/* Ripple effect */}
            <div className="absolute inset-0 bg-white/20 transform scale-0 group-active:scale-100 rounded-xl transition-transform duration-300"></div>
          </button>
        </div>
        
        {/* Delivery info */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="flex items-center space-x-1">
              <span>🚚</span>
              <span>20-30 min</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>🔥</span>
              <span>Popular</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};