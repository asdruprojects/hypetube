import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { StatsDTO } from '@hypetube/contracts';
import { StatsService } from './stats.service';
import { StatsResponseSchema } from './schemas/stats.schema';

@ApiTags('stats')
@Controller('api/stats')
export class StatsController {
  constructor(private readonly stats: StatsService) {}

  @Get()
  @ApiOperation({
    summary: 'Métricas agregadas del catálogo',
    description: 'Totales, hype promedio, top creator y video con mayor hype (Joya de la Corona).',
  })
  @ApiOkResponse({ type: StatsResponseSchema })
  async get(): Promise<StatsDTO> {
    return this.stats.getStats();
  }
}
