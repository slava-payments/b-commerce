import { Injectable } from '@nestjs/common';
import { CancelOrderCommand, PaymentFailedEvent } from '@shared/messages';
import { SagaEventHandler } from '../interfaces/saga-event-handler.interface';
import { SagaService } from '../../saga/saga.service';
import { EventEmitterService } from '../../events/event-emitter.service';
import { OnSagaEvent } from '../decorators/saga-event-handler.decorator';
import { EVENT_TOPICS } from '@shared/messages/topics';
import { SagaStep } from '../../saga/saga.state';

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
    const { orderId, reason } = event;
    await this.saga.failStep(orderId, SagaStep.PAYMENT, reason, event);
    this.events.emitCancelOrder(new CancelOrderCommand(orderId, reason));
  }
}
