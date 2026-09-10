import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { TeacherProfile } from '../models/TeacherProfile.js';
import { TransferRequest } from '../models/TransferRequest.js';

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sevaparivartan';
    console.log(`Connecting to ${mongoUri} for Seva Parivartan seeding...`);
    
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 4000 });
    console.log('Connected to MongoDB.');

    await User.deleteMany({});
    await TeacherProfile.deleteMany({});
    await TransferRequest.deleteMany({});

    console.log('Cleared existing data.');

    // Create Platform Moderator Account
    const moderator = await User.create({
      name: 'Platform Moderator',
      email: 'moderator@demo.gov.in',
      password: 'password123',
      phone: '+91 9876543210',
      employeeId: 'MOD-2026-01',
      role: 'moderator',
      verificationStatus: 'Moderator_Approved',
    });

    const officer = await User.create({
      name: 'District Education Officer',
      email: 'officer@demo.gov.in',
      password: 'password123',
      phone: '+91 9876543219',
      employeeId: 'DEO-DEL-01',
      role: 'officer',
      verificationStatus: 'Moderator_Approved',
    });

    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@demo.gov.in',
      password: 'Admin@123',
      phone: '+91 9876543220',
      employeeId: 'ADM-2026-01',
      role: 'admin',
      verificationStatus: 'Moderator_Approved',
    });

    // Create Teacher Accounts
    const teacher1 = await User.create({
      name: 'Smt. Sunita Verma',
      email: 'teacher@demo.gov.in',
      password: 'password123',
      phone: '+91 9876543211',
      employeeId: 'TCH-DEL-01',
      role: 'teacher',
      verificationStatus: 'Documents_Submitted',
    });

    const teacher2 = await User.create({
      name: 'Shri Vikramaditya Singh',
      email: 'vikram.singh@gov.in',
      password: 'password123',
      phone: '+91 9876543212',
      employeeId: 'TCH-DEL-02',
      role: 'teacher',
      verificationStatus: 'Documents_Submitted',
    });

    // Create Teacher Profiles
    await TeacherProfile.create({
      user: teacher1._id,
      subject: 'Mathematics',
      designation: 'TGT (Trained Graduate Teacher)',
      currentSchool: 'Govt. Senior Secondary School',
      currentDistrict: 'Central Delhi',
      latitude: 28.6519,
      longitude: 77.1910,
      preferredDistricts: ['South Delhi', 'East Delhi'],
      documentStatus: 'Documents_Submitted',
      yearsInService: 5,
      isSeekingTransfer: true,
    });

    await TeacherProfile.create({
      user: teacher2._id,
      subject: 'Mathematics',
      designation: 'TGT (Trained Graduate Teacher)',
      currentSchool: 'Sarvodaya Kanya Vidyalaya',
      currentDistrict: 'South Delhi',
      latitude: 28.5244,
      longitude: 77.2188,
      preferredDistricts: ['Central Delhi', 'North Delhi'],
      documentStatus: 'Documents_Submitted',
      yearsInService: 4,
      isSeekingTransfer: true,
    });

    // Create Mutual Connection Request
    await TransferRequest.create({
      teacher: teacher1._id,
      currentLocation: {
        state: 'Delhi',
        district: 'Central Delhi',
        city: 'New Delhi',
        schoolName: 'Govt. Senior Secondary School',
        pincode: '110001',
        latitude: 28.6519,
        longitude: 77.1910,
      },
      preferredLocation: {
        state: 'Delhi',
        district: 'South Delhi',
        city: 'New Delhi',
        preferredSchool: 'South Delhi Govt School',
        pincode: '110049',
        latitude: 28.5244,
        longitude: 77.2188,
      },
      subject: 'Mathematics',
      teacherCategory: 'TGT (Trained Graduate Teacher)',
      yearsOfService: 5,
      reason: 'Family',
      status: 'Contact_Shared',
      matchedPartner: teacher2._id,
      history: [
        {
          status: 'Active',
          remarks: 'Initial mutual transfer request created',
          timestamp: new Date(),
        },
        {
          status: 'Contact_Shared',
          remarks: 'Mutual contact exchange completed',
          timestamp: new Date(),
        },
      ],
    });

    console.log('Seva Parivartan Platform Database Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
