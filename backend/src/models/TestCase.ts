import mongoose, { Document, Schema } from 'mongoose';

// TestCase interface - metadata only, content stored in JSON files
export interface ITestCase extends Document {
  problemId: mongoose.Types.ObjectId;
  
  testCaseNumber: number; // 1, 2, 3...
  isHidden: boolean;
  isEnabled: boolean;
  weight: number; // For weighted scoring
  
  order: number; // Display order
  createdAt: Date;
  updatedAt: Date;
}

const TestCaseSchema: Schema = new Schema(
  {
    problemId: {
      type: Schema.Types.ObjectId,
      ref: 'Problem',
      required: [true, 'Problem ID is required'],
      index: true,
    },
    testCaseNumber: {
      type: Number,
      required: [true, 'Test case number is required'],
      min: 1,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
    weight: {
      type: Number,
      default: 10,
      min: 0,
    },
    order: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient querying
// Note: problemId has index:true on field definition
TestCaseSchema.index({ problemId: 1, order: 1 });
TestCaseSchema.index({ problemId: 1, isHidden: 1 });
TestCaseSchema.index({ problemId: 1, testCaseNumber: 1 }, { unique: true });

export default mongoose.model<ITestCase>('TestCase', TestCaseSchema);
