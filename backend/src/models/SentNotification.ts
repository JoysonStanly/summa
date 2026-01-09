import mongoose, { Document, Schema } from 'mongoose';

export interface ISentNotification extends Document {
  title: string;
  message: string;
  audience: 'all' | 'particular';
  recipientUser?: string;
  recipientUserId?: mongoose.Types.ObjectId;
  sentBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SentNotificationSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    audience: {
      type: String,
      enum: ['all', 'particular'],
      required: [true, 'Audience is required'],
    },
    recipientUser: {
      type: String,
      default: null,
    },
    recipientUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    sentBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sent by is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
SentNotificationSchema.index({ createdAt: -1 });
SentNotificationSchema.index({ audience: 1 });

export default mongoose.model<ISentNotification>('SentNotification', SentNotificationSchema);
