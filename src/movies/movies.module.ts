import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import {scrapingSchema} from './movies.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name:'scraping', schema: scrapingSchema }])],
  exports: [MoviesService],
  controllers: [MoviesController],
  providers: [MoviesService]
})
export class MoviesModule {}
