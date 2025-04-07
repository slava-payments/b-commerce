import { beforeEach, describe, expect, it, Mocked, vi } from 'vitest';
import { PinoLogger } from 'nestjs-pino';
import { BaseEvent } from '@shared/messages';
import { SagaService } from '../saga.service';
import { SagaRepository } from '../saga.repository';
import { SagaStatus, SagaStep, SagaStepStatus } from '../saga.state';
import { JsonValue } from '../../db/json-value';
import { Saga } from '../entities/saga.entity';
import { SagaStepLog } from '../entities/saga-step-log.entity';

const mockRepo = {
  create: vi.fn(),
  findByOrderId: vi.fn(),
  log: vi.fn(),
  updateStatus: vi.fn(),
  getStepLogsBySagaId: vi.fn(),
} as unknown as Mocked<SagaRepository>;

const logger = {
  setContext: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
} as unknown as PinoLogger;

let service: SagaService;

describe('SagaService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    service = new SagaService(mockRepo, logger);
  });

  it('should start a saga', async () => {
    mockRepo.create.mockResolvedValueOnce(1);
    await service.startSaga('order-1');

    expect(mockRepo.create).toHaveBeenCalledWith('order-1');
    expect(mockRepo.log).toHaveBeenCalledTimes(2);
    expect(logger.info).toHaveBeenCalled();
  });

  it('should handle step completion', async () => {
    mockRepo.findByOrderId.mockResolvedValueOnce({ id: 1 } as Saga);
    await service.completeStep('order-1', SagaStep.ORDER);

    expect(mockRepo.log).toHaveBeenCalledWith(
      1,
      SagaStep.ORDER,
      SagaStepStatus.COMPLETED,
      undefined,
    );
    expect(mockRepo.updateStatus).toHaveBeenCalledWith(
      1,
      SagaStatus.CREATED,
      SagaStep.ORDER,
    );
    expect(logger.info).toHaveBeenCalled();
  });

  it('should fail step and update status', async () => {
    const event: BaseEvent = { orderId: 'order-1' };
    const payload = new JsonValue<BaseEvent>(event);

    mockRepo.findByOrderId.mockResolvedValueOnce({
      id: 1,
      status: SagaStatus.CREATED,
    } as Saga);

    await service.failStep('order-1', SagaStep.ORDER, 'test error', event);

    expect(mockRepo.log).toHaveBeenCalledWith(
      1,
      SagaStep.ORDER,
      SagaStepStatus.FAILED,
      payload,
      'test error',
    );
    expect(mockRepo.updateStatus).toHaveBeenCalledWith(
      1,
      SagaStatus.FAILED,
      SagaStep.ORDER,
      'test error',
      payload,
    );
    expect(logger.error).toHaveBeenCalled();
  });

  it('should mark step as in progress', async () => {
    mockRepo.findByOrderId.mockResolvedValueOnce({ id: 1 } as Saga);

    await service.markStepInProgress('order-1', SagaStep.ORDER);

    expect(mockRepo.log).toHaveBeenCalledWith(
      1,
      SagaStep.ORDER,
      SagaStepStatus.IN_PROGRESS,
    );
    expect(logger.debug).toHaveBeenCalled();
  });

  it('should get saga status', async () => {
    const saga = { id: 1, orderId: 'order-1' } as Saga;
    mockRepo.findByOrderId.mockResolvedValueOnce(saga);

    const result = await service.getStatusByOrderId('order-1');

    expect(result).toEqual(saga);
  });

  it('should get saga history', async () => {
    const sagaSteps = [
      {
        step: SagaStep.ORDER,
        status: SagaStepStatus.COMPLETED,
        reason: null,
        payload: null,
      },
      {
        step: SagaStep.STOCK,
        status: SagaStepStatus.COMPLETED,
        reason: null,
        payload: null,
      },
    ] as SagaStepLog[];

    mockRepo.findByOrderId.mockResolvedValueOnce({
      orderId: 'order-1',
      id: 1,
    } as Saga);
    mockRepo.getStepLogsBySagaId.mockResolvedValueOnce(sagaSteps);

    const result = await service.getHistoryByOrderId('order-1');

    expect(result).toEqual(sagaSteps);
  });

  it('should return empty array if saga not found for history', async () => {
    mockRepo.findByOrderId.mockResolvedValueOnce(undefined);

    const result = await service.getHistoryByOrderId('order-x');

    expect(result).toEqual([]);
  });
});
