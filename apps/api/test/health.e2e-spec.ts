import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { buildTestApp } from './utils/bootstrap';

describe('GET /health (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await buildTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('responde 200 con { data: { status: "ok", timestamp } }', async () => {
    const res = await request(app.getHttpServer()).get('/health').expect(200);

    expect(res.body).toEqual({
      data: {
        status: 'ok',
        timestamp: expect.any(String),
      },
    });

    // El timestamp debe ser un ISO válido.
    const parsed = new Date(res.body.data.timestamp);
    expect(Number.isNaN(parsed.getTime())).toBe(false);
  });
});
