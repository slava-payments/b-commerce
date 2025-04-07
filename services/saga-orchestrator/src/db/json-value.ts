import { Expression, OperationNode, sql } from 'kysely';

export class JsonValue<T> implements Expression<T> {
  #value: T;

  constructor(value: T) {
    this.#value = value;
  }

  get expressionType(): T | undefined {
    return undefined;
  }

  toOperationNode(): OperationNode {
    const json = JSON.stringify(this.#value);

    return sql`CAST(${json} AS JSONB)`.toOperationNode();
  }
}
