import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { DbHealthIndicator } from './indicators/db.indicator';
import { RmqHealthIndicator } from './indicators/rmq.indicator';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly dbIndicator: DbHealthIndicator,
    private readonly rmqIndicator: RmqHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.dbIndicator.isHealthy('postgres'),
      () => this.rmqIndicator.isHealthy('rabbitmq'),
    ]);
  }
}
