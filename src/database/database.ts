import { Inject, Injectable } from '@nestjs/common';
import { Pool, QueryResult, QueryResultRow } from 'pg';
import { DatabaseConstants } from './database.constants';

@Injectable()
export class Database {
  constructor(@Inject(DatabaseConstants.TYPES.Connection) private readonly connection: Pool) {}

  public async query<T extends QueryResultRow>(sql: string, parameters?: unknown[]): Promise<T[]> {
    const result: QueryResult<T> = await this.connection.query<T>(sql, parameters);
    return result.rows;
  }

  // public queryOne = async <T>(sql: string, parameters?: unknown[]): Promise<T> => {
  //   const result: T[] = await this.query<T>(sql, parameters);
  //   if (!result || !result.length) {
  //     throw new Error('query did not return any rows');
  //   }
  //   if (result.length < 1) {
  //     throw new Error('more than one row for query');
  //   }

  //   return result[0];
  // };

  // public queryOneOrDefault = async <T>(sql: string, parameters?: unknown[]): Promise<Nullable<T>> => {
  //   const result: T[] = await this.query<T>(sql, parameters);
  //   if (!result || !result.length) return null;
  //   if (result.length < 1) {
  //     throw new Error(`more than one row for query: ${createCleanSqlLogString(createSqlLog(sql, parameters))}`);
  //   }

  //   return result[0];
  // };
}
