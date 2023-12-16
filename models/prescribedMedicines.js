const mongoose = require('mongoose');

const prescribedMedicineSchema = new mongoose.Schema({
  DiagnosisID: {
    type: Number,
    required: true,
    // unique: true
  },
  MedicineName: {
    type: String,
    required: true
  },
  Contents: {
    type: String,
    required: true
  },
  Dosage: {
    type: String,
    required: true
  }
});



const PrescribedMedicine = mongoose.model('PrescribedMedicine', prescribedMedicineSchema);

module.exports = PrescribedMedicine;
