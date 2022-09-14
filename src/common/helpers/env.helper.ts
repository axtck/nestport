import { existsSync } from 'fs';
import { resolve } from 'path';

export const getEnvPath = (dest: string): string => {
  const environment: string | undefined = process.env.NODE_ENV;
  const fallback: string = resolve(`${dest}/.env`);
  const filename: string = environment ? `${environment}.env` : 'development.env';
  const filePath: string = resolve(`${dest}/${filename}`);

  if (!existsSync(filePath)) return fallback;

  return filePath;
};
