import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface ISocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
  resume?: string;
}

export interface IProject {
  name: string;
  description?: string;
  url?: string;
  credentials?: {
    username: string;
    password: string;
  };
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'instructor' | 'admin';
  avatar?: string;
  bio?: string;
  mobile?: string;
  countryCode?: string;
  location?: string;
  university?: string;
  educationYear?: string;
  skills: string[];
  socialLinks: ISocialLinks;
  projects: IProject[];
  coins: number;
  completedProblems: mongoose.Types.ObjectId[];
  streakData: {
    currentStreak: number;
    maxStreak: number;
    lastActiveDate: Date;
  };
  dailyCheckedProblems: Array<{
    problemId: mongoose.Types.ObjectId;
    checkedDate: Date;
  }>;
  preferences: {
    theme: 'dark' | 'light';
    notifications: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  url: { type: String },
  credentials: {
    username: { type: String },
    password: { type: String },
  },
}, { _id: false });

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: ['student', 'instructor', 'admin'],
      default: 'student',
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    mobile: {
      type: String,
      default: '',
    },
    countryCode: {
      type: String,
      default: '+91',
    },
    location: {
      type: String,
      maxlength: [100, 'Location cannot exceed 100 characters'],
      default: '',
    },
    university: {
      type: String,
      maxlength: [200, 'University name cannot exceed 200 characters'],
      default: '',
    },
    educationYear: {
      type: String,
      default: '',
    },
    skills: [{
      type: String,
      trim: true,
    }],
    socialLinks: {
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      twitter: { type: String, default: '' },
      website: { type: String, default: '' },
      resume: { type: String, default: '' },
    },
    projects: [ProjectSchema],
    coins: {
      type: Number,
      default: 0,
      min: [0, 'Coins cannot be negative'],
    },
    completedProblems: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Problem',
      },
    ],
    streakData: {
      currentStreak: {
        type: Number,
        default: 0,
        min: 0,
      },
      maxStreak: {
        type: Number,
        default: 0,
        min: 0,
      },
      lastActiveDate: {
        type: Date,
        default: null,
      },
    },
    dailyCheckedProblems: [
      {
        problemId: {
          type: Schema.Types.ObjectId,
          ref: 'Problem',
        },
        checkedDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    preferences: {
      theme: {
        type: String,
        enum: ['dark', 'light'],
        default: 'dark',
      },
      notifications: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
  // Only hash password if it has been modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare entered password with hashed password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
UserSchema.methods.generateAuthToken = function (): string {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || 'fallback-secret',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    } as jwt.SignOptions
  );
};

export default mongoose.model<IUser>('User', UserSchema);
