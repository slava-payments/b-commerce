import { SagaStep, SagaStepStatus } from '../saga.state';
import { BaseEvent } from '@shared/messages';
import { JsonValue } from '../../db/json-value';

export interface SagaStepLog {
  id: number;
  sagaId: number;
  step: SagaStep;
  status: SagaStepStatus;
  reason: string | null;
  payload: JsonValue<BaseEvent> | null;
  createdAt: Date;
}
