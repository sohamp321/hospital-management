const mongoose = require('mongoose');

const diagnosisSchema = new mongoose.Schema({
  DiagnosisID: {
    type: Number,
    required: true,
    unique: true
  },
  PatientID: {
    type: String,
    required: true,
    // unique: true,
    validate: {
      validator: (value) => value.endsWith('@iitj.ac.in'),
      message: 'PatientID must end with @iitj.ac.in',
    },
  },
  DoctorID: {
    type: String,
    required: true,
    // unique: true,
    validate: {
      validator: (value) => value.endsWith('@iitj.ac.in'),
      message: 'DoctorID must end with @iitj.ac.in',
    },
  },
  NurseID: {
    type: String,
    required: true,
    // unique: true,
    validate: {
      validator: (value) => value.endsWith('@iitj.ac.in'),
      message: 'NurseID must end with @iitj.ac.in',
    },
  },
  DateTime: {
    type: Date,
    required: true,
    unique: true
  },
  // slug: {
  //   type: String,
  //   lowercase: true,
  //   required: true,
  //   unique: true
  // }
});

// diagnosisSchema.pre('save', function (next) {
//   const diagnosis = this;

//   if (!diagnosis.slug) {
//     diagnosis.slug = diagnosis.PatientID + '-' + diagnosis.DateTime.toISOString();
//   }

//   next();
// });

const Diagnosis = mongoose.model('Diagnosis', diagnosisSchema);

module.exports = Diagnosis;
