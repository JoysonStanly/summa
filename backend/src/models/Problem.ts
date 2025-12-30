import mongoose, { Document, Schema } from 'mongoose';

export interface ITestCase {
  input: string[];
  output: string;
  hidden?: boolean;
}

export interface IEditorial {
  sections: Array<{
    title: string;
    content: string;
  }>;
  solutions: {
    brute?: {
      approach: string;
      code: string;
      complexity: string;
    };
    optimal?: {
      approach: string;
      code: string;
      complexity: string;
    };
  };
  dryRunImages?: Array<{
    id: string;
    src: string;
    alt: string;
  }>;
}

export interface IProblem extends Document {
  title: string;
  slug: string;
  statement: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  testCases: ITestCase[];
  constraints: string[];
  hints: string[];
  starterCode: {
    javascript?: string;
    python?: string;
    cpp?: string;
    java?: string;
  };
  editorial?: IEditorial;
  submissionCount: number;
  acceptanceRate: number;
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
    statement: {
      type: String,
      required: [true, 'Please provide problem statement'],
      minlength: [10, 'Statement must be at least 10 characters'],
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
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    testCases: [
      {
        input: {
          type: [String],
          required: true,
        },
        output: {
          type: String,
          required: true,
        },
        hidden: {
          type: Boolean,
          default: false,
        },
      },
    ],
    constraints: [
      {
        type: String,
        trim: true,
      },
    ],
    hints: [
      {
        type: String,
        trim: true,
      },
    ],
    starterCode: {
      javascript: { type: String, default: '' },
      python: { type: String, default: '' },
      cpp: { type: String, default: '' },
      java: { type: String, default: '' },
    },
    editorial: {
      sections: [
        {
          title: String,
          content: String,
        },
      ],
      solutions: {
        brute: {
          approach: String,
          code: String,
          complexity: String,
        },
        optimal: {
          approach: String,
          code: String,
          complexity: String,
        },
      },
      dryRunImages: [
        {
          id: String,
          src: String,
          alt: String,
        },
      ],
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
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
ProblemSchema.index({ slug: 1 });
ProblemSchema.index({ difficulty: 1 });
ProblemSchema.index({ category: 1 });
ProblemSchema.index({ tags: 1 });

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
