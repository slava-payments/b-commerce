import { Injectable } from '@nestjs/common';
import { SagaEventHandler } from '../interfaces/saga-event-handler.interface';
import { OnSagaEvent } from '../decorators/saga-event-handler.decorator';
import { OrderCreatedEvent, StartPaymentCommand } from '@shared/messages';
import { SagaService } from '../../saga/saga.service';
import { EventEmitterService } from '../../events/event-emitter.service';
import { EVENT_TOPICS } from '@shared/messages/topics';

@OnSagaEvent(EVENT_TOPICS.ORDER_CREATED)
@Injectable()
export class OrderCreatedHandler
  implements SagaEventHandler<OrderCreatedEvent>
{
  constructor(
    private readonly saga: SagaService,
    private readonly events: EventEmitterService,
  ) {}

  async handle(event: OrderCreatedEvent): Promise<void> {
    await this.saga.startSaga(event.orderId);
    this.events.emitStartPayment(new StartPaymentCommand(event.orderId));
  }
}
