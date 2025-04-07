export const EVENT_TOPICS = {
  ORDER_CREATED: 'order.created',
  PAYMENT_PROCESSED: 'payment.processed',
  PAYMENT_FAILED: 'payment.failed',
  STOCK_RESERVED: 'stock.reserved',
  STOCK_NOT_AVAILABLE: 'stock.failed',
  ORDER_SHIPPED: 'order.shipped',
} as const;

export type EventTopic = (typeof EVENT_TOPICS)[keyof typeof EVENT_TOPICS];
