import { Injectable } from '@nestjs/common';
import { PaymentProcessedEvent, ReserveStockCommand } from '@shared/messages';
import { SagaEventHandler } from '../interfaces/saga-event-handler.interface';
import { OnSagaEvent } from '../decorators/saga-event-handler.decorator';
import { SagaService } from '../../saga/saga.service';
import { EventEmitterService } from '../../events/event-emitter.service';
import { EVENT_TOPICS } from '@shared/messages/topics';
import { SagaStep } from '../../saga/saga.state';

@OnSagaEvent(EVENT_TOPICS.PAYMENT_PROCESSED)
@Injectable()
export class PaymentProcessedHandler
  implements SagaEventHandler<PaymentProcessedEvent>
{
  constructor(
    private readonly saga: SagaService,
    private readonly events: EventEmitterService,
  ) {}

  async handle(event: PaymentProcessedEvent): Promise<void> {
    await this.saga.completeStep(event.orderId, SagaStep.PAYMENT, event);
    await this.saga.markStepInProgress(event.orderId, SagaStep.STOCK);
    this.events.emitReserveStock(new ReserveStockCommand(event.orderId));
  }
}
