import { Injectable, OnModuleInit } from '@nestjs/common';
import { FileMigrationProvider, Migrator } from 'kysely';
import { DbService } from './db.service';
import { promises as fs } from 'fs';
import * as path from 'path';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class MigrationRunnerService implements OnModuleInit {
  constructor(
    private readonly logger: PinoLogger,
    private readonly dbService: DbService,
  ) {
    this.logger.setContext(MigrationRunnerService.name);
  }

  async onModuleInit(): Promise<void> {
    const db = this.dbService.db;

    const migrator = new Migrator({
      db,
      provider: new FileMigrationProvider({
        fs,
        path,
        migrationFolder: path.resolve(__dirname, '../../migrations'),
      }),
    });
    const result = await migrator.migrateToLatest();

    if (result.error || !result.results) {
      this.logger.error('Failed to apply database migrations.', result.error);
      return;
    }

    const appliedMigrations = result.results
      .filter((r) => r.status === 'Success')
      .map((r) => r.migrationName);

    if (appliedMigrations.length > 0) {
      this.logger.info(
        `Applied ${appliedMigrations.length} migration(s): ${appliedMigrations.join(', ')}`,
      );
    } else {
      this.logger.info('No new migrations to apply — database is up to date');
    }
  }
}
