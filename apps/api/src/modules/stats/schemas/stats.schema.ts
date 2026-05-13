import { ApiProperty } from '@nestjs/swagger';
import type { StatsDTO } from '@hypetube/contracts';
import { VideoSchema } from '../../videos/schemas/video.schema';

export class StatsSchema implements StatsDTO {
  @ApiProperty({ example: 50 })
  totalVideos!: number;

  @ApiProperty({ example: 0.35, description: 'Promedio simple de hypeScore en el catálogo.' })
  averageHype!: number;

  @ApiProperty({ example: 12 })
  totalTutorials!: number;

  @ApiProperty({ example: 'Coder A', nullable: true })
  topAuthor!: string | null;

  @ApiProperty({ type: VideoSchema, nullable: true })
  topHypeVideo!: VideoSchema | null;
}

export class StatsResponseSchema {
  @ApiProperty({ type: StatsSchema })
  data!: StatsSchema;
}
