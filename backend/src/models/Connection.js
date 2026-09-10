import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    initiator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    transferRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TransferRequest',
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'contact_shared'],
      default: 'pending',
    },
    message: {
      type: String,
      default: '',
    },
    mutualConsent: {
      initiatorAccepted: { type: Boolean, default: false },
      recipientAccepted: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

connectionSchema.index({ participants: 1, status: 1 });
connectionSchema.index({ initiator: 1, recipient: 1, status: 1 });

export const Connection = mongoose.model('Connection', connectionSchema);
