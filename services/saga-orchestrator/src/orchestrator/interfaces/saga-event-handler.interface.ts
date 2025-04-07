export interface SagaEventHandler<T = unknown> {
  handle(event: T): Promise<void>;
}
