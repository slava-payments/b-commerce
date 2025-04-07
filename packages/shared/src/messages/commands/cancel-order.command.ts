import { BaseCommand } from './base.command';

export class CancelOrderCommand extends BaseCommand {
  constructor(
    public readonly orderId: string,
    public readonly reason: string,
  ) {
    super(orderId);
  }
}
