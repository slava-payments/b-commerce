import { BaseEvent } from './base.event';

export class PaymentFailedEvent extends BaseEvent {
  constructor(
    orderId: string,
    public readonly reason: string,
  ) {
    super(orderId);
  }
}
