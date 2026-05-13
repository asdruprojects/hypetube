import { Controller, Get } from '@nestjs/common';
import type { StatsDTO } from '@hypetube/contracts';
import { StatsService } from './stats.service';

@Controller('api/stats')
export class StatsController {
  constructor(private readonly stats: StatsService) {}

  @Get()
  async get(): Promise<StatsDTO> {
    return this.stats.getStats();
  }
}
