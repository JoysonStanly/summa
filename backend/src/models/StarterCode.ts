import mongoose, { Document, Schema } from 'mongoose';

// StarterCode interface - metadata only, content stored in JSON files
export interface IStarterCode extends Document {
  problemId: mongoose.Types.ObjectId;
  
  availableLanguages: string[]; // ['javascript', 'python', 'cpp', 'java']
  defaultLanguage: string;
  
  version: number;
  lastModified: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const StarterCodeSchema: Schema = new Schema(
  {
    problemId: {
      type: Schema.Types.ObjectId,
      ref: 'Problem',
      required: [true, 'Problem ID is required'],
      unique: true, // One starter code set per problem
      index: true,
    },
    availableLanguages: [
      {
        type: String,
        enum: ['javascript', 'python', 'cpp', 'java'],
      },
    ],
    defaultLanguage: {
      type: String,
      enum: ['javascript', 'python', 'cpp', 'java'],
      default: 'javascript',
    },
    version: {
      type: Number,
      default: 1,
      min: 1,
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// problemId has unique:true on field definition (creates index automatically)

export default mongoose.model<IStarterCode>('StarterCode', StarterCodeSchema);
