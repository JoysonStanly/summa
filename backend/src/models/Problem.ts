import mongoose, { Document, Schema } from 'mongoose';

// ✨ Problem interface - metadata only, content stored in JSON files
export interface IProblem extends Document {
  title: string;
  slug: string;
  
  // Metadata only
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  subcategory: string; // e.g., 'fundamentals', 'logic-building', 'faq-easy'
  tags: string[];
  
  // Stats - Dynamic data that changes with user interaction
  likes: number;
  dislikes: number;
  submissionCount: number;
  acceptanceRate: number;
  
  // File reference
  contentPath: string; // Path to JSON file with problem content
  
  createdAt: Date;
  updatedAt: Date;
}

const ProblemSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a problem title'],
      trim: true,
      unique: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: [true, 'Please specify difficulty'],
    },
    category: {
      type: String,
      required: [true, 'Please specify category'],
      trim: true,
    },
    subcategory: {
      type: String,
      required: [true, 'Please specify subcategory'],
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
      min: 0,
    },
    submissionCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    acceptanceRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    contentPath: {
      type: String,
      required: [true, 'Content path is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
    // ✨ Enable virtual population for related data
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for faster queries
// slug has unique:true on field definition (creates index automatically)
ProblemSchema.index({ difficulty: 1 });
ProblemSchema.index({ category: 1 });
ProblemSchema.index({ tags: 1 });

// ✨ Virtual population for related collections
ProblemSchema.virtual('editorial', {
  ref: 'Editorial',
  localField: '_id',
  foreignField: 'problemId',
  justOne: true,
});

ProblemSchema.virtual('testCases', {
  ref: 'TestCase',
  localField: '_id',
  foreignField: 'problemId',
});

ProblemSchema.virtual('starterCode', {
  ref: 'StarterCode',
  localField: '_id',
  foreignField: 'problemId',
  justOne: true,
});

// Auto-generate slug from title before saving
ProblemSchema.pre<IProblem>('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.model<IProblem>('Problem', ProblemSchema);
