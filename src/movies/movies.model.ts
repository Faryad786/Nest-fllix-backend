import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the scraping document
export interface Scraping extends Document {
  _id: string;
  title: string;
  links: string;
  posterImage: string;
  rating: number;
  releaseDate: number[]; // Array of years
  duration: number; // Duration in minutes
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema for the scraping document
export const scrapingSchema = new Schema<Scraping>({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  links: { type: String, required: true },
  posterImage: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 10 },
  releaseDate: { type: [Number], required: true },
  duration: { type: Number, required: true },
  language: { type: String, required: true },
}, {
  timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});

// Define the Mongoose model with the correct typing
const ScrapingModel = mongoose.model<Scraping>('Scraping', scrapingSchema);

export default ScrapingModel;
