import { Injectable, InternalServerErrorException, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import * as path from 'path';
import type { VideoDTO } from '@hypetube/contracts';
import { transformYoutubeItem } from './transformers/video.transformer';
import type { YoutubeRawResponse } from './types/youtube.types';

/**
 * Carga el dump de YouTube una sola vez (lazy + memoizado). El archivo se
 * considera estático para el proceso: en un escenario real lo refrescaríamos
 * desde S3/CMS, pero para esta prueba alcanza con caché en memoria.
 */
@Injectable()
export class VideosRepository implements OnModuleInit {
  private readonly logger = new Logger(VideosRepository.name);
  private cache: VideoDTO[] | null = null;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit(): Promise<void> {
    // Precarga al arranque para fallar rápido si el archivo no existe.
    await this.findAll();
  }

  /** Devuelve la lista cacheada de videos ya transformados. */
  async findAll(): Promise<VideoDTO[]> {
    if (this.cache) return this.cache;

    const filePath = this.resolveMockPath();
    let raw: string;
    try {
      raw = await fs.readFile(filePath, 'utf8');
    } catch (err) {
      this.logger.error(`No se pudo leer el dump de videos: ${filePath}`);
      throw new InternalServerErrorException({
        code: 'VIDEOS_SOURCE_UNAVAILABLE',
        message: 'No se pudo cargar la fuente de videos.',
      });
    }

    let parsed: YoutubeRawResponse;
    try {
      parsed = JSON.parse(raw) as YoutubeRawResponse;
    } catch (err) {
      throw new InternalServerErrorException({
        code: 'VIDEOS_SOURCE_INVALID',
        message: 'El dump de YouTube no es un JSON válido.',
      });
    }

    const now = new Date();
    const items = Array.isArray(parsed.items) ? parsed.items : [];
    const dtos = items
      .map((item) => transformYoutubeItem(item, now))
      .filter((v): v is VideoDTO => v !== null);

    this.cache = dtos;
    this.logger.log(`Cargados ${dtos.length} videos desde ${path.basename(filePath)}`);
    return dtos;
  }

  private resolveMockPath(): string {
    const override = this.config.get<string>('MOCK_VIDEOS_PATH');
    if (override && override.trim() !== '') {
      return path.isAbsolute(override) ? override : path.resolve(process.cwd(), override);
    }
    // `__dirname` apunta a dist en runtime; el JSON se copia gracias a nest-cli assets.
    return path.join(__dirname, '..', '..', 'data', 'mock-youtube-api.json');
  }
}
