import { DynamicModule, Module } from '@nestjs/common';
import { DbService } from './db.service';
import { ConfigService } from '../config/config.service';
import { MigrationRunnerService } from './migration-runner.service';

@Module({})
export class DbModule {
  static forRootAsync(): DynamicModule {
    return {
      module: DbModule,
      imports: [],
      providers: [
        {
          provide: DbService,
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            return new DbService(configService.dbConfig);
          },
        },
        MigrationRunnerService,
      ],
      exports: [DbService],
    };
  }
}
