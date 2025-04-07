import { Injectable } from '@nestjs/common';
import { PaymentProcessedEvent, ReserveStockCommand } from '@shared/messages';
import { SagaEventHandler } from '../interfaces/saga-event-handler.interface';
import { OnSagaEvent } from '../decorators/saga-event-handler.decorator';
import { SagaService } from '../../saga/saga.service';
import { EventEmitterService } from '../../events/event-emitter.service';
import { SagaStatus } from '../../saga/saga.state';
import { EVENT_TOPICS } from '@shared/messages/topics';

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
    await this.saga.handleStep(event.orderId, SagaStatus.PAYMENT_PROCESSED);
    this.events.emitReserveStock(new ReserveStockCommand(event.orderId));
  }
}
