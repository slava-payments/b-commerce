import { Injectable } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EVENT_TOPICS, EventTopic } from '@shared/messages/topics';
import { SagaEventPayloadMap } from '@shared/messages/payloads';

@Injectable()
export class EventListenerService {
  private handlers: {
    [K in EventTopic]?: (payload: SagaEventPayloadMap[K]) => Promise<void>;
  } = {};

  setHandler<K extends EventTopic>(
    topic: K,
    handler: (payload: SagaEventPayloadMap[K]) => Promise<void>,
  ) {
    this.handlers[topic] = handler;
  }

  private async handle<K extends EventTopic>(
    topic: K,
    payload: unknown,
  ): Promise<void> {
    const handler = this.handlers[topic];
    if (!handler) return;

    return handler(payload as SagaEventPayloadMap[K]);
  }

  @EventPattern(EVENT_TOPICS.ORDER_CREATED)
  handleOrderCreated(@Payload() payload: unknown) {
    return this.handle(EVENT_TOPICS.ORDER_CREATED, payload);
  }

  @EventPattern(EVENT_TOPICS.PAYMENT_PROCESSED)
  handlePaymentProcessed(@Payload() payload: unknown) {
    return this.handle(EVENT_TOPICS.PAYMENT_PROCESSED, payload);
  }

  @EventPattern(EVENT_TOPICS.PAYMENT_FAILED)
  handlePaymentFailed(@Payload() payload: unknown) {
    return this.handle(EVENT_TOPICS.PAYMENT_FAILED, payload);
  }

  @EventPattern(EVENT_TOPICS.STOCK_NOT_AVAILABLE)
  handleStockFailed(@Payload() payload: unknown) {
    return this.handle(EVENT_TOPICS.STOCK_NOT_AVAILABLE, payload);
  }

  @EventPattern(EVENT_TOPICS.ORDER_SHIPPED)
  handleOrderShipped(@Payload() payload: unknown) {
    return this.handle(EVENT_TOPICS.ORDER_SHIPPED, payload);
  }
}
