import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './User';
import Course from './Course';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env');
  process.exit(1);
}

async function seed() {
  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected.');

    // 1. Create Admin User
    const adminEmail = 'admin@kerotrade.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      console.log('👤 Creating admin user...');
      const hashedPassword = await bcrypt.hash('KeroAdmin2026!', 12);
      await User.create({
        name: 'Kero Trade Admin',
        email: adminEmail,
        password: hashedPassword,
        phone: '+971500000000',
        role: 'admin',
        isActive: true,
        hasAnalysisAccess: true
      });
      console.log('✅ Admin created: admin@kerotrade.com / KeroAdmin2026!');
    } else {
      console.log('ℹ️ Admin user already exists.');
    }

    // 2. Create Sample Course (Optional)
    const existingCourse = await Course.findOne({ slug: 'wave-analysis-pro' });
    if (!existingCourse) {
      console.log('📚 Creating sample course...');
      await Course.create({
        title: 'Mastering Wave Analysis',
        slug: 'wave-analysis-pro',
        description: 'Elite course for professional traders using advanced wave analysis.',
        price: 499,
        level: 'advanced',
        thumbnail: 'https://vz-db48dfa6-945.b-cdn.net/placeholder.jpg',
        isActive: true,
        modules: [
          {
            title: 'Introduction to Waves',
            order: 1,
            lessons: [
              { title: 'The Core Theory', videoId: 'sample-video-id', duration: 15, order: 1 }
            ]
          }
        ]
      });
      console.log('✅ Sample course created.');
    }

    console.log('✨ Seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
