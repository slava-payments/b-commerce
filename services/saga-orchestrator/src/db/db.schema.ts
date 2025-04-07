import { Generated } from 'kysely';
import { SagaStatus } from '../saga/saga.state';

export interface SagaTable {
  id: Generated<number>;
  orderId: string;
  status: SagaStatus;
  currentStep: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Database {
  saga: SagaTable;
}
