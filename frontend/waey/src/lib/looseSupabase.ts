/**
 * Permissive typing for dynamic-table Supabase writes.
 *
 * Rows assembled from localStorage (`Record<string, unknown>`) intentionally
 * bypass the generated schema typing, and a few tables (e.g. `prize`) are
 * newer than the checked-in generated types. This small surface keeps those
 * call sites type-safe without `any`. Used by supabaseStorage, streak and
 * offlineQueue.
 */
export interface LooseResult {
  data: unknown;
  error: unknown;
  count: number | null;
}

export interface LoosePostgrestBuilder {
  upsert(
    data: Record<string, unknown>,
    options?: { onConflict?: string }
  ): Promise<LooseResult>;
  insert(
    data: Record<string, unknown> | Record<string, unknown>[]
  ): Promise<LooseResult>;
  update(data: Record<string, unknown>): LoosePostgrestBuilder;
  delete(): LoosePostgrestBuilder;
  select(columns?: string): LoosePostgrestBuilder;
  eq(column: string, value: unknown): LoosePostgrestBuilder;
  neq(column: string, value: unknown): LoosePostgrestBuilder;
  in(column: string, values: unknown[]): LoosePostgrestBuilder;
  order(column: string, options?: { ascending?: boolean }): LoosePostgrestBuilder;
  limit(count: number): LoosePostgrestBuilder;
  single(): LoosePostgrestBuilder;
  maybeSingle(): LoosePostgrestBuilder;
  then<TResult1 = LooseResult, TResult2 = never>(
    onfulfilled?:
      | ((value: LooseResult) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: unknown) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null
  ): Promise<TResult1 | TResult2>;
  catch<TResult = never>(
    onrejected?:
      | ((reason: unknown) => TResult | PromiseLike<TResult>)
      | undefined
      | null
  ): Promise<LooseResult | TResult>;
}

export interface LooseSyncClient {
  from(table: string): LoosePostgrestBuilder;
}

export const toLooseClient = (sb: unknown): LooseSyncClient =>
  sb as LooseSyncClient;