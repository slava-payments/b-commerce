import { z } from 'zod';
import { envSchema } from './env.schema';

export type EnvVars = z.infer<typeof envSchema>;
