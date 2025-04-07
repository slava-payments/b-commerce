import { SagaStatus } from './saga.state';

export interface Saga {
  id: number;
  orderId: string;
  status: SagaStatus;
  currentStep: string | null;
  createdAt: Date;
  updatedAt: Date;
}
