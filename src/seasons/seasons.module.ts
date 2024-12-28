import { Module } from '@nestjs/common';
import { SeasonsService } from './seasons.service';
import { SeasonsController } from './seasons.controller';
import { MongooseModule } from '@nestjs/mongoose';
import seasonSchema from './season.model';
import { episodeSchema } from './Episode.model';

@Module({
    imports: [MongooseModule.forFeature([
      { name:'Season', schema: seasonSchema },
      { name:"Episode", schema: episodeSchema}

    ])],
  providers: [SeasonsService],
  controllers: [SeasonsController]
})
export class SeasonsModule {}
