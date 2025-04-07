import { Injectable } from '@nestjs/common';
import { SagaRepository } from './saga.repository';
import {
  SagaStatus,
  SagaStep,
  SagaStepStatus,
  stepToStatusMap,
} from './saga.state';
import { PinoLogger } from 'nestjs-pino';
import { BaseEvent } from '@shared/messages';
import { JsonValue } from '../db/json-value';

@Injectable()
export class SagaService {
  constructor(
    private readonly repo: SagaRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(SagaService.name);
  }

  async startSaga(orderId: string) {
    const sagaId = await this.repo.create(orderId);
    if (!sagaId) {
      this.logger.error({ orderId }, 'Failed to create saga');
      return;
    }

    this.logger.info({ orderId, sagaId }, 'Saga started');

    await this.repo.log(sagaId, SagaStep.ORDER, SagaStepStatus.IN_PROGRESS);
    await this.repo.log(sagaId, SagaStep.ORDER, SagaStepStatus.COMPLETED);
  }

  async completeStep(orderId: string, step: SagaStep, payload?: BaseEvent) {
    const saga = await this.repo.findByOrderId(orderId);
    if (!saga) {
      this.logger.warn({ orderId }, 'Saga not found while completing step');
      return;
    }

    const payloadJson = payload ? new JsonValue(payload) : undefined;

    await this.repo.log(saga.id, step, SagaStepStatus.COMPLETED, payloadJson);
    await this.repo.updateStatus(saga.id, this.mapStepToStatus(step), step);

    this.logger.info({ orderId, step }, `Step ${step} completed`);
  }

  async failStep(
    orderId: string,
    step: SagaStep,
    reason: string,
    payload?: BaseEvent,
  ) {
    const saga = await this.repo.findByOrderId(orderId);
    if (!saga) {
      this.logger.warn({ orderId }, 'Saga not found while failing step');
      return;
    }

    const payloadJson = payload ? new JsonValue(payload) : undefined;

    await this.repo.log(
      saga.id,
      step,
      SagaStepStatus.FAILED,
      payloadJson,
      reason,
    );
    await this.repo.updateStatus(
      saga.id,
      SagaStatus.FAILED,
      step,
      reason,
      payloadJson,
    );

    this.logger.error(
      { orderId, step, reason },
      `Step ${step} failed: ${reason}`,
    );
  }

  async markStepInProgress(orderId: string, step: SagaStep) {
    const saga = await this.repo.findByOrderId(orderId);
    if (!saga) {
      this.logger.warn(
        { orderId },
        'Saga not found while marking step started',
      );
      return;
    }

    await this.repo.log(saga.id, step, SagaStepStatus.IN_PROGRESS);
    this.logger.debug({ orderId, step }, `Step ${step} started`);
  }

  async getStatusByOrderId(orderId: string) {
    return this.repo.findByOrderId(orderId);
  }

  async getHistoryByOrderId(orderId: string) {
    const saga = await this.repo.findByOrderId(orderId);
    if (!saga) return [];

    return this.repo.getStepLogsBySagaId(saga.id);
  }

  private mapStepToStatus(step: SagaStep): SagaStatus {
    return stepToStatusMap[step] || SagaStatus.CREATED;
  }
}
