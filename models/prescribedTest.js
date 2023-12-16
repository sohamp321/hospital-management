const mongoose = require('mongoose');

const prescribedTestSchema = new mongoose.Schema({
  DiagnosisID: {
    type: Number,
    required: true,
    // unique: true
  },
  TestName: {
    type: String,
    required: false
  },
  Result: {
    type: String,
    required: false
  }
});


const PrescribedTest = mongoose.model('PrescribedTest', prescribedTestSchema);

module.exports = PrescribedTest;
