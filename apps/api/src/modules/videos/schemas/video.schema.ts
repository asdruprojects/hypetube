import { ApiProperty } from '@nestjs/swagger';
import type { VideoDTO } from '@hypetube/contracts';

/**
 * Mirror del `VideoDTO` para Swagger. Mantengo el contrato (en `@hypetube/contracts`)
 * libre de decoradores; este shim sólo agrega metadatos de documentación.
 */
export class VideoSchema implements VideoDTO {
  @ApiProperty({ example: 'dQw4w9WgXcQ' })
  id!: string;

  @ApiProperty({ example: 'React patterns avanzados' })
  title!: string;

  @ApiProperty({ example: 'Coder A' })
  author!: string;

  @ApiProperty({ example: 'https://i.ytimg.com/vi/abc/hqdefault.jpg' })
  thumbnail!: string;

  @ApiProperty({ example: 'Hace 2 meses' })
  relativePublishedDate!: string;

  @ApiProperty({ example: '2026-03-12T10:00:00.000Z' })
  publishedAt!: string;

  @ApiProperty({ example: 1000 })
  views!: number;

  @ApiProperty({ example: 200 })
  likes!: number;

  @ApiProperty({
    example: 50,
    nullable: true,
    description: '`null` cuando los comentarios están deshabilitados.',
  })
  comments!: number | null;

  @ApiProperty({ example: 0.25, description: 'Hype final con multiplicador de tutorial aplicado.' })
  hypeScore!: number;

  @ApiProperty({ example: false })
  isTutorial!: boolean;
}

export class VideosResponseSchema {
  @ApiProperty({ type: [VideoSchema] })
  data!: VideoSchema[];
}
