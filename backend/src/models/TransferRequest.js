import mongoose from 'mongoose';

const transferRequestSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Current Posting Details (Snapshot)
    currentLocation: {
      state: { type: String, required: true },
      district: { type: String, required: true },
      city: { type: String, required: true },
      schoolName: { type: String, required: true },
      pincode: { type: String, default: '' },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    // Preferred Transfer Location Details
    preferredLocation: {
      state: { type: String, required: true },
      district: { type: String, required: true },
      city: { type: String, required: true },
      preferredSchool: { type: String, default: '' },
      pincode: { type: String, default: '' },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    // Academic Cadre Data (For Intelligent Matching Compatibility Scoring)
    subject: {
      type: String,
      required: true,
    },
    teacherCategory: {
      type: String,
      required: true,
    },
    yearsOfService: {
      type: Number,
      default: 0,
    },
    // Search Radius in Kilometers
    searchRadiusKm: {
      type: Number,
      enum: [25, 50, 75, 100, 150],
      default: 100,
    },
    // Transfer Reason
    reason: {
      type: String,
      enum: ['Family', 'Medical', 'Marriage', 'Personal', 'Career Growth', 'Other'],
      default: 'Family',
    },
    otherReason: {
      type: String,
      default: '',
    },
    // Request Status Lifecycle
    status: {
      type: String,
      enum: ['Active', 'Matched', 'Contact_Shared', 'Cancelled', 'Mutual_Interest'],
      default: 'Active',
    },
    // Matched Partner Reference (if mutual match established)
    matchedPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    // Audit History Trail
    history: [
      {
        status: { type: String, required: true },
        remarks: { type: String, default: '' },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for active request queries & geospatial matching
transferRequestSchema.index({ teacher: 1, status: 1, updatedAt: -1 });
transferRequestSchema.index({ status: 1, subject: 1, teacherCategory: 1 });
transferRequestSchema.index({ 'preferredLocation.city': 1, 'preferredLocation.district': 1, status: 1 });
transferRequestSchema.index({ 'preferredLocation.latitude': 1, 'preferredLocation.longitude': 1 });

export const TransferRequest = mongoose.model('TransferRequest', transferRequestSchema);
