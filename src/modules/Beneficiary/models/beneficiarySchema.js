const mongoose = require('mongoose');

const beneficiarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cnic: {
    type: String,
    required: true,
    unique: true,
  },
  contact: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  },
  remarks: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Beneficiary', beneficiarySchema);