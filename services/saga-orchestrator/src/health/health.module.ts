import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { DbHealthIndicator } from './indicators/db.indicator';
import { RmqHealthIndicator } from './indicators/rmq.indicator';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [TerminusModule, EventsModule],
  controllers: [HealthController],
  providers: [DbHealthIndicator, RmqHealthIndicator],
})
export class HealthModule {}
