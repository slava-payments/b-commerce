import { Injectable } from '@nestjs/common';
import { SagaRepository } from './saga.repository';
import { SagaStatus, SagaTransitions } from './saga.state';

@Injectable()
export class SagaService {
  constructor(private readonly repo: SagaRepository) {}

  async startSaga(orderId: string) {
    await this.repo.create(orderId);
    // отправка команды на оплату
  }

  async handleStep(orderId: string, incomingStatus: SagaStatus) {
    const saga = await this.repo.findByOrderId(orderId);
    if (
      !saga ||
      saga.status === SagaStatus.FAILED ||
      saga.status === SagaStatus.COMPLETED
    )
      return;

    const nextStatus = SagaTransitions[incomingStatus];
    await this.repo.updateStatus(orderId, incomingStatus, nextStatus ?? null);

    // тут можно отправить Rabbit-команду следующему сервису
  }

  async failSaga(orderId: string, reason?: string) {
    await this.repo.updateStatus(orderId, SagaStatus.FAILED, null);
    // логировать и триггерить компенсации
  }

  async getStatusByOrderId(orderId: string) {
    return this.repo.findByOrderId(orderId);
  }
}
