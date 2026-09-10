import mongoose from 'mongoose';

const teacherProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    subject: {
      type: String,
      required: [true, 'Teaching subject is required'],
      trim: true,
    },
    designation: {
      type: String,
      required: [true, 'Designation / Cadre rank is required'],
      enum: [
        'Primary Teacher (PRT)',
        'TGT (Trained Graduate Teacher)',
        'PGT (Post Graduate Teacher)',
        'Lecturer',
        'Headmaster / Principal',
      ],
      default: 'TGT (Trained Graduate Teacher)',
    },
    currentSchool: {
      type: String,
      required: [true, 'Current School Name is required'],
      trim: true,
    },
    currentDistrict: {
      type: String,
      required: [true, 'Current District is required'],
      trim: true,
    },
    currentBlock: {
      type: String,
      default: '',
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    formattedAddress: {
      type: String,
      default: '',
    },
    preferredDistricts: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    yearsInService: {
      type: Number,
      default: 3,
    },
    employeeCardDoc: {
      type: String, // Multer uploaded document path
      default: '',
    },
    appointmentLetterDoc: {
      type: String, // Multer uploaded document path
      default: '',
    },
    documentStatus: {
      type: String,
      enum: ['Pending_Upload', 'Documents_Submitted', 'Flagged'],
      default: 'Documents_Submitted',
    },
    isSeekingTransfer: {
      type: Boolean,
      default: true,
    },
    isReported: {
      type: Boolean,
      default: false,
    },
    reportReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

teacherProfileSchema.index({ currentDistrict: 1, subject: 1, designation: 1 });

export const TeacherProfile = mongoose.model('TeacherProfile', teacherProfileSchema);
