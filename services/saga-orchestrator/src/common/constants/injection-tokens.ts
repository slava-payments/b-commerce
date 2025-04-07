export const TOKENS = {
  LOGGER: 'APP_LOGGER',
  DB: 'APP_DB',
  METRICS: 'APP_METRICS',
  GRPC: 'APP_GRPC',
  RABBITMQ: 'RABBITMQ_SERVICE',
  SAGA_HANDLERS: 'SAGA_HANDLERS',
} as const;

export type InjectionToken = (typeof TOKENS)[keyof typeof TOKENS];
