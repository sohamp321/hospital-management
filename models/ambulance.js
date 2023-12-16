const mongoose = require('mongoose');
const schema = mongoose.Schema;
const slugify=require('slugify')

const ambulanceSchema = new mongoose.Schema({
    AmbulanceID: {
        type: Number,
        required: true,
        unique: true,
    },
    RegistrationNo: {
        type: String,
        unique: true,
    },
    DriverID: {
        type: String,
        required: true,
        validate: {
            validator: (value) => value.endsWith('@iitj.ac.in'),
            message: 'DriverID must end with @iitj.ac.in',
        },
    },
    Availability: {
        type: Boolean,
    },
});

// ambulanceSchema.pre('validate',function(){
//     if(this.AmbulanceID){
//         this.slug=slugify(this.PatientID,{lower:true})
//     }
// })


module.exports = mongoose.model('Ambulance', ambulanceSchema);
