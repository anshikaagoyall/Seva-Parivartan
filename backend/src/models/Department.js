import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    district: {
      type: String,
      required: true,
    },
    headOfficerName: {
      type: String,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    officeLatitude: {
      type: Number,
      required: true,
    },
    officeLongitude: {
      type: Number,
      required: true,
    },
    totalTeachersRegistered: {
      type: Number,
      default: 0,
    },
    totalTransfersProcessed: {
      type: Number,
      default: 0,
    },
    activeVacancies: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Department = mongoose.model('Department', departmentSchema);
