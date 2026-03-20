import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await dbConnect();
    
    // Clear all existing users to ensure a clean slate
    await User.deleteMany({});
    
    // Create fresh users from scratch
    const hashedPassword = await bcrypt.hash('Student123!', 10);
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    const osamaPassword = await bcrypt.hash('osama', 10);
    const newAdminPassword = await bcrypt.hash('osama5555', 10);
    
    const usersToCreate = [
      { 
        name: 'Sara Kamel', 
        email: 'sara@example.com', 
        password: hashedPassword, 
        role: 'student', 
        hasAnalysisAccess: false, 
        phone: '01112345678',
        isActive: true
      },
      { 
        name: 'Yasmine Zaki', 
        email: 'yasmine@example.com', 
        password: hashedPassword, 
        role: 'student', 
        hasAnalysisAccess: true, 
        phone: '01098765432',
        isActive: true
      },
      { 
        name: 'Admin User', 
        email: 'admin@example.com', 
        password: adminPassword, 
        role: 'admin', 
        hasAnalysisAccess: true, 
        phone: '01000000000',
        isActive: true
      },
      { 
        name: 'Osama Admin', 
        email: 'osama@gmail.com', 
        password: osamaPassword, 
        role: 'admin', 
        hasAnalysisAccess: true, 
        phone: '01000000001',
        isActive: true
      },
      { 
        name: 'Extra Admin', 
        email: 'admin@gmail.com', 
        password: newAdminPassword, 
        role: 'admin', 
        hasAnalysisAccess: true, 
        phone: '01000000002',
        isActive: true
      }
    ];

    await User.insertMany(usersToCreate);

    return NextResponse.json({ 
      success: true, 
      message: "Database radically fixed! All accounts created successfully.",
      accounts_created: [
        { email: 'sara@example.com', pass: 'Student123!' },
        { email: 'admin@example.com', pass: 'Admin123!' },
        { email: 'osama@gmail.com', pass: 'osama' },
        { email: 'admin@gmail.com', pass: 'osama5555' }
      ]
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
