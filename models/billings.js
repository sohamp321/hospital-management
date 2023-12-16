const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  DiagnosisID: {
    type: Number,
    required: true,
    // unique: true,
    description: "'DiagnosisID' must be an integer, and is required"
  },

    ItemID: {
    type: Number,
    required: true,
    description: "'ItemID' must be an integer and is required"
    },
    Type: {
    type: String,
    // required: true,
    description: "'Type' must be a string and is required"
    },
    Quantity: {
    type: Number,
    required: true,
    description: "'Quantity' must be an integer and is required"
    },
    Price: {
    type: Number,
    required: true,
    description: "'Price' must be an integer and is required"
    },
    ExpireDate: {
    type: Date,
    required: true,
    description: "'ExpireDate' must be the Date of expiry of the item and is required"
    },
    Manufacturer: {
    type: String,
    // required: true,
    description: "'Manufacturer' must be a string and is required"
    }
});

// const Billing = mongoose.model('Billing', billingSchema);

// Billing.createIndex({ DiagnosisID: 1 }, { unique: true });
module.exports=mongoose.model('Billing',billingSchema);
