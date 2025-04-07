import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '../../common/constants/injection-tokens';
import { ClientProxy } from '@nestjs/microservices';
import { HealthIndicatorService } from '@nestjs/terminus';

@Injectable()
export class RmqHealthIndicator {
  constructor(
    @Inject(TOKENS.RABBITMQ) private readonly rmqClient: ClientProxy,
    private readonly indicator: HealthIndicatorService,
  ) {}

  async isHealthy(key: string) {
    const check = this.indicator.check(key);

    try {
      await this.rmqClient.connect();
      return check.up();
    } catch (error) {
      return check.down({
        message: error instanceof Error ? error.message : 'RabbitMQ down',
      });
    }
  }
}
