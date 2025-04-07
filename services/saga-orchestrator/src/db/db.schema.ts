import { Generated } from 'kysely';
import { SagaStatus, SagaStep, SagaStepStatus } from '../saga/saga.state';
import { BaseCommand, BaseEvent } from '@shared/messages';
import { JsonValue } from './json-value';

export interface SagaTable {
  id: Generated<number>;
  orderId: string;
  status: SagaStatus;
  lastStep: SagaStep | null;
  reason: string | null;
  metadata: JsonValue<BaseEvent> | null;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
}

export interface SagaStepLogTable {
  id: Generated<number>;
  sagaId: number;
  step: SagaStep;
  status: SagaStepStatus;
  reason: string | null;
  payload: JsonValue<BaseCommand> | null;
  createdAt: Date;
}

export interface Database {
  saga: SagaTable;
  saga_step_log: SagaStepLogTable;
}
