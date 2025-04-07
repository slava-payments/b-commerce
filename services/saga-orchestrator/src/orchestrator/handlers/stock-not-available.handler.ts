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
    await this.saga.failSaga(event.orderId);
    this.events.emitRefund(new RefundPaymentCommand(event.orderId));
    this.events.emitCancelOrder(new CancelOrderCommand(event.orderId));
  }
}
