import { EVENT_TOPICS } from '../topics';
import {
  OrderCreatedEvent,
  OrderShippedEvent,
  PaymentFailedEvent,
  PaymentProcessedEvent,
  StockNotAvailableEvent,
  StockReservedEvent,
} from '../events';

export type SagaEventPayloadMap = {
  [EVENT_TOPICS.ORDER_CREATED]: OrderCreatedEvent;
  [EVENT_TOPICS.PAYMENT_PROCESSED]: PaymentProcessedEvent;
  [EVENT_TOPICS.PAYMENT_FAILED]: PaymentFailedEvent;
  [EVENT_TOPICS.STOCK_RESERVED]: StockReservedEvent;
  [EVENT_TOPICS.STOCK_NOT_AVAILABLE]: StockNotAvailableEvent;
  [EVENT_TOPICS.ORDER_SHIPPED]: OrderShippedEvent;
};
