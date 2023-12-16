const mongoose = require('mongoose');

const medicalRecordsSchema = new mongoose.Schema({
  DiagnosisID: {
    type: Number,
    required: true,
    // unique: true
  },
  Diagnosis: {
    type: String,
    required: true
  },
  Treatment: {
    type: String,
    required: true
  }
});


const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordsSchema);

module.exports = MedicalRecord;
