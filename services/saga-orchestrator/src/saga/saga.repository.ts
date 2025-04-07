import { Injectable } from '@nestjs/common';
import { Saga } from './saga.entity';
import { DbService } from '../db/db.service';
import { SagaStatus } from './saga.state';

@Injectable()
export class SagaRepository {
  constructor(private readonly db: DbService) {}

  async create(orderId: string): Promise<void> {
    await this.db.db
      .insertInto('saga')
      .values({
        orderId: orderId,
        status: SagaStatus.CREATED,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .execute();
  }

  async updateStatus(
    orderId: string,
    status: SagaStatus,
    currentStep: string | null,
  ): Promise<void> {
    await this.db.db
      .updateTable('saga')
      .set({ status, currentStep: currentStep, updatedAt: new Date() })
      .where('orderId', '=', orderId)
      .execute();
  }

  async findByOrderId(orderId: string): Promise<Saga | undefined> {
    return this.db.db
      .selectFrom('saga')
      .selectAll()
      .where('orderId', '=', orderId)
      .executeTakeFirst();
  }
}
