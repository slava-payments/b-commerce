import { Module } from '@nestjs/common';
import { SagaService } from './saga.service';
import { SagaRepository } from './saga.repository';
import { CoreModule } from '../core';

@Module({
  imports: [CoreModule],
  providers: [SagaService, SagaRepository],
  exports: [SagaService],
})
export class SagaModule {}
