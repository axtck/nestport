import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readdir } from 'fs/promises';
import * as path from 'path';
import { ConfigHelper, IDatabaseConfig } from 'src/config/config.helper';
import { Id, QueryString } from 'src/types/core.types';
import { Database } from '../database';

@Injectable()
export class DatabaseAdmin {
  constructor(
    private readonly database: Database,
    private readonly logger: Logger,
    private readonly configHelper: ConfigHelper,
    private readonly configService: ConfigService,
  ) {}

  private readonly dbConfig: IDatabaseConfig = this.configHelper.getDatabaseConfig();

  public async setSchema(): Promise<void> {
    const getSchemaQuery: QueryString = `
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name = '${this.dbConfig.schema}'
    `;

    const existingSchema = await this.database.queryOneOrDefault(getSchemaQuery);

    if (existingSchema) return;

    await this.database.query(`CREATE SCHEMA ${this.dbConfig.schema} AUTHORIZATION ${this.dbConfig.user}`);
    await this.database.query(`ALTER DATABASE ${this.dbConfig.database} SET search_path TO ${this.dbConfig.schema}`);
  }

  public async runMigrations(migrationsFolderPath: string): Promise<void> {
    try {
      // create migrations table
      await this.createMigrationsTable();

      let files: string[];
      try {
        // get migrations
        files = await readdir(migrationsFolderPath);
      } catch {
        this.logger.error('reading migrations folder failed', DatabaseAdmin.name);
        return;
      }
      const compiledMigrationFiles: string[] = files.filter((f) => f.split('.')[f.split('.').length - 1] === 'js');
      const migrationsToRun: string[] = await this.getMigrationsToRun(compiledMigrationFiles);
      if (!migrationsToRun || !migrationsToRun.length) {
        this.logger.log('no migrations to run', DatabaseAdmin.name);
        return;
      }

      // sort based on timestamp (chronological order)
      const sortedMigrationsToRun: string[] = migrationsToRun.sort((a, b) => {
        return this.convertFilename(a).id - this.convertFilename(b).id;
      });
      this.logger.log(
        `migrations to run (in order): ${migrationsToRun
          .map((m) => this.convertFilename(m).id)
          .join(', ')
          .slice(0, -2)}.`,
        DatabaseAdmin.name,
      );

      // upgrade all migrations to run
      for (const file of sortedMigrationsToRun) {
        const migration: IMigrationFile = await import(path.join(migrationsFolderPath, file)); // import migration
        const migrationFileInfo: IMigrationFileInfo = this.convertFilename(file); // extract file info

        try {
          if (!migration.upgrade) throw new Error(`migration ${file} doesn't have an upgrade function`);
          this.logger.log(
            `upgrading: migration ${migrationFileInfo.id} (${migrationFileInfo.name})`,
            DatabaseAdmin.name,
          );
          await migration.upgrade(this.database, this.configService);
          this.logger.log(`migration ${migrationFileInfo.id} successfully upgraded`, DatabaseAdmin.name);
          await this.insertOrUpdateMigration(migrationFileInfo, true);
        } catch (e) {
          this.logger.error(`migration ${migrationFileInfo.id} upgrading failed: ${e}`, DatabaseAdmin.name);
          await this.insertOrUpdateMigration(migrationFileInfo, false);
        }
      }
    } catch (e) {
      this.logger.error(`upgrading database failed: ${e}`, DatabaseAdmin.name);
    }
  }

  private async createMigrationsTable(): Promise<void> {
    const getMigrationsTableQuery: QueryString = `
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = '${this.dbConfig.schema}' AND table_name = 'migrations'
    `;

    const existingTable: unknown = await this.database.queryOneOrDefault(getMigrationsTableQuery);
    if (existingTable) {
      this.logger.log('migrations table not created (exists)', DatabaseAdmin.name);
      return;
    }

    const createMigrationsTableQuery: QueryString = `
      CREATE TABLE ${this.dbConfig.schema}.migrations (
        "id" int8 NOT NULL,
        "name" varchar(100) NOT NULL,
        "succeeded" bool NOT NULL,
        "created" timestamp NOT NULL,
        "executed" timestamp NOT NULL,
        CONSTRAINT migrations_pk PRIMARY KEY ("id")
      )
    `;

    await this.database.query(createMigrationsTableQuery);
    this.logger.log('successfully created migrations table', DatabaseAdmin.name);
  }

  private async insertOrUpdateMigration(migrationFileInfo: IMigrationFileInfo, succeeded: boolean): Promise<void> {
    const insertMigrationQuery: QueryString = `
      INSERT INTO ${this.dbConfig.schema}.migrations
      ("id", "name", "succeeded", "created", "executed") 
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT ("id") DO UPDATE 
      SET "succeeded" = excluded.succeeded, "executed" = excluded.executed
    `;

    const parameters: Array<number | string | Date | boolean> = [
      migrationFileInfo.id, // id
      migrationFileInfo.name, // name
      succeeded, // succeeded
      new Date(migrationFileInfo.id), // created
      new Date(), // executed
    ];

    await this.database.query(insertMigrationQuery, parameters);
  }

  private async getStoredMigrations(): Promise<Array<{ id: string }>> {
    const getStoredMigrationsQuery: QueryString = `SELECT id FROM ${this.dbConfig.schema}.migrations`;
    const storedMigrations: Array<{ id: string }> = await this.database.query(getStoredMigrationsQuery);
    return storedMigrations;
  }

  private async getFailedMigrations(): Promise<Array<{ id: string }>> {
    const getMigrationsQuery: QueryString = `SELECT id FROM ${this.dbConfig.schema}.migrations WHERE succeeded = FALSE`;
    const failedMigrations: Array<{ id: string }> = await this.database.query(getMigrationsQuery);
    return failedMigrations;
  }

  private async getMigrationsToRun(migrationFiles: string[]): Promise<string[]> {
    const storedMigrationIds: Id[] = (await this.getStoredMigrations()).map((m) => Number(m.id));
    const failedMigrationIds: Id[] = (await this.getFailedMigrations()).map((m) => Number(m.id));

    // filter out new migrations
    const newMigrations: string[] = migrationFiles.filter((m) => {
      return !storedMigrationIds.includes(this.convertFilename(m).id);
    });

    // filter out failed migrations
    const failedMigrations: string[] = migrationFiles.filter((m) => {
      return failedMigrationIds.includes(this.convertFilename(m).id);
    });

    const migrationsToRun: string[] = [...newMigrations, ...failedMigrations]; // concat new and failed migrations
    return migrationsToRun;
  }

  private convertFilename(filename: string): IMigrationFileInfo {
    const parts = filename
      .slice(0, -3)
      .split(/_(.+)/)
      .filter((x) => x); // slice of extention and split on first _
    if (!parts || parts.length !== 2) throw new Error(`converting filename '${filename}' failed`);
    if (isNaN(Number(parts[0]))) throw new Error('migration timestamp missing in filename');
    const info: IMigrationFileInfo = {
      id: Number(parts[0]),
      name: parts[1],
    };
    return info;
  }
}

interface IMigrationFile {
  upgrade: (database: Database, configService?: ConfigService) => Promise<void>;
}

interface IMigrationFileInfo {
  id: Id;
  name: string;
}
