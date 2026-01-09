import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  session: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema: Schema = new Schema(
  {
    session: {
      type: Schema.Types.ObjectId,
      ref: 'Session',
      required: [true, 'Session is required'],
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    text: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
      minlength: [1, 'Question must not be empty'],
      maxlength: [1000, 'Question cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient querying
// Note: session and user have index:true on field definitions
QuestionSchema.index({ session: 1, createdAt: -1 });

export default mongoose.model<IQuestion>('Question', QuestionSchema);
