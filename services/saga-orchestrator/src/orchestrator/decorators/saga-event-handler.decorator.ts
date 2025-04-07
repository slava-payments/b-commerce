import { SetMetadata } from '@nestjs/common';
import { EventTopic } from '@shared/messages/topics';

export const SAGA_HANDLER_TOPIC = 'SAGA_HANDLER_TOPIC';

export const OnSagaEvent = (topic: EventTopic) =>
  SetMetadata(SAGA_HANDLER_TOPIC, topic);
