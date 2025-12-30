import mongoose, { Document, Schema } from 'mongoose';

export interface ISubject extends Document {
  title: string;
  description: string;
  icon?: string;
  order: number;
  githubPath: string;
  modules: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IModule extends Document {
  title: string;
  subjectId: mongoose.Types.ObjectId;
  description?: string;
  order: number;
  githubPath: string;
  topics: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ITopic extends Document {
  title: string;
  moduleId: mongoose.Types.ObjectId;
  description?: string;
  contentType: 'video' | 'slides' | 'notes';
  order: number;
  githubPath: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Subject title is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    icon: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    githubPath: {
      type: String,
      required: [true, 'GitHub path is required'],
      trim: true,
    },
    modules: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Module',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ModuleSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Module title is required'],
      trim: true,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject ID is required'],
      index: true,
    },
    description: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    githubPath: {
      type: String,
      required: [true, 'GitHub path is required'],
      trim: true,
    },
    topics: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Topic',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const TopicSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Topic title is required'],
      trim: true,
    },
    moduleId: {
      type: Schema.Types.ObjectId,
      ref: 'Module',
      required: [true, 'Module ID is required'],
      index: true,
    },
    description: {
      type: String,
      default: '',
    },
    contentType: {
      type: String,
      enum: ['video', 'slides', 'notes'],
      required: [true, 'Content type is required'],
    },
    order: {
      type: Number,
      default: 0,
    },
    githubPath: {
      type: String,
      required: [true, 'GitHub path is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Subject = mongoose.model<ISubject>('Subject', SubjectSchema);
export const Module = mongoose.model<IModule>('Module', ModuleSchema);
export const Topic = mongoose.model<ITopic>('Topic', TopicSchema);
