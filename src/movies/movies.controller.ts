import { Controller, Get, Param, Query, Res, HttpStatus, HttpException, Delete, Body, HttpCode, Post } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Response } from 'express';
import { Scraping } from './movies.model';
import { CreateMovieDto } from './movies.dto';

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


@Get('movie/:movieId/videos')
  async getMovieTrailerWall(@Param('movieId') movieId: string, @Res() res: Response) {
    try {
      const data = await this.tmdbService.getMovieTrailerWall(movieId);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get('all-trailers')
  async getAllMoviesWithTrailers(@Res() res: Response) {
    try {
      const movies = await this.tmdbService.wallmovies();

      const moviesWithTrailers = await Promise.all(
        movies.results.map(async (movie) => {
          const trailer = await this.tmdbService.getMovieTrailerWall(movie.id);
          return trailer ? { ...movie, trailer } : null;
        })
      );

      const filteredMovies = moviesWithTrailers.filter((movie) => movie !== null);

      return res.status(HttpStatus.OK).json(filteredMovies);
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
    // @Query('page') page , // Default page is 1
    // @Query('limit') limit , // Default limit is 10
  ) {
    const result = await this.tmdbService.moviesByLanguage();

    if (!result || result.length === 0) {
      throw new HttpException('Punjabi movies not found', HttpStatus.NOT_FOUND);
    }

    return { message: 'Punjabi movies retrieved successfully', result };
  }
  @Get('hindi-movies')
  async getHindiMovies(
    // @Query('page') page , // Default page is 1
    // @Query('limit') limit, // Default limit is 10
  ) {
    const result = await this.tmdbService.HindiByLanguage();

    if (!result || result.length === 0) {
      throw new HttpException('Hindi movies not found', HttpStatus.NOT_FOUND);
    }

    return { message: 'Hindi movies retrieved successfully', result };
  }

   
  @Delete('/delete')
  async deleteData(@Res() res: Response) {
    try {
      await this.tmdbService.deleteMovies();
      return res
        .status(HttpStatus.OK)
        .json({ message: 'All movies deleted successfully' });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to delete movies', error: error.message });
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createMovie(@Body() createMovieDto: CreateMovieDto): Promise<Scraping> {
    return await this.tmdbService.createMovie(createMovieDto);
  }


  @Get('english-movies')
  async getEnglishMovies(
    // @Query('page') page , // Default page is 1
    // @Query('limit') limit, // Default limit is 10
  ) {
    const result = await this.tmdbService.engetall();

    if (!result || result.length === 0) {
      throw new HttpException('Hindi movies not found', HttpStatus.NOT_FOUND);
    }

    return { message: 'Hindi movies retrieved successfully', result };
  }

  @Get(':movieId/recommendations')
  async getRecommendations(
    @Param('movieId') movieId: string,
    @Query('language') language: string = 'en-US',
    @Query('page') page: number = 1,
  ) {
    return await this.tmdbService.getRecommendations(movieId, language, page);
  }

  @Delete('delete-today')
  @HttpCode(200)
  async deleteTodayRecords() {
    const result = await this.tmdbService.deleteTodayRecords();
    return { message: `${result.deletedCount} records deleted successfully.` };
  }

  
}


