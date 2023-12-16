const mongoose = require('mongoose');
const slugify = require('slugify');

const cityHospitalIntegrationSchema = new mongoose.Schema({
  DiagnosisID: {
    type: Number,
    required: true,
    unique: true,
  },
  HospitalName: {
    type: String,
    required: true,
    // unique: true,
  },
  Extra: {
    type: String,
  }
  // slug: {
  //   type: String,
  //   unique: true,
  //   lowercase: true,
  // },
});

// cityHospitalIntegrationSchema.pre('validate', function () {
//   if (this.DiagnosisID) {
//     this.slug = slugify(this.DiagnosisID, { lower: true });
//   }
//   next();
// });

module.exports = mongoose.model('CityHospitalIntegration', cityHospitalIntegrationSchema);
