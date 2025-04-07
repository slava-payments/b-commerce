import { BaseEvent } from './base.event';

export class StockNotAvailableEvent extends BaseEvent {
  constructor(
    orderId: string,
    public readonly reason?: string,
  ) {
    super(orderId);
  }
}
