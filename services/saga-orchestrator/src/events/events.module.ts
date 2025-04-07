import { Module } from '@nestjs/common';
import { EventListenerService } from './event-listener.service';
import { EventEmitterService } from './event-emitter.service';
import { RabbitMQProvider } from './rabbitmq.provider';
import { CoreModule } from '../core';

@Module({
  imports: [CoreModule],
  providers: [EventListenerService, EventEmitterService, RabbitMQProvider],
  exports: [EventListenerService, EventEmitterService, RabbitMQProvider],
})
export class EventsModule {}
