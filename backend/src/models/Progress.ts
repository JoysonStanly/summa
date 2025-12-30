import mongoose, { Document, Schema } from 'mongoose';

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  completed: boolean;
  lastAttemptDate: Date;
  attempts: number;
  timeSpent: number;
  submissions: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ProgressSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    problemId: {
      type: Schema.Types.ObjectId,
      ref: 'Problem',
      required: [true, 'Problem ID is required'],
      index: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    lastAttemptDate: {
      type: Date,
      default: Date.now,
    },
    attempts: {
      type: Number,
      default: 0,
      min: 0,
    },
    timeSpent: {
      type: Number,
      default: 0,
      min: 0,
    },
    submissions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Submission',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique progress per user-problem
ProgressSchema.index({ userId: 1, problemId: 1 }, { unique: true });

export default mongoose.model<IProgress>('Progress', ProgressSchema);
