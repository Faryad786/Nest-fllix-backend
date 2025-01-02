import mongoose, { Schema, Document, Types } from 'mongoose';

export interface WatchHistory extends Document {
  movieId: Types.ObjectId;
  watchTime: number; // Duration in minutes
  watchedAt: Date;
}

export const watchHistorySchema = new Schema<WatchHistory>(
  {
    movieId: { type: Schema.Types.ObjectId, ref: 'Scraping', required: true },
    watchTime: { type: Number, default: 0 }, // Tracks the duration watched in minutes
    watchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const WatchHistoryModel = mongoose.model<WatchHistory>('WatchHistory', watchHistorySchema);
export default WatchHistoryModel;
