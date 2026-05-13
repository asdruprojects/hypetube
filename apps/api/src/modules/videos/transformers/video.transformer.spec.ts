import { transformYoutubeItem } from './video.transformer';
import type { YoutubeRawItem } from '../types/youtube.types';

const NOW = new Date('2026-05-12T18:00:00.000Z');

function makeItem(overrides: Partial<YoutubeRawItem> = {}): YoutubeRawItem {
  return {
    id: 'vid_test',
    snippet: {
      title: 'Default title',
      channelTitle: 'CanalDemo',
      publishedAt: new Date(NOW.getTime() - 24 * 3600 * 1000).toISOString(),
      thumbnails: { high: { url: 'https://img/test.png' } },
    },
    statistics: {
      viewCount: '100',
      likeCount: '20',
      commentCount: '10',
    },
    ...overrides,
  };
}

describe('transformYoutubeItem', () => {
  it('mapea los campos básicos y calcula hype base', () => {
    const dto = transformYoutubeItem(makeItem(), NOW)!;
    expect(dto).not.toBeNull();
    expect(dto.id).toBe('vid_test');
    expect(dto.author).toBe('CanalDemo');
    expect(dto.views).toBe(100);
    expect(dto.likes).toBe(20);
    expect(dto.comments).toBe(10);
    expect(dto.hypeScore).toBeCloseTo(0.3, 4);
    expect(dto.isTutorial).toBe(false);
    expect(dto.relativePublishedDate).toBe('Hace 1 día');
  });

  it('aplica multiplicador de tutorial sobre el título', () => {
    const dto = transformYoutubeItem(
      makeItem({
        snippet: {
          title: 'React - Tutorial',
          channelTitle: 'CanalDemo',
          publishedAt: NOW.toISOString(),
          thumbnails: { high: { url: 'https://img/x.png' } },
        },
      }),
      NOW,
    )!;
    expect(dto.isTutorial).toBe(true);
    expect(dto.hypeScore).toBeCloseTo(0.6, 4);
  });

  it('asigna hype 0 cuando commentCount falta (comentarios deshabilitados)', () => {
    const dto = transformYoutubeItem(
      makeItem({
        statistics: { viewCount: '500', likeCount: '40' },
      }),
      NOW,
    )!;
    expect(dto.comments).toBeNull();
    expect(dto.hypeScore).toBe(0);
  });

  it('descarta items sin id', () => {
    expect(transformYoutubeItem({ id: '', snippet: {} } as YoutubeRawItem, NOW)).toBeNull();
    expect(transformYoutubeItem({ snippet: {} } as YoutubeRawItem, NOW)).toBeNull();
  });

  it('parsea strings numéricos correctamente', () => {
    const dto = transformYoutubeItem(
      makeItem({
        statistics: { viewCount: '1000', likeCount: '250', commentCount: '50' },
      }),
      NOW,
    )!;
    expect(dto.views).toBe(1000);
    expect(dto.likes).toBe(250);
    expect(dto.comments).toBe(50);
  });

  it('usa thumbnail fallback cuando no hay ninguna', () => {
    const dto = transformYoutubeItem(
      makeItem({ snippet: { title: 'x', channelTitle: 'y', publishedAt: NOW.toISOString() } }),
      NOW,
    )!;
    expect(dto.thumbnail).toContain('placeholder');
  });
});
