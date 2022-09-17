import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, QueryResult, QueryResultRow } from 'pg';
import { Null, QueryString } from 'src/types/core.types';

@Injectable()
export class Database {
  private readonly connection: Pool;

  constructor(private readonly configService: ConfigService) {
    this.connection = new Pool({
      host: this.configService.get<string>('database.host'),
      port: this.configService.get<number>('database.port'),
      user: this.configService.get<string>('database.user'),
      database: this.configService.get<string>('database.database'),
      password: this.configService.get<string>('database.password'),
    });
  }

  public async query<T extends QueryResultRow>(sql: QueryString, parameters?: unknown[]): Promise<T[]> {
    const result: QueryResult<T> = await this.connection.query<T>(sql, parameters);
    return result.rows;
  }

  public async queryOne<T extends QueryResultRow>(sql: QueryString, parameters?: unknown[]): Promise<T> {
    const result: T[] = await this.query<T>(sql, parameters);

    if (!result || !result.length) throw new Error('query did not return any rows');
    if (result.length < 1) throw new Error('more than one row for query');

    return result[0];
  }

  public queryOneOrDefault = async <T extends QueryResultRow>(
    sql: QueryString,
    parameters?: unknown[],
  ): Promise<Null<T>> => {
    const result: T[] = await this.query<T>(sql, parameters);

    if (!result || !result.length) return null;
    if (result.length < 1) throw new Error('more than one row for query');

    return result[0];
  };
}
