import { BaseEvent } from './base.event';

export class StockReservedEvent extends BaseEvent {
  constructor(
    orderId: string,
    public readonly reason?: string,
  ) {
    super(orderId);
  }
}
