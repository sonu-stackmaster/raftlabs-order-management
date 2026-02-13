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
        
        toast.success(`Order status updated: ${data.status}`);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Order not found'}</p>
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Order Status</h1>
            <Link
              to="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              New Order
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Order Status Tracker */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 text-center">Order Progress</h2>
            <StatusTracker currentStatus={order.status} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Order Details</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Order ID:</span> {order._id}</p>
                <p><span className="font-medium">Status:</span> 
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {order.status}
                  </span>
                </p>
                <p><span className="font-medium">Order Time:</span> {new Date(order.createdAt).toLocaleString()}</p>
                <p><span className="font-medium">Last Updated:</span> {new Date(order.updatedAt).toLocaleString()}</p>
                <p><span className="font-medium">Total:</span> 
                  <span className="text-green-600 font-semibold ml-1">${order.total.toFixed(2)}</span>
                </p>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Delivery Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {order.customer.name}</p>
                <p><span className="font-medium">Phone:</span> {order.customer.phone}</p>
                <p><span className="font-medium">Address:</span> {order.customer.address}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Updates Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-3"></div>
              <p className="text-blue-800 text-sm">
                This page updates automatically. You'll receive notifications when your order status changes.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};