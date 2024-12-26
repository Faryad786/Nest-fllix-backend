import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the scraping document
export interface Scraping extends Document {
  title: string;
  links: string;
  posterimage: string;
  rating: number;
  releaseDate: number[]; // Array of years
  duration: number; // Duration in minutes
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema for the scraping document
export const scrapingSchema = new Schema<Scraping>({
  title: { type: String, required: true },
  links: { type: String, required: true },
  posterimage: { type: String, required: true },
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
