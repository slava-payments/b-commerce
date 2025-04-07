import { Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import { DbService } from '../../db/db.service';

@Injectable()
export class DbHealthIndicator {
  constructor(
    private readonly db: DbService,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(key: string) {
    const indicator = this.healthIndicatorService.check(key);

    try {
      await this.db.db.selectFrom('saga').select('id').limit(1).execute();

      return indicator.up();
    } catch (error) {
      return indicator.down({
        message: error instanceof Error ? error.message : 'Unknown DB error',
      });
    }
  }
}
