import { Module } from '@nestjs/common';
import { GrpcSagaController } from './grpc.controller';
import { SagaModule } from '../saga/saga.module';

@Module({
  imports: [SagaModule],
  controllers: [GrpcSagaController],
})
export class GrpcModule {}
