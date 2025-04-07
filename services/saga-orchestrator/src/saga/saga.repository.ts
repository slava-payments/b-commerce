import { Injectable } from '@nestjs/common';
import { Saga } from './entities/saga.entity';
import { DbService } from '../db/db.service';
import { SagaStatus, SagaStep, SagaStepStatus } from './saga.state';
import { sql } from 'kysely';
import { BaseEvent } from '@shared/messages';
import { JsonValue } from '../db/json-value';
import { SagaStepLog } from './entities/saga-step-log.entity';

@Injectable()
export class SagaRepository {
  constructor(private readonly db: DbService) {}

  async create(orderId: string): Promise<number | undefined> {
    const result = await this.db.db
      .insertInto('saga')
      .values({
        orderId: orderId,
        status: SagaStatus.CREATED,
        lastStep: SagaStep.ORDER,
        createdAt: sql`now()`,
        updatedAt: sql`now()`,
      })
      .returning('id')
      .executeTakeFirst();

    return result?.id;
  }

  async log(
    sagaId: number,
    step: SagaStep,
    status: SagaStepStatus,
    payload?: JsonValue<BaseEvent>,
    reason?: string,
  ) {
    await this.db.db
      .insertInto('saga_step_log')
      .values({
        sagaId: sagaId,
        step,
        status,
        reason: reason ?? null,
        payload: payload ?? null,
        createdAt: sql`now()`,
      })
      .execute();
  }

  async updateStatus(
    sagaId: number,
    status: SagaStatus,
    lastStep?: SagaStep,
    reason?: string,
    metadata?: JsonValue<BaseEvent>,
  ) {
    await this.db.db
      .updateTable('saga')
      .set({
        status,
        lastStep: lastStep ?? null,
        updatedAt: sql`now()`,
        reason: reason ?? null,
        metadata: metadata ?? null,
        completedAt:
          status === SagaStatus.COMPLETED || status === SagaStatus.FAILED
            ? sql`now()`
            : undefined,
      })
      .where('id', '=', sagaId)
      .execute();
  }

  async findByOrderId(orderId: string): Promise<Saga | undefined> {
    return this.db.db
      .selectFrom('saga')
      .selectAll()
      .where('orderId', '=', orderId)
      .executeTakeFirst();
  }

  async getStepLogsBySagaId(sagaId: number): Promise<SagaStepLog[]> {
    return this.db.db
      .selectFrom('saga_step_log')
      .selectAll()
      .where('sagaId', '=', sagaId)
      .orderBy('createdAt', 'asc')
      .execute();
  }
}
