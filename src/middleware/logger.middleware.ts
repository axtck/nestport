import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger: Logger = new Logger('HTTP');
  use(req: Request, res: Response, next: NextFunction) {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    this.logger.log(`HTTP ${req.method} ${fullUrl} ${res.statusCode}`);
    next();
  }
}
