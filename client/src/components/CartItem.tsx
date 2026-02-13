import React from 'react';
import { CartItem as CartItemType } from '@/types';
import { useCartStore } from '@/store/cart.store';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.menuItemId, newQuantity);
  };

  const handleRemove = () => {
    removeItem(item.menuItemId);
  };

  return (
    <div className="flex items-center space-x-4 py-4 border-b border-gray-200">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 object-cover rounded-md"
        onError={(e) => {
          e.currentTarget.src = 'https://via.placeholder.com/64x64?text=Food';
        }}
      />
      
      <div className="flex-1">
        <h4 className="font-medium text-gray-800">{item.name}</h4>
        <p className="text-green-600 font-semibold">${item.price.toFixed(2)}</p>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={item.quantity <= 1}
        >
          -
        </button>
        
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          +
        </button>
      </div>

      <div className="text-right">
        <p className="font-semibold text-gray-800">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        <button
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 text-sm mt-1 focus:outline-none"
        >
          Remove
        </button>
      </div>
    </div>
  );
};