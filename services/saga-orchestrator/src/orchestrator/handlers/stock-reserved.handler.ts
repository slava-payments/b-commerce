import { Injectable } from '@nestjs/common';
import { SagaEventHandler } from '../interfaces/saga-event-handler.interface';
import { OnSagaEvent } from '../decorators/saga-event-handler.decorator';
import { StartShippingCommand, StockReservedEvent } from '@shared/messages';
import { SagaService } from '../../saga/saga.service';
import { EventEmitterService } from '../../events/event-emitter.service';
import { SagaStep } from '../../saga/saga.state';
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

  async handle(event: StockReservedEvent): Promise<void> {
    await this.saga.completeStep(event.orderId, SagaStep.STOCK, event);
    await this.saga.markStepInProgress(event.orderId, SagaStep.SHIPPING);
    this.events.emitStartShipping(new StartShippingCommand(event.orderId));
  }
}
