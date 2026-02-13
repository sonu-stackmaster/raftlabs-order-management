import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CartItem } from '@/components/CartItem';
import { useCartStore } from '@/store/cart.store';
import { orderApi } from '@/api/orderApi';
import { Customer } from '@/types';
import toast from 'react-hot-toast';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, clearCart, getTotalPrice } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Customer>();

  const totalPrice = getTotalPrice();

  const onSubmit = async (customerData: Customer) => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const orderData = {
        customer: customerData,
        items: items.map(item => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
        })),
      };

      const result = await orderApi.createOrder(orderData);
      
      clearCart();
      toast.success('Order placed successfully! 🎉', {
        icon: '🚀',
        style: {
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
        },
      });
      navigate(`/order-status/${result.orderId}`);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <header className="bg-white shadow-lg sticky top-0 z-[100] fade-in">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold gradient-text">🛒 Your Cart</h1>
                <p className="text-gray-600 mt-1">Review your delicious selections</p>
              </div>
              <Link to="/" className="btn-secondary">
                ← Back to Menu
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20 bounce-in">
            <div className="glass-card p-12">
              <div className="text-8xl mb-6">🛒</div>
              <h2 className="text-2xl font-bold text-gray-700 mb-4">Your cart is empty</h2>
              <p className="text-gray-500 mb-8">Looks like you haven't added any delicious items yet!</p>
              <Link to="/" className="btn-primary">
                🍽️ Browse Menu
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-lg sticky top-0 z-[100] fade-in">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold gradient-text">🛒 Your Cart</h1>
              <p className="text-gray-600 mt-1">{items.length} item{items.length !== 1 ? 's' : ''} ready for checkout</p>
            </div>
            <Link to="/" className="btn-secondary">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cart Items */}
          <div className="glass-card p-8 slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Order Summary</h2>
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {items.length} items
              </span>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {items.map((item, index) => (
                <div
                  key={item.menuItemId}
                  className="fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CartItem item={item} />
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee:</span>
                  <span>$2.99</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax:</span>
                  <span>${(totalPrice * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center text-2xl font-bold">
                    <span className="gradient-text">Total:</span>
                    <span className="text-green-600 pulse-glow rounded-lg px-3 py-1">
                      ${(totalPrice + 2.99 + totalPrice * 0.08).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information Form */}
          <div className="glass-card p-8 slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-2">📍</span>
              Delivery Information
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    👤 Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register('name', { 
                      required: 'Name is required',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' }
                    })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    📱 Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    {...register('phone', { 
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[\+]?[1-9][\d]{0,15}$/,
                        message: 'Please enter a valid phone number'
                      }
                    })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300"
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                    🏠 Delivery Address
                  </label>
                  <textarea
                    id="address"
                    rows={4}
                    {...register('address', { 
                      required: 'Address is required',
                      minLength: { value: 10, message: 'Please provide a complete address' }
                    })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 resize-none"
                    placeholder="Enter your complete delivery address including street, city, and postal code"
                  />
                  {errors.address && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.address.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`
                    w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-300
                    ${isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'btn-success hover:shadow-2xl'
                    }
                  `}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent"></div>
                      <span>Processing Order<span className="loading-dots"></span></span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <span>🚀</span>
                      <span>Place Order - ${(totalPrice + 2.99 + totalPrice * 0.08).toFixed(2)}</span>
                    </span>
                  )}
                </button>
                
                <p className="text-center text-sm text-gray-500 mt-4">
                  🔒 Your information is secure and encrypted
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};