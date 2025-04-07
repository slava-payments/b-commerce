import { Controller } from '@nestjs/common';
import { SagaService } from '../saga/saga.service';
import {
  SagaHistoryResponse,
  SagaIdRequest,
  SagaServiceController,
  SagaStatusResponse,
} from '@shared/grpc/generated/saga';

@Controller()
export class GrpcSagaController implements SagaServiceController {
  constructor(private readonly sagaService: SagaService) {}

  async getSagaStatus(request: SagaIdRequest): Promise<SagaStatusResponse> {
    const saga = await this.sagaService.getStatusByOrderId(request.orderId);

    if (!saga) {
      return {
        status: 'NOT_FOUND',
        lastStep: '',
        updatedAt: '',
        reason: '',
        completedAt: '',
      };
    }

    return {
      status: saga.status,
      lastStep: saga.lastStep ?? '',
      updatedAt: saga.updatedAt.toISOString(),
      reason: saga.reason ?? '',
      completedAt: saga.completedAt?.toISOString() ?? '',
    };
  }

  async getSagaHistory(request: SagaIdRequest): Promise<SagaHistoryResponse> {
    const logs = await this.sagaService.getHistoryByOrderId(request.orderId);

    return {
      steps: logs.map((log) => ({
        step: log.step,
        status: log.status,
        createdAt: log.createdAt.toISOString(),
        reason: log.reason ?? '',
      })),
    };
  }
}
