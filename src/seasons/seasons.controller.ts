import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { SeasonsService } from './seasons.service';

@Controller('api/seasons')
export class SeasonsController {
  constructor(private readonly seasonsService: SeasonsService) {}

  @Post()
  async createSeason(@Body() body: { title: string; releaseYear: number;language: string; poster: string}) {
    return this.seasonsService.createSeason(body.title, body.releaseYear,body.language, body.poster);
  }

  @Get()
  async getAllSeasons() {
    return this.seasonsService.getAllSeasons();
  }

  @Post(':id/episodes') // Route to add an episode
  async addEpisode(
    @Param('id') seasonId: string,
    @Body() episode: { episodeNumber: number; title: string; duration: string; releaseDate: string; links: string },
  ) {
    return this.seasonsService.addEpisode(seasonId, episode);
  }

  @Get(':id')
  async getSeasonById(@Param('id') seasonId: string) {
    return this.seasonsService.getSeasonById(seasonId);
  }

  @Get(':id/episodes') // Updated route for clarity
  async getEpisodesBySeasonId(@Param('id') seasonId: string) {
    return this.seasonsService.getEpisodesBySeasonId(seasonId);
  }

}
