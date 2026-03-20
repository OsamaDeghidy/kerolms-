import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      enum: ['general', 'payment', 'social', 'contact'],
      default: 'general',
    }
  },
  { timestamps: true }
);

export default mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
