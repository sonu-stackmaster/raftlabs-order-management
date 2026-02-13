export const ORDER_STATUS = {
  ORDER_RECEIVED: 'Order Received',
  PREPARING: 'Preparing',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

export const STATUS_PROGRESSION_DELAYS = {
  [ORDER_STATUS.ORDER_RECEIVED]: 5000, // 5 seconds
  [ORDER_STATUS.PREPARING]: 10000, // 10 seconds  
  [ORDER_STATUS.OUT_FOR_DELIVERY]: 15000, // 15 seconds
} as const;

export const SOCKET_EVENTS = {
  JOIN_ORDER: 'join-order',
  ORDER_STATUS_UPDATED: 'order-status-updated',
} as const;