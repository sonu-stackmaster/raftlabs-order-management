import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Order } from '@/types';
import { StatusTracker } from '@/components/StatusTracker';
import { orderApi } from '@/api/orderApi';
import { socketService } from '@/sockets/socket';
import toast from 'react-hot-toast';

export const OrderStatusPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError('Order ID is required');
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orderData = await orderApi.getOrder(orderId);
        setOrder(orderData);
      } catch (err) {
        setError('Failed to load order details');
        toast.error('Failed to load order details');
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return;

    // Connect to socket and join order room
    const socket = socketService.connect();
    socketService.joinOrder(orderId);

    // Listen for order status updates
    socketService.onOrderStatusUpdate((data) => {
      if (data.orderId === orderId) {
        setOrder(prevOrder => {
          if (prevOrder) {
            return {
              ...prevOrder,
              status: data.status as any,
              updatedAt: data.updatedAt,
            };
          }
          return prevOrder;
        });
        
        toast.success(`Order status updated: ${data.status} 🎉`, {
          icon: '📦',
          style: {
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
          },
        });
      }
    });

    // Cleanup on unmount
    return () => {
      socketService.leaveOrder(orderId);
      socketService.offOrderStatusUpdate();
      socketService.disconnect();
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center fade-in">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-transparent border-t-purple-600 animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-white text-xl font-medium">
            Loading your order<span className="loading-dots"></span>
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bounce-in">
          <div className="glass-card p-12 max-w-md mx-4">
            <div className="text-red-500 text-8xl mb-6">📦</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Order Not Found</h2>
            <p className="text-gray-500 mb-8">{error || 'We couldn\'t find your order'}</p>
            <Link to="/" className="btn-primary">
              🍽️ Back to Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusEmoji = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return '⏳';
      case 'confirmed': return '✅';
      case 'preparing': return '👨‍🍳';
      case 'ready': return '🎉';
      case 'out_for_delivery': return '🚚';
      case 'delivered': return '✨';
      default: return '📦';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'from-yellow-400 to-orange-500';
      case 'confirmed': return 'from-blue-400 to-blue-600';
      case 'preparing': return 'from-purple-400 to-purple-600';
      case 'ready': return 'from-green-400 to-green-600';
      case 'out_for_delivery': return 'from-indigo-400 to-indigo-600';
      case 'delivered': return 'from-emerald-400 to-emerald-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-lg sticky top-0 z-[100] fade-in">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold gradient-text">📦 Order Tracking</h1>
              <p className="text-gray-600 mt-1">Track your delicious order in real-time</p>
            </div>
            <Link to="/" className="btn-primary">
              🍽️ New Order
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Order Status Hero */}
          <div className="glass-card p-8 text-center slide-up">
            <div className="text-8xl mb-4">{getStatusEmoji(order.status)}</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Order #{order._id.slice(-6).toUpperCase()}
            </h2>
            <div className={`inline-block bg-gradient-to-r ${getStatusColor(order.status)} text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg pulse-glow`}>
              {order.status.replace('_', ' ').toUpperCase()}
            </div>
            <p className="text-gray-600 mt-4">
              Last updated: {new Date(order.updatedAt).toLocaleString()}
            </p>
          </div>

          {/* Order Status Tracker */}
          <div className="glass-card p-8 slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Order Progress</h2>
            <StatusTracker currentStatus={order.status} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Details */}
            <div className="glass-card p-8 slide-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-2">📋</span>
                Order Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="font-semibold text-gray-700">Order ID:</span>
                  <span className="font-mono text-sm bg-white px-3 py-1 rounded-lg shadow-sm">
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="font-semibold text-gray-700">Order Time:</span>
                  <span className="text-gray-600">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <span className="font-semibold text-gray-700">Total Amount:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="glass-card p-8 slide-up" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-2">🏠</span>
                Delivery Info
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center mb-2">
                    <span className="text-blue-600 mr-2">👤</span>
                    <span className="font-semibold text-gray-700">Customer:</span>
                  </div>
                  <p className="text-gray-800 font-medium">{order.customer.name}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="flex items-center mb-2">
                    <span className="text-purple-600 mr-2">📱</span>
                    <span className="font-semibold text-gray-700">Phone:</span>
                  </div>
                  <p className="text-gray-800 font-medium">{order.customer.phone}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center mb-2">
                    <span className="text-green-600 mr-2">📍</span>
                    <span className="font-semibold text-gray-700">Address:</span>
                  </div>
                  <p className="text-gray-800 font-medium leading-relaxed">
                    {order.customer.address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="glass-card p-8 slide-up" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-2">🍽️</span>
              Your Order ({order.items.length} items)
            </h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300"
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {item.quantity}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-lg">{item.name}</p>
                      <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl text-green-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Updates Notice */}
          <div className="glass-card p-6 slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-gray-700 font-medium">
                🔄 This page updates automatically - you'll get notified of any changes!
              </p>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-green-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};