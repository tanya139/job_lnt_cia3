require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Company = require('./models/Company');
const JobPosting = require('./models/JobPosting');

async function seed() {
  await connectDB();
  await Promise.all([User.deleteMany({}), Company.deleteMany({}), JobPosting.deleteMany({})]);
  const password = value => bcrypt.hash(value, 10);
  const admin = await User.create({ name: 'Demo Admin', email: 'admin@example.com', password: await password('Admin@123'), role: 'Admin' });
  const recruiter = await User.create({ name: 'Demo Recruiter', email: 'recruiter@example.com', password: await password('Recruiter@123'), role: 'Recruiter' });
  await User.create({ name: 'Demo Candidate', email: 'candidate@example.com', password: await password('Candidate@123'), role: 'Candidate' });
  const company = await Company.create({ name: 'Christ Tech Solutions', description: 'Sample company for demonstration', website: 'https://example.com', location: 'Bangalore', recruiterIds: [recruiter._id] });
  await JobPosting.create([
    { companyId: company._id, recruiterId: recruiter._id, title: 'Junior Node.js Developer', description: 'Build and maintain web APIs.', skills: ['Node.js', 'MongoDB', 'JavaScript'], location: 'Bangalore', salaryMin: 300000, salaryMax: 500000, experienceLevel: 'Fresher', status: 'Open' },
    { companyId: company._id, recruiterId: recruiter._id, title: 'Frontend Intern', description: 'Create simple responsive web pages.', skills: ['HTML', 'CSS', 'JavaScript'], location: 'Remote', salaryMin: 150000, salaryMax: 250000, experienceLevel: 'Fresher', status: 'Open' }
  ]);
  console.log('Seed data created', admin.email);
  process.exit(0);
}
seed().catch(error => { console.error(error); process.exit(1); });
