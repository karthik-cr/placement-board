const mongoose = require('mongoose');

const recruiterCallSchema = new mongoose.Schema({
  recruiterName: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  prerequisites: {
    type: [String],
    required: true
  },
  joinLink: {
    type: String,
    required: true
  }
});

const RecruiterCall = mongoose.model('RecruiterCall', recruiterCallSchema);

module.exports = RecruiterCall;
