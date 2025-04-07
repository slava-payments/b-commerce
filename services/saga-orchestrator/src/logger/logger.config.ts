import { LoggerOptions } from 'pino';
import { ConfigService } from '../config/config.service';

export const loggerConfig = (configService: ConfigService): LoggerOptions => ({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      singleLine: false,
    },
  },
  level: configService.isDev ? 'debug' : 'info',
});
