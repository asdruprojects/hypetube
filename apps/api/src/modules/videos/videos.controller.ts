import { Controller, Get, Query } from '@nestjs/common';
import type { VideoDTO } from '@hypetube/contracts';
import { VideosService } from './videos.service';
import { VideosQueryDto } from './dto/videos-query.dto';

@Controller('api/videos')
export class VideosController {
  constructor(private readonly videos: VideosService) {}

  @Get()
  async list(@Query() query: VideosQueryDto): Promise<VideoDTO[]> {
    return this.videos.findAll(query);
  }
}
