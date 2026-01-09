import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  userId: mongoose.Types.ObjectId;
  content: string;
  likes: mongoose.Types.ObjectId[];
  replies: mongoose.Types.ObjectId[];
  isAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDiscussion extends Document {
  problemId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  category: 'question' | 'solution' | 'discussion';
  tags: string[];
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  views: number;
  isSolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      minlength: [1, 'Content cannot be empty'],
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    isAccepted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const DiscussionSchema: Schema = new Schema(
  {
    problemId: {
      type: Schema.Types.ObjectId,
      ref: 'Problem',
      required: [true, 'Problem ID is required'],
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['question', 'solution', 'discussion'],
      required: [true, 'Category is required'],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    isSolved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
DiscussionSchema.index({ problemId: 1, createdAt: -1 });
// userId has index:true on field definition (no need to duplicate)
DiscussionSchema.index({ category: 1 });

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);
export const Discussion = mongoose.model<IDiscussion>('Discussion', DiscussionSchema);
