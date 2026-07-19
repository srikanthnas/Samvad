const mongoose = require('mongoose');
require('dotenv').config();

// Use MONGO_URI from env, fallback to a local MongoDB instance
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/samvad';

console.log("MONGO_URI =", process.env.MONGO_URI);
console.log("Using URI =", mongoUri);

const ReportSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  priority: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'Submitted'
  },
  photoUrl: {
    type: String,
    default: null
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, required: true }
  },
  userId: {
    type: String,
    required: true
  },
  staffComment: {
    type: String,
    default: null
  },
  resolutionPhotoUrl: {
    type: String,
    default: null
  },
  assignedStaffId: {
    type: String,
    default: null
  }
}, {
  timestamps: true,
  id: false, // Prevent clash between Mongoose's built-in id virtual and our custom string id field
  toJSON: {
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Replicate indexes from original Sequelize model
ReportSchema.index({ userId: 1 });
ReportSchema.index({ status: 1 });

const Report = mongoose.models.Report || mongoose.model('Report', ReportSchema);

const initDB = async () => {
  try {
    await mongoose.connect(mongoUri, {
      family: 4
    });
    console.log('MongoDB connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to MongoDB:', error);
  }
};

module.exports = { mongoose, Report, initDB };
