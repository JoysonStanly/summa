import mongoose, { Document, Schema } from 'mongoose';

export interface IBugReport extends Document {
  title: string;
  description: string;
  reportedBy: mongoose.Types.ObjectId;
  problemId?: mongoose.Types.ObjectId;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  assignedTo?: mongoose.Types.ObjectId;
  screenshots: string[];
  createdAt: Date;
  updatedAt: Date;
}

const BugReportSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Bug title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [10, 'Description must be at least 10 characters'],
    },
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reporter is required'],
      index: true,
    },
    problemId: {
      type: Schema.Types.ObjectId,
      ref: 'Problem',
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'closed'],
      default: 'open',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    screenshots: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
BugReportSchema.index({ status: 1 });
BugReportSchema.index({ priority: 1 });
// reportedBy has index:true on field definition (no need to duplicate)

export default mongoose.model<IBugReport>('BugReport', BugReportSchema);
