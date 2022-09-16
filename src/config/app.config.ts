import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  environment: process.env.NODE_ENV,
  port: parseInt(process.env.NODE_PORT as string, 10) || 3100,
}));
