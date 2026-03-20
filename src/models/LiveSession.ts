import mongoose from 'mongoose';

const LiveSessionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    meetingUrl: { type: String }, // Zoom, Google Meet, etc.
    platform: { type: String, enum: ['zoom', 'google_meet', 'youtube_live', 'other'], default: 'zoom' },
    isPremium: { type: Boolean, default: true }, // Restricted to subscribers?
    targetGroups: [{ type: String }], // Optional: restrict to specific user groups
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, // Optional: link to a specific course
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.LiveSession || mongoose.model('LiveSession', LiveSessionSchema);
