import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { WatchHistoryService } from './recommendations.service';

@Controller('api/watch-history')
export class WatchHistoryController {
  constructor(private readonly watchHistoryService: WatchHistoryService) {}

 
  @Get('recommended/:language')
  async trackWatchTime(@Param('language') language: string) {
    const recommendations = await this.watchHistoryService.getRecommendations(language);
    return { message: 'Recommendations retrieved successfully.', recommendations };
  }
}
