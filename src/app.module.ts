import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import {scrapingSchema }from './movies/movies.model';
import { MongooseModule } from '@nestjs/mongoose';
import { SeasonsModule } from './seasons/seasons.module';
import {SeasonSchema} from './seasons/season.model'
import  {episodeSchema} from './seasons/Episode.model'
 
@Module({
  imports: [
      MongooseModule.forRoot('mongodb+srv://Faryad:faryad123456@cluster0.xtwkfwt.mongodb.net/fun-movies-cloud'),
        MongooseModule.forFeature([
          { name: 'scraping', schema: scrapingSchema },
          { name: 'Season', schema: SeasonSchema },
          { name: 'Episode', schema: episodeSchema },

  
        ]),
    MoviesModule,
    SeasonsModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
