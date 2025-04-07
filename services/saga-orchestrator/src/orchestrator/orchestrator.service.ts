import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { EventListenerService } from '../events/event-listener.service';
import { Reflector } from '@nestjs/core';
import { SagaEventHandler } from './interfaces/saga-event-handler.interface';
import { SAGA_HANDLER_TOPIC } from './decorators/saga-event-handler.decorator';
import { TOKENS } from '../common/constants/injection-tokens';
import { EventTopic } from '@shared/messages/topics';

@Injectable()
export class OrchestratorService implements OnModuleInit {
  constructor(
    private readonly listener: EventListenerService,
    private readonly reflector: Reflector,
    @Inject(TOKENS.SAGA_HANDLERS) private readonly handlers: SagaEventHandler[],
  ) {}

  onModuleInit() {
    for (const handler of this.handlers) {
      const topic = this.reflector.get<EventTopic>(
        SAGA_HANDLER_TOPIC,
        handler.constructor,
      );
      if (topic) {
        this.listener.setHandler(topic, (event) => handler.handle(event));
      }
    }
  }
}
