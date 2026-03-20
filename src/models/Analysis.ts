import mongoose from 'mongoose';

const AnalysisSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    symbol: { type: String, default: 'BTC/USD' }, // BTC/USD, Gold, etc.
    direction: { type: String, enum: ['buy', 'sell'], default: 'buy' },
    entryPrice: { type: String },
    targetPrice: { type: String }, // Can be multiple separated by comma
    stopLoss: { type: String },
    chartUrl: { type: String }, // TradingView screenshot or Bunny image
    videoUrl: { type: String },
    isLive: { type: Boolean, default: false },
    type: { 
      type: String, 
      enum: ['crypto', 'forex', 'stocks', 'general'],
      default: 'crypto'
    },
    status: { type: String, enum: ['active', 'win', 'loss', 'canceled'], default: 'active' },
    isActive: { type: Boolean, default: true },
    scheduledAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Analysis || mongoose.model('Analysis', AnalysisSchema);
