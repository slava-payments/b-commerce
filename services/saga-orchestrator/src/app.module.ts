import { Module } from '@nestjs/common';
import { SagaModule } from './saga/saga.module';
import { EventsModule } from './events/events.module';
import { GrpcModule } from './grpc/grpc.module';
import { HealthModule } from './health/health.module';
import { CoreModule } from './core';
import { OrchestratorModule } from './orchestrator/orchestrator.module';

@Module({
  imports: [
    CoreModule,
    SagaModule,
    OrchestratorModule,
    EventsModule,
    GrpcModule,
    HealthModule,
  ],
})
export class AppModule {}
