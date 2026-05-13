import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

function buildCorsOriginChecker(config: ConfigService) {
  const raw = config.get<string>('CORS_ORIGIN', 'http://localhost:5173');
  const allowList = raw
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  const tenantLocalhost = /^https?:\/\/[\w-]+\.localhost(?::\d+)?$/i;

  return (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return cb(null, true);
    if (allowList.includes('*')) return cb(null, true);
    if (allowList.includes(origin)) return cb(null, true);
    if (tenantLocalhost.test(origin)) return cb(null, true);
    return cb(null, false);
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: false });
  const config = app.get(ConfigService);

  app.enableCors({
    origin: buildCorsOriginChecker(config),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  const port = Number(config.get<number>('PORT', 4000));
  const host = config.get<string>('HOST', '0.0.0.0');

  await app.listen(port, host);
  Logger.log(`HypeTube API lista en http://${host}:${port}`, 'Bootstrap');
}

bootstrap();
