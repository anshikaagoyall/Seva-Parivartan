import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: '',
      trim: true,
    },
    firstName: {
      type: String,
      default: '',
      trim: true,
    },
    middleName: {
      type: String,
      default: '',
      trim: true,
    },
    lastName: {
      type: String,
      default: '',
      trim: true,
    },
    mobile: {
      type: String,
      default: '',
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer Not to Say'],
      default: 'Prefer Not to Say',
    },
    dob: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false,
    },
    employeeId: {
      type: String,
      default: '',
      uppercase: true,
      trim: true,
    },
    teacherCategory: {
      type: String,
      enum: [
        'Primary Teacher (PRT)',
        'TGT (Trained Graduate Teacher)',
        'PGT (Post Graduate Teacher)',
        'Lecturer',
      ],
      default: 'TGT (Trained Graduate Teacher)',
    },
    subject: {
      type: String,
      default: 'Mathematics',
    },
    schoolName: {
      type: String,
      default: '',
    },
    schoolCode: {
      type: String,
      default: '',
    },
    department: {
      type: String,
      default: 'Department of School Education',
    },
    dateOfJoining: {
      type: String,
      default: '',
    },
    yearsOfService: {
      type: Number,
      default: 0,
    },
    state: {
      type: String,
      default: 'Delhi',
    },
    district: {
      type: String,
      default: 'Central Delhi',
    },
    city: {
      type: String,
      default: 'New Delhi',
    },
    pincode: {
      type: String,
      default: '110001',
    },
    latitude: {
      type: Number,
      default: 28.6139,
    },
    longitude: {
      type: Number,
      default: 77.2090,
    },
    role: {
      type: String,
      enum: ['user', 'teacher', 'officer', 'moderator', 'admin'],
      default: 'user',
    },
    avatar: {
      type: String,
      default: '',
    },
    profile: {
      type: Object,
      default: {},
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    verificationStatus: {
      type: String,
      enum: ['Pending', 'Documents_Submitted', 'Moderator_Approved'],
      default: 'Pending',
    },
    resetPasswordToken: {
      type: String,
      default: '',
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.set('toJSON', {
  transform: function (_doc, ret) {
    delete ret.password;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpires;
    return ret;
  },
});

userSchema.virtual('fullName').get(function () {
  return `${this.firstName || ''} ${this.lastName || ''}`.trim();
});

userSchema.pre('save', function (next) {
  const safePhone = this.mobile || this.phone || '';
  const safeName = this.name || this.fullName || '';

  if (!this.name && safeName) {
    this.name = safeName;
  }

  if (!this.phone && safePhone) {
    this.phone = safePhone;
  }

  if (!this.mobile && safePhone) {
    this.mobile = safePhone;
  }

  next();
});

export const User = mongoose.model('User', userSchema);
