import { Kysely, Migration, sql } from 'kysely';
import { Database } from '../src/db/db.schema';

export const up: Migration['up'] = async (db: Kysely<Database>) => {
  // ─── saga ──────────────────────────────────────────────────────────────────────
  await db.schema
    .createTable('saga')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('order_id', 'varchar', (col) => col.notNull().unique())
    .addColumn('status', 'varchar', (col) => col.notNull())
    .addColumn('last_step', 'varchar')
    .addColumn('reason', 'text')
    .addColumn('metadata', 'jsonb')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('completed_at', 'timestamptz')
    .execute();

  await db.schema
    .createTable('saga_step_log')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('saga_id', 'integer', (col) =>
      col.notNull().references('saga.id').onDelete('cascade'),
    )
    .addColumn('step', 'varchar', (col) => col.notNull())
    .addColumn('status', 'varchar', (col) => col.notNull())
    .addColumn('reason', 'text')
    .addColumn('payload', 'jsonb')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .execute();
};

export const down: Migration['down'] = async (db: Kysely<Database>) => {
  await db.schema.dropTable('saga_step_log').execute();
  await db.schema.dropTable('saga').execute();
};
