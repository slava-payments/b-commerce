import { DynamicModule, Global, Module } from '@nestjs/common';
import pino from 'pino';
import { loggerConfig } from './logger.config';
import { ConfigService } from '../config/config.service';
import { TOKENS } from '../common/constants/injection-tokens';

@Global()
@Module({})
export class LoggerModule {
  static forRootAsync(): DynamicModule {
    return {
      global: true,
      module: LoggerModule,
      providers: [
        {
          provide: TOKENS.LOGGER,
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            return pino(loggerConfig(configService));
          },
        },
      ],
      exports: [TOKENS.LOGGER],
    };
  }
}
