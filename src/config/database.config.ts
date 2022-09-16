import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  port: parseInt(process.env.NODE_PORT as string, 10) || 3100,
}));
