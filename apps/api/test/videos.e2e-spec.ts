import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { VideoDTO } from '@hypetube/contracts';
import { buildTestApp } from './utils/bootstrap';

/**
 * Tests del endpoint público GET /api/videos.
 * El fixture controlado se inyecta vía `test/setup.ts` (MOCK_VIDEOS_PATH),
 * así las assertions sobre orden, hype y filtros son exactas y no dependen
 * del dump real.
 */
describe('GET /api/videos (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await buildTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  const get = (qs = '') =>
    request(app.getHttpServer()).get(`/api/videos${qs ? `?${qs}` : ''}`);

  it('devuelve { data: VideoDTO[] } con todos los videos del fixture', async () => {
    const res = await get().expect(200);

    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toHaveLength(5);

    const sample: VideoDTO = res.body.data[0];
    expect(sample).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: expect.any(String),
        author: expect.any(String),
        thumbnail: expect.any(String),
        relativePublishedDate: expect.any(String),
        publishedAt: expect.any(String),
        views: expect.any(Number),
        likes: expect.any(Number),
        hypeScore: expect.any(Number),
        isTutorial: expect.any(Boolean),
      }),
    );
    // `comments` puede ser number o null (videos con chat deshabilitado).
    expect([null, expect.any(Number)]).toContainEqual(sample.comments);
  });

  it('por defecto ordena por hype DESC: la "joya" aparece primera', async () => {
    const res = await get().expect(200);
    const ids = res.body.data.map((v: VideoDTO) => v.id);

    expect(ids).toEqual([
      'vid_node_tutorial', // hype 1.0 (tutorial x2)
      'vid_old_tutorial',  // 0.4
      'vid_react',         // 0.25
      'vid_ts',            // 0.1
      'vid_disabled',      // 0 (comentarios deshabilitados)
    ]);

    expect(res.body.data[0].hypeScore).toBeCloseTo(1.0, 4);
    expect(res.body.data[0].isTutorial).toBe(true);
    expect(res.body.data[4].hypeScore).toBe(0);
    expect(res.body.data[4].comments).toBeNull();
  });

  it('?sortBy=views&order=asc ordena por vistas ascendente', async () => {
    const res = await get('sortBy=views&order=asc').expect(200);
    const views = res.body.data.map((v: VideoDTO) => v.views);

    expect(views).toEqual([100, 500, 1000, 1000, 2000]);
  });

  it('?sortBy=newest devuelve primero los más recientes', async () => {
    const res = await get('sortBy=newest').expect(200);
    const ids = res.body.data.map((v: VideoDTO) => v.id);

    expect(ids[0]).toBe('vid_disabled'); // 2026-05-05
    expect(ids[ids.length - 1]).toBe('vid_old_tutorial'); // 2026-03-01
  });

  it('?search filtra por título o autor (case-insensitive)', async () => {
    const byTitle = await get('search=react').expect(200);
    expect(byTitle.body.data.map((v: VideoDTO) => v.id)).toEqual(['vid_react']);

    const byAuthor = await get('search=Coder%20A').expect(200);
    const ids = byAuthor.body.data.map((v: VideoDTO) => v.id).sort();
    expect(ids).toEqual(['vid_node_tutorial', 'vid_react']);

    const noMatch = await get('search=xyz-nada').expect(200);
    expect(noMatch.body.data).toEqual([]);
  });

  it('?tutorialsOnly=true devuelve sólo los tutoriales detectados', async () => {
    const res = await get('tutorialsOnly=true').expect(200);
    const ids = res.body.data.map((v: VideoDTO) => v.id).sort();

    expect(ids).toEqual(['vid_node_tutorial', 'vid_old_tutorial']);
    res.body.data.forEach((v: VideoDTO) => expect(v.isTutorial).toBe(true));
  });

  it('rechaza sortBy inválido con 400 y un envelope { error }', async () => {
    const res = await get('sortBy=ranking').expect(400);

    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toEqual(
      expect.objectContaining({
        code: expect.any(String),
        message: expect.any(String),
      }),
    );
  });
});
