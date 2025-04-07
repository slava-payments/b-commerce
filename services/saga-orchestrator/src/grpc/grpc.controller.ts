import { Controller } from '@nestjs/common';
import { SagaService } from '../saga/saga.service';
import {
  SagaIdRequest,
  SagaServiceController,
  SagaStatusResponse,
} from '@shared/grpc/generated/saga';

@Controller()
export class GrpcSagaController implements SagaServiceController {
  constructor(private readonly sagaService: SagaService) {}

  async getSagaStatus(request: SagaIdRequest): Promise<SagaStatusResponse> {
    const saga = await this.sagaService.getStatusByOrderId(request.orderId);

    return {
      status: saga?.status ?? 'NOT_FOUND',
      currentStep: saga?.currentStep ?? '',
      updatedAt: saga?.updatedAt?.toISOString() ?? '',
    };
  }
}
