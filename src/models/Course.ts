import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    thumbnail: { type: String },
    price: { type: Number, required: true },
    level: { 
      type: String, 
      required: true,
      enum: ['beginner', 'intermediate', 'advanced', 'pro']
    },
    duration: { type: String }, // e.g., "12 Hours"
    lessonsCount: { type: Number, default: 0 },
    studentCount: { type: Number, default: 0 },
    isPopular: { type: Boolean, default: false },
    videoTrailerUrl: { type: String }, // Bunny Video ID
    videoType: { type: String, enum: ['bunny', 'external'], default: 'bunny' },
    externalVideoUrl: { type: String }, // YouTube/Vimeo/etc.
    learnings: [{ type: String }], // What the student will learn
    expectedResults: [{ type: String }], // Expected results
    targetAudience: [{ type: String }], // Who is this course for
    hasSupport: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    modules: [
      {
        title: { type: String, required: true },
        order: { type: Number, required: true },
        lessons: [
          {
            title: { type: String, required: true },
            bunnyVideoId: { type: String }, 
            videoType: { type: String, enum: ['bunny', 'external'], default: 'bunny' },
            externalVideoUrl: { type: String },
            duration: { type: String },
            order: { type: Number, required: true },
            dripDelay: { type: Number, default: 0 }, 
            requiresCompletion: { type: Boolean, default: false }, 
          }
        ]
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model('Course', CourseSchema);
