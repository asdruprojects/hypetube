import { Controller, Get, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { VideoDTO } from '@hypetube/contracts';
import { VideosService } from './videos.service';
import { VideosQueryDto } from './dto/videos-query.dto';
import { VideosResponseSchema } from './schemas/video.schema';
import { ApiErrorResponseSchema } from '../../common/swagger/api-success.schema';

@ApiTags('videos')
@Controller('api/videos')
export class VideosController {
  constructor(private readonly videos: VideosService) {}

  @Get()
  @ApiOperation({
    summary: 'Lista videos transformados',
    description:
      'Devuelve el catálogo aplicando filtros (`search`, `tutorialsOnly`) y orden (`sortBy`, `order`). El default es `sortBy=hype&order=desc`.',
  })
  @ApiOkResponse({ type: VideosResponseSchema, description: 'Lista de videos en el envelope `{ data }`.' })
  @ApiBadRequestResponse({
    type: ApiErrorResponseSchema,
    description: 'Query params inválidos (ej. `sortBy` fuera del enum).',
  })
  async list(@Query() query: VideosQueryDto): Promise<VideoDTO[]> {
    return this.videos.findAll(query);
  }
}
