import { Global, Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { ConfigModule } from '../config/config.module';
import { LoggerModule } from 'nestjs-pino';
import { ConfigService } from '../config/config.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    DbModule.forRootAsync(),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          pinoHttp: {
            level: configService.isDev ? 'debug' : 'info',
            transport: {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'SYS:standard',
              },
            },
          },
        };
      },
    }),
  ],
  exports: [ConfigModule, LoggerModule, DbModule],
})
export class CoreModule {}
