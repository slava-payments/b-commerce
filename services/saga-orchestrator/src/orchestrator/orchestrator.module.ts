import { Module } from '@nestjs/common';
import { SagaModule } from '../saga/saga.module';
import { EventsModule } from '../events/events.module';
import { OrderCreatedHandler } from './handlers/order-created.handler';
import { PaymentProcessedHandler } from './handlers/payment-processed.handler';
import { PaymentFailedHandler } from './handlers/payment-failed.handler';
import { StockNotAvailableHandler } from './handlers/stock-not-available.handler';
import { OrderShippedHandler } from './handlers/order-shipped.handler';
import { StockReservedHandler } from './handlers/stock-reserved.handler';
import { OrchestratorService } from './orchestrator.service';
import { TOKENS } from '../common/constants/injection-tokens';
import { SagaEventHandler } from './interfaces/saga-event-handler.interface';

export const sagaHandlers = [
  OrderCreatedHandler,
  PaymentProcessedHandler,
  PaymentFailedHandler,
  StockReservedHandler,
  StockNotAvailableHandler,
  OrderShippedHandler,
];

@Module({
  imports: [SagaModule, EventsModule],
  providers: [
    ...sagaHandlers,
    {
      provide: TOKENS.SAGA_HANDLERS,
      useFactory: (...handlers: SagaEventHandler[]) => handlers,
      inject: [...sagaHandlers],
    },
    OrchestratorService,
  ],
})
export class OrchestratorModule {}
