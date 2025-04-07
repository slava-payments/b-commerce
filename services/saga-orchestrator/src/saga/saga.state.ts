export enum SagaStatus {
  CREATED = 'CREATED',
  PAYMENT_PROCESSED = 'PAYMENT_PROCESSED',
  STOCK_RESERVED = 'STOCK_RESERVED',
  ORDER_SHIPPED = 'ORDER_SHIPPED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum SagaStep {
  ORDER = 'ORDER',
  PAYMENT = 'PAYMENT',
  STOCK = 'STOCK',
  SHIPPING = 'SHIPPING',
}

export enum SagaStepStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export const stepToStatusMap: Record<SagaStep, SagaStatus> = {
  [SagaStep.PAYMENT]: SagaStatus.PAYMENT_PROCESSED,
  [SagaStep.STOCK]: SagaStatus.STOCK_RESERVED,
  [SagaStep.SHIPPING]: SagaStatus.ORDER_SHIPPED,
  [SagaStep.ORDER]: SagaStatus.CREATED,
};
