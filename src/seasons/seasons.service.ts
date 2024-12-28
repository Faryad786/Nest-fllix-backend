import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {Season} from "./season.model"
import { Episode } from './Episode.model';

@Injectable()
export class SeasonsService {
  constructor(
    @InjectModel('Season') private readonly seasonModel: Model<Season>,
    @InjectModel('Episode') private readonly EpisodeModel: Model<Episode>,
  ) {}

  // Create a new season
  async createSeason(title: string, releaseYear: number ,language: string, poster: string): Promise<Season> {
    const newSeason = new this.seasonModel({ title, releaseYear,language ,poster});
    return newSeason.save();
  }

  // Get all seasons
  async getAllSeasons(): Promise<Season[]> {
    return this.seasonModel.find().exec();
  }

  // Add an episode to a season
  async addEpisode(seasonId: string, episodeData: any): Promise<Episode> {
    const season = await this.seasonModel.findById(seasonId);
    if (!season) {
      throw new Error('Season not found');
    }
    const newEpisode = new this.EpisodeModel({
      ...episodeData,
      seasonId: season._id,
    });

    
    return await newEpisode.save();
  }


  // Get a specific season by ID
  async getSeasonById(seasonId: string): Promise<Season> {
    return this.seasonModel.findById(seasonId).exec();
  }

  async getEpisodesBySeasonId(seasonId: string): Promise<Episode[]> {
   
    return this.EpisodeModel.find({ seasonId }).exec();
  }
  

}
