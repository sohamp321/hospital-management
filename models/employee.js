const mongoose = require('mongoose');
const schema = mongoose.Schema;
const slugify=require('slugify')

const employeeSchema = new mongoose.Schema({
    EmployeeID: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (value) => value.endsWith('@iitj.ac.in'),
        message: 'PatientID must end with @iitj.ac.in',
      },
    },
    Name: {
      type: String,
    },
    AadharNo: {
      type: String,
      validate: {
        validator: (value) => value.length === 12,
        message: 'AadharNo must be a string of 12 digits',
      },
      // unique: true,
    },
    Contact: {
      type: Number,
    },
    Shift: {
      type: [String],
      enum: ['Morning', 'Evening', 'Night'],
    },
    JobType: {
      type: String,
    },
    Qualifications: {
      type: String,
    },
    slug: {
        type:String,
        required: true,
        unique: true
    },

});

employeeSchema.pre('validate',function(){
  if(this.EmployeeID){
      this.slug=slugify(this.EmployeeID,{lower:true})
  }
})

module.exports = mongoose.model('Employee', employeeSchema);