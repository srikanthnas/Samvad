const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Report, initDB } = require('./src/models/Report');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL,
    'https://samvad-ten.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Initialize Database
initDB();

// Routes
app.get('/api/reports', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/reports/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findOne({ id: id });
    if (report) {
      return res.json(report);
    }
    res.status(404).json({ error: 'Report not found' });
  } catch (error) {
    console.error('Fetch detail error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/reports', async (req, res) => {
  try {
    console.log('Incoming report submission:', JSON.stringify(req.body, null, 2));
    
    // Ensure userId is present
    if (!req.body.userId) {
      console.warn('Submission failed: userId is missing');
      return res.status(400).json({ error: 'userId is required' });
    }

    // Ensure location is valid
    if (!req.body.location || typeof req.body.location !== 'object') {
      console.warn('Submission failed: invalid location object');
      return res.status(400).json({ error: 'Valid location object is required' });
    }

    const newReport = await Report.create(req.body);
    console.log('Report created successfully:', newReport.id);
    res.status(201).json(newReport);
  } catch (error) {
    console.error('CRITICAL DATABASE ERROR:', error);
    res.status(500).json({ 
      error: 'Failed to save report to database', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.patch('/api/reports/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedReport = await Report.findOneAndUpdate(
      { id: id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (updatedReport) {
      return res.json(updatedReport);
    }
    res.status(404).json({ error: 'Report not found' });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
