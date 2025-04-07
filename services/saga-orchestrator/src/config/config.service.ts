import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { EnvVars } from './env.types';
import { DbConfig } from '../db/db.config';

@Injectable()
export class ConfigService {
  constructor(private readonly config: NestConfigService<EnvVars>) {}

  get grpcPort(): number {
    return this.config.getOrThrow('GRPC_PORT');
  }

  get rabbitmqUrl(): string {
    return this.config.getOrThrow('RABBITMQ_URL');
  }

  get isDev(): boolean {
    return this.config.get('NODE_ENV') === 'development';
  }

  get dbConfig(): DbConfig {
    return {
      host: this.config.getOrThrow('DB_HOST'),
      port: this.config.getOrThrow('DB_PORT'),
      user: this.config.getOrThrow('DB_USER'),
      password: this.config.getOrThrow('DB_PASSWORD'),
      database: this.config.getOrThrow('DB_NAME'),
      ssl: this.config.get('DB_SSL') ?? false,
    };
  }
}
