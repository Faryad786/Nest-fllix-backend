

import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the scraping document
export interface Season extends Document {
    title: string;
    releaseYear: number;
    poster: string; // URL or path to the season's poster
    language: string; // Language of the season
    createdAt: Date;
    updatedAt: Date;
}

// Define the schema for the scraping document
export const SeasonSchema = new Schema<Season>({
    title: { type: String, required: true },
    releaseYear: { type: Number, required: true },
    poster: { type: String, required: true }, // URL or path to the poster
    language: { type: String, required: true },
}, {
  timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});

// Define the Mongoose model with the correct typing
const SeasonModel = mongoose.model<Season>('Season', SeasonSchema);

export default SeasonModel;
