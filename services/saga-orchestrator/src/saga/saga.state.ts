export enum SagaStatus {
  CREATED = 'CREATED',
  PAYMENT_PROCESSED = 'PAYMENT_PROCESSED',
  STOCK_RESERVED = 'STOCK_RESERVED',
  ORDER_SHIPPED = 'ORDER_SHIPPED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export const SagaTransitions: Record<SagaStatus, SagaStatus | null> = {
  [SagaStatus.CREATED]: SagaStatus.PAYMENT_PROCESSED,
  [SagaStatus.PAYMENT_PROCESSED]: SagaStatus.STOCK_RESERVED,
  [SagaStatus.STOCK_RESERVED]: SagaStatus.ORDER_SHIPPED,
  [SagaStatus.ORDER_SHIPPED]: SagaStatus.COMPLETED,
  [SagaStatus.COMPLETED]: null,
  [SagaStatus.FAILED]: null,
};
