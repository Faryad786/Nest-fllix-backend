import { Controller, Get, Param, Query, Res, HttpStatus, HttpException, Delete } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Response } from 'express';

@Controller('api/tmdb')
export class MoviesController {
  constructor(private readonly tmdbService: MoviesService) {}

  @Get('movie/:movieId')
  async getMovieDetails(@Param('movieId') movieId: string, @Res() res: Response) {
    try {
      const data = await this.tmdbService.getMovieDetails(movieId);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get('popular')
  async getPopularMovies(@Query('page') page: number, @Res() res: Response) {
    try {
      const data = await this.tmdbService.getPopularMovies(page || 1);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get('top-rated')
  async getTopRatedMovies(@Query('page') page: number, @Res() res: Response) {
    try {
      const data = await this.tmdbService.getTopRatedMovies(page || 1);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get('movie/:movieId/videos')
  async getMovieVideos(@Param('movieId') movieId: string, @Res() res: Response) {
    try {
      const data = await this.tmdbService.getMovieTrailer(movieId);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
  @Get('genres')
  async getGenres() {
    return this.tmdbService.getGenres();
  }

  // Endpoint to get movies by genre
  @Get('genre/:id')
  async getMoviesByGenre(@Param('id') id: number) {
    return this.tmdbService.getMoviesByGenre(id);
  }

  @Get("all")
  async getAllMovies(@Query('page') page: number) {
    return this.tmdbService.getAllMovies(page);
  }

  @Get('search')
  async searchMoviesByTitle(@Query('title') title: string) {
    if (!title) {
      throw new HttpException(
        'Title query parameter is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const movies = await this.tmdbService.searchMoviesByTitle(title);
      return movies;
    } catch (error) {
      throw new HttpException(
        'Failed to search movies',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('punjabi-movies')
  async getPunjabiMovies(
    @Query('page') page = 1, // Default page is 1
    @Query('limit') limit = 10, // Default limit is 10
  ) {
    const result = await this.tmdbService.moviesByLanguage(page, limit);

    if (!result || result.length === 0) {
      throw new HttpException('Punjabi movies not found', HttpStatus.NOT_FOUND);
    }

    return { message: 'Punjabi movies retrieved successfully', result };
  }
  @Get('hindi-movies')
  async getHindiMovies(
    @Query('page') page = 1, // Default page is 1
    @Query('limit') limit = 30, // Default limit is 10
  ) {
    const result = await this.tmdbService.HindiByLanguage(page, limit);

    if (!result || result.length === 0) {
      throw new HttpException('Punjabi movies not found', HttpStatus.NOT_FOUND);
    }

    return { message: 'Punjabi movies retrieved successfully', result };
  }


  }

