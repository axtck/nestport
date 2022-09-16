import { existsSync } from 'fs';
import { Environment } from '../environment.types';
import * as path from 'path';

export const getEnvPath = (folderPath: string, environment: Environment): string => {
  const filePath: string = path.resolve(`${folderPath}/${environment}.env`);

  if (!existsSync(filePath)) {
    throw new Error(`No .env file found called ${environment}.env in ${folderPath}`);
  }

  return filePath;
};

export const logExportCommands = (environments: Environment[]) => {
  return `run ${environments.map((e) => `'export NODE_ENV=${e}'`).join(' OR ')} on host machine`;
};
