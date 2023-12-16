const mongoose = require('mongoose');
const schema = mongoose.Schema;
const slugify=require('slugify')

const patientSchema = new mongoose.Schema({
    PatientID: {
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
    RollNo: {
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
    slug: {
        type:String,
        required: true,
        unique: true
    }
});

patientSchema.pre('validate',function(){
    if(this.PatientID){
        this.slug=slugify(this.PatientID,{lower:true})
    }
})

module.exports = mongoose.model('Patient', patientSchema);
