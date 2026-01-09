import mongoose, { Document, Schema } from 'mongoose';

// Editorial interface - metadata only, content stored in JSON files
export interface IEditorial extends Document {
  problemId: mongoose.Types.ObjectId;
  
  // Metadata flags
  hasEditorial: boolean;
  hasVideo: boolean;
  videoUrl?: string;
  videoProvider?: 'youtube' | 'vimeo';
  videoDuration?: number; // seconds
  
  // Version tracking
  version: number;
  lastModified: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const EditorialSchema: Schema = new Schema(
  {
    problemId: {
      type: Schema.Types.ObjectId,
      ref: 'Problem',
      required: [true, 'Problem ID is required'],
      unique: true, // One editorial per problem
      index: true,
    },
    hasEditorial: {
      type: Boolean,
      default: false,
    },
    hasVideo: {
      type: Boolean,
      default: false,
    },
    videoUrl: {
      type: String,
      trim: true,
    },
    videoProvider: {
      type: String,
      enum: ['youtube', 'vimeo'],
    },
    videoDuration: {
      type: Number,
      min: 0,
    },
    version: {
      type: Number,
      default: 1,
      min: 1,
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// problemId has unique:true on field definition (creates index automatically)

export default mongoose.model<IEditorial>('Editorial', EditorialSchema);
