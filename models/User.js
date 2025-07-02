const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Donor', 'Receiver'],
    default: null // Not required
  },
  location: {
    type: String,
    default: '' // Not required
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema, 'Users');
