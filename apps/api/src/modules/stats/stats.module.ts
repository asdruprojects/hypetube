import { Module } from '@nestjs/common';
import { VideosModule } from '../videos/videos.module';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
  imports: [VideosModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
