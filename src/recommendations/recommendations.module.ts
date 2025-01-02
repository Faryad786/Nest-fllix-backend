import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WatchHistoryService } from './recommendations.service';
import { WatchHistoryController } from './recommendations.controller';
import {watchHistorySchema }  from './watchHistroy.model';
import { Scraping, scrapingSchema } from '../movies/movies.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "WatchHistory", schema: watchHistorySchema },
      { name: "Scraping", schema: scrapingSchema },
    ]),
  ],
  controllers: [WatchHistoryController],
  providers: [WatchHistoryService],
})
export class WatchHistoryModule {}
