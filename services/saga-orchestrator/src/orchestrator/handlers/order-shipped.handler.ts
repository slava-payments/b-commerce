import { Injectable } from '@nestjs/common';
import { SagaEventHandler } from '../interfaces/saga-event-handler.interface';
import { OnSagaEvent } from '../decorators/saga-event-handler.decorator';
import { CompleteOrderCommand, OrderShippedEvent } from '@shared/messages';
import { SagaService } from '../../saga/saga.service';
import { EventEmitterService } from '../../events/event-emitter.service';
import { SagaStep } from '../../saga/saga.state';
import { EVENT_TOPICS } from '@shared/messages/topics';

@OnSagaEvent(EVENT_TOPICS.ORDER_SHIPPED)
@Injectable()
export class OrderShippedHandler
  implements SagaEventHandler<OrderShippedEvent>
{
  constructor(
    private readonly saga: SagaService,
    private readonly events: EventEmitterService,
  ) {}

  async handle(event: OrderShippedEvent): Promise<void> {
    await this.saga.completeStep(event.orderId, SagaStep.SHIPPING, event);
    this.events.emitCompleteOrder(new CompleteOrderCommand(event.orderId));
  }
}
