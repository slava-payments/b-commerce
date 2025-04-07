import { Kysely, Migration, sql } from 'kysely';
import { Database } from '../src/db/db.schema';

export const up: Migration['up'] = async (db: Kysely<Database>) => {
  await db.schema
    .createTable('saga')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('order_id', 'varchar', (col) => col.notNull().unique())
    .addColumn('status', 'varchar', (col) => col.notNull())
    .addColumn('current_step', 'varchar')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute();
};

export const down: Migration['down'] = async (db: Kysely<Database>) => {
  await db.schema.dropTable('saga').execute();
};
