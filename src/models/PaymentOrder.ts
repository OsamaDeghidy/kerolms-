import mongoose from 'mongoose';

const PaymentOrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['usdt', 'bank_transfer', 'vodafone_cash'], required: true },
    status: { 
      type: String, 
      enum: ['pending_payment', 'proof_uploaded', 'under_review', 'activated', 'rejected'], 
      default: 'pending_payment' 
    },
    proofUrl: { type: String }, // Bunny Storage URL for uploaded receipt
    networkOrBankDetails: { type: String }, // E.g., TRC20 for USDT or Bank details entered by user
    transactionId: { type: String }, // Optional, manual entry from user
    activatedAt: { type: Date },
    adminNotes: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.PaymentOrder || mongoose.model('PaymentOrder', PaymentOrderSchema);
