const express = require('express')
const router= express.Router()

const Ambulance = require('../models/ambulance');
const Article = require('../models/article')
const Billing = require('../models/billings');
const CityHospitalIntegration = require('../models/cityHospitalIntegration');
const Diagnosis = require('../models/diagnosis')
const Employee = require('../models/employee');
const homeschema = require('../models/homeschema')
const Inventory = require('../models/inventory');
const MedicalRecord = require('../models/medicalrecords');
const Patient = require('../models/patient')
const PrescribedMedicine = require('../models/prescribedMedicines');
const PrescribedTest = require('../models/prescribedTest');
const Quiz= require('../models/quiz')


console.log("Doctor Router");



module.exports=router