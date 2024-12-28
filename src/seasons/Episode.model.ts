import mongoose, { Schema, Document, Types } from 'mongoose';

// Define the interface for Episode
export interface Episode extends Document {
  episodeNumber: number;
  title: string;
  links :string;
  poster:string;
  duration?: string;
  releaseDate?: string;
  seasonId: Types.ObjectId; 
}

// Define the schema for Episode
export const episodeSchema = new Schema<Episode>(
  {
    episodeNumber: { type: Number, required: true },
    links: { type:String, required: true},
    poster:{type:String, required:true},
    title: { type: String, required: true },
    duration: { type: String, required: false },
    releaseDate: { type: String, required: false },
    seasonId: { type: Schema.Types.ObjectId, ref: 'Season', required: true },// Reference to Season
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  }
);

// Define the Mongoose model for Episode
const EpisodeModel = mongoose.model('Episode', episodeSchema);

export default EpisodeModel;
