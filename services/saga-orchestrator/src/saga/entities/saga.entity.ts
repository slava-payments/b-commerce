import { SagaStatus, SagaStep } from '../saga.state';
import { BaseEvent } from '@shared/messages';
import { JsonValue } from '../../db/json-value';

export interface Saga {
  id: number;
  orderId: string;
  status: SagaStatus;
  lastStep: SagaStep | null;
  reason: string | null;
  metadata: JsonValue<BaseEvent> | null;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
}
