import { api } from './axios';
import { MenuItem, Order, CreateOrderRequest, ApiResponse } from '@/types';

export const orderApi = {
  // Menu APIs
  getMenuItems: async (): Promise<MenuItem[]> => {
    const response = await api.get<ApiResponse<MenuItem[]>>('/menu');
    return response.data.data;
  },

  getMenuItem: async (id: string): Promise<MenuItem> => {
    const response = await api.get<ApiResponse<MenuItem>>(`/menu/${id}`);
    return response.data.data;
  },

  // Order APIs
  createOrder: async (orderData: CreateOrderRequest): Promise<{ orderId: string; status: string; total: number }> => {
    const response = await api.post<ApiResponse<{ orderId: string; status: string; total: number }>>('/orders', orderData);
    return response.data.data;
  },

  getOrder: async (id: string): Promise<Order> => {
    const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data.data;
  },

  getAllOrders: async (): Promise<Order[]> => {
    const response = await api.get<ApiResponse<Order[]>>('/orders');
    return response.data.data;
  },
};