import { Injectable } from '@nestjs/common';
import { SagaEventHandler } from '../interfaces/saga-event-handler.interface';
import { OnSagaEvent } from '../decorators/saga-event-handler.decorator';
import {
  StartShippingCommand,
  StockNotAvailableEvent,
  StockReservedEvent,
} from '@shared/messages';
import { SagaService } from '../../saga/saga.service';
import { EventEmitterService } from '../../events/event-emitter.service';
import { SagaStatus } from '../../saga/saga.state';
import { EVENT_TOPICS } from '@shared/messages/topics';

@OnSagaEvent(EVENT_TOPICS.STOCK_RESERVED)
@Injectable()
export class StockReservedHandler
  implements SagaEventHandler<StockReservedEvent>
{
  constructor(
    private readonly saga: SagaService,
    private readonly events: EventEmitterService,
  ) {}

  async handle(event: StockNotAvailableEvent): Promise<void> {
    await this.saga.handleStep(event.orderId, SagaStatus.STOCK_RESERVED);
    this.events.emitStartShipping(new StartShippingCommand(event.orderId));
  }
}
