import { Injectable, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import axios from 'axios';

import { Scraping } from './movies.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMovieDto } from './movies.dto';

@Injectable()
export class MoviesService {
  private readonly BASE_URL = 'https://api.themoviedb.org/3';
  private readonly API_TOKEN =
    'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZDM2YzgxNzQ5NThlNDljOTVhNzcwMTNmZDljZTYxZSIsIm5iZiI6MTczMjg4NzI3MC4xOTg0MjM5LCJzdWIiOiI2NzQ5YmU1YzBkYTUyZTI3N2VmNDFhNzYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.rE5utyQAZlo443FzUegCql5RsfNjgFZM5o9BLivr8HE';
constructor(
    @InjectModel('scraping') private readonly scrapingModel: Model<Scraping>,
){}
  // Helper function to fetch data from TMDb
  private async fetchFromTmdb(endpoint: string, params: any = {}): Promise<any> {
    try {
      const response = await axios.get(`${this.BASE_URL}${endpoint}`, {
        params,
        headers: {
          Authorization: this.API_TOKEN,
          accept: 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching from TMDb:', error.message);
      throw new HttpException(
        error.response?.data || 'Failed to fetch data from TMDb',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get Movie Details
  async getMovieDetails(movieId: string): Promise<any> {
    return this.fetchFromTmdb(`/movie/${movieId}`);
  }

  // Get Popular Movies
  async getPopularMovies(page: number = 1): Promise<any> {
    return this.fetchFromTmdb('/movie/popular', { page });
  }

  // Get Top Rated Movies
  async getTopRatedMovies(page: number = 1): Promise<any> {
    return this.fetchFromTmdb('/movie/top_rated', { page });
  }


  async deleteMovies(): Promise<void> {
    try {
      // Delete all movies with language "Hindi"
      const deleteResult = await this.scrapingModel.deleteMany({ language: "Hindi" });
      
      if (deleteResult.deletedCount === 0) {
        throw new HttpException('No movies found with the specified criteria', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete movies',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  


  // Get Movie Videos
  async getMovieTrailer(movieId: string): Promise<any> {
    try {
      // Fetch movie details from TMDB to get the title
      const movieDetailsResponse = await axios.get(`${this.BASE_URL}/movie/${movieId}`, {
        headers: {
          Authorization: this.API_TOKEN,
          accept: 'application/json',
        },
      });
  
      const movieDetails = movieDetailsResponse.data;
      const title = movieDetails.title;
  
      // Check if the movie exists in the local database by title
      const localMovie = await this.scrapingModel.findOne({
        title: new RegExp(title, 'i'), // Case-insensitive partial match
      });
  
      if (localMovie) {
        // Return the local movie data
        return {
          source: 'local',
          movie: localMovie,
        };
      }
  
      // Fetch movie trailers from TMDB by movieId
      const response = await axios.get(`${this.BASE_URL}/movie/${movieId}/videos`, {
        headers: {
          Authorization: this.API_TOKEN,
          accept: 'application/json',
        },
      });
  
      const trailers = response.data.results.filter(
        (video) => video.type === 'Trailer' && video.site === 'YouTube' && video.official
      );
  
      if (trailers.length > 0) {
        const links = `https://www.youtube.com/embed/${trailers[0].key}`;
        return {
          source: 'tmdb',
          trailer: { links},
        };
      }
  
      // Default fallback trailer link if no official trailer is found
      return {
        source: 'tmdb',
        trailer: { link: 'https://www.youtube.com/embed/8p1rLKzYgfQ' },
      };
    } catch (error) {
      throw new HttpException(
        'Failed to fetch movie trailer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  
  // Get Genres
  async getGenres(): Promise<any> {
    return this.fetchFromTmdb('/genre/movie/list', { language: 'en' });
  }

  // Get Movies by Genre
  async getMoviesByGenre(genreId: number): Promise<any> {
    return this.fetchFromTmdb('/discover/movie', {
      with_genres: genreId,
      language: 'en',
      page: 1, // You can adjust the page parameter if needed
    });
  }
  async getAllMovies(page: number = 1): Promise<any> {
    try {
      const response = await axios.get(`${this.BASE_URL}/discover/movie`, {
        params: {
          page,
        },
        headers: {
          Authorization: this.API_TOKEN,
          accept: 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch movies from TMDb',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async searchMoviesByTitle(title: string): Promise<any> {
    if (!title) {
      throw new HttpException(
        'Title query parameter is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      // First search in the local database
      const localMovies = await this.scrapingModel.find({
        title: new RegExp(title, 'i'), // Case-insensitive partial match
      });

      if (localMovies.length > 0) {
        return { movies: localMovies };
      }

      // If not found, search in TMDB
      const response = await axios.get(`${this.BASE_URL}/search/movie`, {
        params: {
          query: title,
        },
        headers: {
          accept: 'application/json',
          Authorization: this.API_TOKEN,
        },
      });

      return { source: 'tmdb', movies: response.data.results };
    } catch (error) {
      throw new HttpException(
        'Failed to search movies from TMDb',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async moviesByLanguage() {
   

    return this.scrapingModel
      .find({ language: 'Urdu' })  
      .exec();
  }

  async HindiByLanguage() {

    return this.scrapingModel
      .find({ language: 'Punjabi' })  
      .exec();
  }

  async createMovie(createMovieDto: CreateMovieDto): Promise<Scraping> {
    try {
      console.log(CreateMovieDto);
      
      const movie = new this.scrapingModel(createMovieDto);
      return await movie.save();
    } catch (error) {
      throw new BadRequestException('Failed to create movie');
    }
  }


}
