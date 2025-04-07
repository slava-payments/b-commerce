import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),

  GRPC_PORT: z.coerce.number().default(50051),
  RABBITMQ_URL: z.string().url(),

  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().default(5432),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DB_SSL: z
    .union([z.literal('true'), z.literal('false')])
    .transform((val) => val === 'true')
    .optional()
    .default('false'),
});
