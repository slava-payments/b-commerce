import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { Database } from './db.schema';
import { DbConfig } from './db.config';
import { Pool } from 'pg';

@Injectable()
export class DbService implements OnModuleDestroy {
  public readonly db: Kysely<Database>;

  constructor(config: DbConfig) {
    const pool = new Pool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      ssl: config.ssl ? { rejectUnauthorized: false } : undefined,
    });

    this.db = new Kysely<Database>({
      dialect: new PostgresDialect({ pool }),
      plugins: [new CamelCasePlugin()],
    });
  }

  async onModuleDestroy() {
    await this.db.destroy();
  }
}
