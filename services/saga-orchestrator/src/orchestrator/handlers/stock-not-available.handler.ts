import { Injectable } from '@nestjs/common';
import { SagaEventHandler } from '../interfaces/saga-event-handler.interface';
import { OnSagaEvent } from '../decorators/saga-event-handler.decorator';
import {
  StockNotAvailableEvent,
  RefundPaymentCommand,
  CancelOrderCommand,
} from '@shared/messages';
import { SagaService } from '../../saga/saga.service';
import { EventEmitterService } from '../../events/event-emitter.service';
import { EVENT_TOPICS } from '@shared/messages/topics';
import { SagaStep } from '../../saga/saga.state';

@OnSagaEvent(EVENT_TOPICS.STOCK_NOT_AVAILABLE)
@Injectable()
export class StockNotAvailableHandler
  implements SagaEventHandler<StockNotAvailableEvent>
{
  constructor(
    private readonly saga: SagaService,
    private readonly events: EventEmitterService,
  ) {}

  async handle(event: StockNotAvailableEvent): Promise<void> {
    const { orderId, reason } = event;
    await this.saga.failStep(orderId, SagaStep.STOCK, reason, event);
    this.events.emitRefund(new RefundPaymentCommand(orderId));
    this.events.emitCancelOrder(new CancelOrderCommand(orderId, reason));
  }
}
