import mongoose, { Document, Schema } from 'mongoose';

export interface IQuiz extends Document {
  title: string;
  category: 'aptitude' | 'logical' | 'verbal' | 'mock';
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  githubPath: string;
  questionCount: number;
  attempts: Array<{
    userId: mongoose.Types.ObjectId;
    score: number;
    totalQuestions: number;
    completedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const QuizSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['aptitude', 'logical', 'verbal', 'mock'],
      required: [true, 'Category is required'],
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: [true, 'Difficulty is required'],
    },
    timeLimit: {
      type: Number,
      required: [true, 'Time limit is required'],
      min: [1, 'Time limit must be at least 1 minute'],
    },
    githubPath: {
      type: String,
      required: [true, 'GitHub path is required'],
      trim: true,
    },
    questionCount: {
      type: Number,
      required: [true, 'Question count is required'],
      min: [1, 'Must have at least 1 question'],
    },
    attempts: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        score: {
          type: Number,
          required: true,
          min: 0,
        },
        totalQuestions: {
          type: Number,
          required: true,
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
QuizSchema.index({ category: 1 });
QuizSchema.index({ difficulty: 1 });

export default mongoose.model<IQuiz>('Quiz', QuizSchema);
