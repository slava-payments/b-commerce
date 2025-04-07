import { Injectable } from '@nestjs/common';
import { PaymentFailedEvent, CancelOrderCommand } from '@shared/messages';
import { SagaEventHandler } from '../interfaces/saga-event-handler.interface';
import { SagaService } from '../../saga/saga.service';
import { EventEmitterService } from '../../events/event-emitter.service';
import { OnSagaEvent } from '../decorators/saga-event-handler.decorator';
import { EVENT_TOPICS } from '@shared/messages/topics';

@OnSagaEvent(EVENT_TOPICS.PAYMENT_FAILED)
@Injectable()
export class PaymentFailedHandler
  implements SagaEventHandler<PaymentFailedEvent>
{
  constructor(
    private readonly saga: SagaService,
    private readonly events: EventEmitterService,
  ) {}

  async handle(event: PaymentFailedEvent): Promise<void> {
    await this.saga.failSaga(event.orderId);
    this.events.emitCancelOrder(new CancelOrderCommand(event.orderId));
  }
}
