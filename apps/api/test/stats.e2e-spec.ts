import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { StatsDTO } from '@hypetube/contracts';
import { buildTestApp } from './utils/bootstrap';

/**
 * Tests del endpoint GET /api/stats. El fixture controlado se inyecta vía
 * `test/setup.ts` (MOCK_VIDEOS_PATH) para verificar agregados exactos.
 */
describe('GET /api/stats (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await buildTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('devuelve los agregados correctos del fixture', async () => {
    const res = await request(app.getHttpServer()).get('/api/stats').expect(200);

    expect(res.body).toHaveProperty('data');
    const stats: StatsDTO = res.body.data;

    expect(stats.totalVideos).toBe(5);
    expect(stats.totalTutorials).toBe(2);
    // (0.25 + 1.0 + 0.1 + 0 + 0.4) / 5 = 0.35
    expect(stats.averageHype).toBeCloseTo(0.35, 4);

    // Coder A acumula más hype (0.25 + 1.0 = 1.25) que cualquier otro autor.
    expect(stats.topAuthor).toBe('Coder A');

    // El top hype es la "joya": vid_node_tutorial.
    expect(stats.topHypeVideo).not.toBeNull();
    expect(stats.topHypeVideo!.id).toBe('vid_node_tutorial');
    expect(stats.topHypeVideo!.isTutorial).toBe(true);
    expect(stats.topHypeVideo!.hypeScore).toBeCloseTo(1.0, 4);
  });

  it('respeta el shape público de StatsDTO', async () => {
    const res = await request(app.getHttpServer()).get('/api/stats').expect(200);

    expect(res.body.data).toEqual(
      expect.objectContaining({
        totalVideos: expect.any(Number),
        averageHype: expect.any(Number),
        totalTutorials: expect.any(Number),
        topAuthor: expect.any(String),
        topHypeVideo: expect.objectContaining({
          id: expect.any(String),
          hypeScore: expect.any(Number),
        }),
      }),
    );
  });
});
