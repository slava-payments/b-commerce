export const COMMAND_TOPICS = {
  START_PAYMENT: 'payment.start',
  RESERVE_STOCK: 'stock.reserve',
  START_SHIPPING: 'shipping.start',
  REFUND_PAYMENT: 'payment.refund',
  CANCEL_ORDER: 'order.cancel',
  COMPLETE_ORDER: 'order.complete',
} as const;

export type CommandTopic = (typeof COMMAND_TOPICS)[keyof typeof COMMAND_TOPICS];
