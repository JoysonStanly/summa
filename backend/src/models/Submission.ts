import mongoose, { Document, Schema } from 'mongoose';

export interface ITestResult {
  passed: boolean;
  input?: string;
  expected?: string;
  actual?: string;
  error?: string;
  executionTime?: number;
}

export interface ISubmission extends Document {
  userId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  code: string;
  language: string;
  status: 'accepted' | 'rejected' | 'error' | 'timeout';
  testResults: ITestResult[];
  timeTaken: number;
  memory: number;
  attempts: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema: Schema = new Schema(
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
    code: {
      type: String,
      required: [true, 'Code is required'],
      minlength: [1, 'Code cannot be empty'],
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
      enum: ['javascript', 'python', 'cpp', 'java'],
    },
    status: {
      type: String,
      enum: ['accepted', 'rejected', 'error', 'timeout'],
      required: true,
    },
    testResults: [
      {
        passed: {
          type: Boolean,
          required: true,
        },
        input: String,
        expected: String,
        actual: String,
        error: String,
        executionTime: Number,
      },
    ],
    timeTaken: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    memory: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    attempts: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common queries
// Note: userId and problemId have index:true on field definitions
SubmissionSchema.index({ userId: 1, problemId: 1 });
SubmissionSchema.index({ problemId: 1, status: 1 });
SubmissionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<ISubmission>('Submission', SubmissionSchema);
