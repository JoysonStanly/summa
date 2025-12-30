import mongoose, { Document, Schema } from 'mongoose';

export interface ISession extends Document {
  title: string;
  description: string;
  instructor: mongoose.Types.ObjectId;
  category: string;
  date: Date;
  timeRange: string;
  duration: number;
  thumbnailUrl?: string;
  meetLink: string;
  videoRecordingUrl?: string;
  participants: mongoose.Types.ObjectId[];
  maxParticipants: number;
  tags: string[];
  isLive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Session title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Session description is required'],
      trim: true,
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Instructor is required'],
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Session date is required'],
    },
    timeRange: {
      type: String,
      required: [true, 'Time range is required'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    meetLink: {
      type: String,
      required: [true, 'Google Meet link is required'],
      trim: true,
    },
    videoRecordingUrl: {
      type: String,
      default: '',
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    maxParticipants: {
      type: Number,
      default: 100,
      min: [1, 'Max participants must be at least 1'],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isLive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
SessionSchema.index({ date: 1 });
SessionSchema.index({ instructor: 1 });
SessionSchema.index({ category: 1 });

export default mongoose.model<ISession>('Session', SessionSchema);
