import { IsString, IsNotEmpty, IsNumber, IsArray, IsOptional, Min, Max } from 'class-validator';

export class CreateMovieDto {
    @IsString()
    @IsNotEmpty()
    title: string;
  
    @IsString()
    @IsNotEmpty()
    links: string;
  
    @IsString()
    @IsNotEmpty()
    posterimage: string;
  
    @IsNumber()
    @Min(0)
    @Max(10)
    rating: number;
  
    @IsArray()
    @IsNumber({}, { each: true })
    releaseDate: number[];
  
    @IsNumber()
    @IsNotEmpty()
    duration: number;
  
    @IsString()
    @IsNotEmpty()
    language: string;
  }
  
