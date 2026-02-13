import React, { useState } from 'react';
import { CartItem as CartItemType } from '@/types';
import { useCartStore } from '@/store/cart.store';
import toast from 'react-hot-toast';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(item.menuItemId, newQuantity);
    
    toast.success(`Updated ${item.name} quantity`, {
      icon: '✏️',
      duration: 2000,
    });
  };

  const handleRemove = () => {
    setIsRemoving(true);
    
    setTimeout(() => {
      removeItem(item.menuItemId);
      toast.success(`${item.name} removed from cart`, {
        icon: '🗑️',
        style: {
          background: '#ef4444',
          color: 'white',
        },
      });
    }, 300);
  };

  return (
    <div className={`
      glass-card p-4 transition-all duration-300 hover:shadow-lg
      ${isRemoving ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
    `}>
      <div className="flex items-center space-x-4">
        <div className="relative group">
          <img
            src={item.image}
            alt={item.name}
            className="w-20 h-20 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/80x80?text=🍽️';
            }}
          />
          <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-800 text-lg truncate">{item.name}</h4>
          <p className="text-green-600 font-semibold text-lg">${item.price.toFixed(2)} each</p>
          <div className="flex items-center mt-2 space-x-1">
            <span className="text-yellow-400 text-sm">⭐</span>
            <span className="text-xs text-gray-500">4.8 rating</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="w-10 h-10 rounded-xl bg-white hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-gray-600 font-bold shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
              disabled={item.quantity <= 1}
            >
              −
            </button>
            
            <span className="w-12 text-center font-bold text-lg text-gray-800">
              {item.quantity}
            </span>
            
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="w-10 h-10 rounded-xl bg-white hover:bg-green-50 hover:text-green-600 flex items-center justify-center text-gray-600 font-bold shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              +
            </button>
          </div>
        </div>

        <div className="text-right">
          <p className="font-bold text-xl text-gray-800 mb-2">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
          <button
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            🗑️ Remove
          </button>
        </div>
      </div>
    </div>
  );
};