require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => res.json({ success: true, message: 'Job Portal API is running', data: null }));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/candidates', require('./routes/candidateRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/interviews', require('./routes/interviewRoutes'));
app.use('/api/saved-jobs', require('./routes/savedJobRoutes'));
app.use('/api/job-alerts', require('./routes/jobAlertRoutes'));
app.use('/api/offers', require('./routes/offerRoutes'));
app.use('/api/recruiter', require('./routes/recruiterRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found', errorCode: 'NOT_FOUND' }));
app.use(errorHandler);

const port = process.env.PORT || 5000;
if (require.main === module) {
  connectDB().then(() => app.listen(port, () => console.log(`Server running on port ${port}`))).catch(error => {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  });
}

module.exports = app;
