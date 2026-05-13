import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  const swaggerConfig = new DocumentBuilder()
    .setTitle('HypeTube API')
    .setDescription(
      'Cartelera de videos tech: transforma un dump tipo YouTube en un feed con Hype Score.',
    )
    .setVersion('1.0.0')
    .addTag('videos', 'Listado y filtros del catálogo')
    .addTag('stats', 'Métricas agregadas del catálogo')
    .addTag('health', 'Liveness')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { docExpansion: 'list', defaultModelsExpandDepth: 1 },
  });

  const port = Number(config.get<number>('PORT', 4000));
  const host = config.get<string>('HOST', '0.0.0.0');

  await app.listen(port, host);
  Logger.log(`HypeTube API lista en http://${host}:${port}`, 'Bootstrap');
  Logger.log(`Swagger: http://${host}:${port}/docs`, 'Bootstrap');
}

bootstrap();
