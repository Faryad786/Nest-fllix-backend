import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WatchHistory } from './watchHistroy.model';
import { Scraping } from '../movies/movies.model';

@Injectable()
export class WatchHistoryService {
  constructor(
    @InjectModel('WatchHistory') private watchHistoryModel: Model<WatchHistory>,
    @InjectModel('Scraping') private scrapingModel: Model<Scraping>,
  ) {}

  // Create or update watch history
  async trackWatchTime(movieId: string, watchTime: number): Promise<WatchHistory | null> {
    if (watchTime < 5) {
      // Ignore if watch time is less than 5 minutes
      return null;
    }

    // Find or create watch history
    const history = await this.watchHistoryModel.findOneAndUpdate(
      { movieId },
      { $set: { watchTime }, watchedAt: new Date() },
      { new: true, upsert: true }
    );

    return history;
  }

  // Fetch recommendations based on the watched movie
  async getRecommendations(language: string): Promise<Scraping[]> {
    return this.scrapingModel
      .find({ language }).sort({createdAt:-1})
      .limit(20)
      .exec();
  }
}
