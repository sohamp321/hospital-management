// ----------- ADMIN ROUTER ------------------


const express = require('express');
const Router = express.Router();
const Article=require('../models/article')
const Ambulance = require('../models/ambulance')
const Billings = require('../models/billings')
const CityHospital = require('../models/CityHospitalIntegration')
const Diagnosis = require('../models/diagnosis')
const Employee = require('../models/employee')
const homeschema = require('../models/homeschema')
const Inventory = require('../models/inventory')
const Patient = require('../models/patient')
const prescribedMedicines = require('../models/prescribedMedicines')
const prescribedTests = require('../models/prescribedTest')

const { protect } = require('../auth/middleware')

const store = require('store')



const mongoose = require('mongoose');

// delete mongoose.models.employeeSchema;
// delete mongoose.models.Ambulance;
// delete mongoose.models.Article;
// delete mongoose.models.Billing;
delete mongoose.models.CityHospitalIntegration;
// delete mongoose.models.Diagnosis;
// delete mongoose.models.Employee;
// delete mongoose.models.Registeruser;
// delete mongoose.models.Inventory;
// // delete mongoose.models.MedicalRecord;
delete mongoose.models.Patient;
// delete mongoose.models.PrescribedMedicine;
// delete mongoose.models.PrescribedTest;
// delete mongoose.models.Quiz;


Router.get('/dashboard',protect, async(req,res) =>{

    const useremail = await homeschema.findOne({email: store.get('accessToken').EmailId})

    if (useremail.role === 'admin'){
        
        const articles=await Article.find().sort({createdAt: 'desc'})
        const staffs=await homeschema.find({ role: { $in: ['receptionist', 'pharmacist', 'nurse'] } })
        const patients=await homeschema.find({role:'patient'})
        const doctors=await homeschema.find({role:'doctor'})
        const diagnosis =await Diagnosis.find({})
        const ambulances = await Ambulance.find({})
        const inventory = await Inventory.find({})
        // const billings = await Billings.find({})
        const prescribedmedicines = await prescribedMedicines.find({})
        const prescribedtests = await prescribedTests.find({})
        const cityHospital = await CityHospital.find({})
        
        res.render('./extra_pages/Admin_DashBoard',{articles:articles,no_staff:staffs.length,no_patients:patients.length,no_doctors:doctors.length,no_diagnosis:diagnosis.length, no_ambulances:ambulances.length, no_inventory:inventory.length, no_prescribedmedicines:prescribedmedicines.length, no_prescribedtests:prescribedtests.length, no_cityHospital:cityHospital.length})
    }
    else {
        res.redirect('/logout');
    }



    // try {
    //     const useremail = await homeschema.findOne({email: EmailId})

    //     if (useremail.role === 'admin'){

        //     }
        // }
        // catch{
            
            //     store.clearAll();
            //     res.redirect('/ind');
            // }
            
        })
Router.get('/createdoctor', protect, (req,res)=>{
    res.render('./extra_pages/create_doctor_account',{popup:""})
})

// Router.post('/registerdoctor',async(req,res)=>{
//     try{
//         const {
//             UserName,
//             EmailId,
//             role,
//             password,
//             cpassword
//         } = req.body;

//         if(password === cpassword){
//             const Userdata = new homeschema({
//                 name: UserName,
//                 email: EmailId,
//                 password: password,
//                 role: role
//             })

//             const useremail = await homeschema.findOne({email: EmailId})
//             if(useremail)
//             {
//                 res.render('./extra_pages/create_doctor_account',{popup: 'Email Already Exists! try another!'})
//             }
//             else 
//             {
//                 await Userdata.save()
//                 res.render('./extra_pages/create_doctor_account',{popup: 'Registered Successfully'})
//             }
//         }
//         else{
//             res.render('./extra_pages/create_doctor_account',{popup: 'Password do not match'})
//         }
//     }
//     catch(error){
//         res.render('./extra_pages/create_doctor_account',{popup: 'error in code error'})
//         console.log(error)
//     }
// })
Router.post('/registerdoctor', protect, async(req,res)=>{
        try{
            const {
                UserName,
                EmailId,
                role,
            } = req.body;
    
            if(role === 'patient'){
                const patient = new Patient({
                    PatientID: EmailId,
                    Name: UserName,
                })

                console.log(patient);
    
                const patientEmail = await Patient.findOne({PatientID: EmailId})
                const isNotEmployee = await Employee.findOne({EmployeeID: EmailId})


                if(patientEmail){
                    res.render('./extra_pages/create_doctor_account',{popup: 'Email Already Exists! try another!'})
                }

                else if (isNotEmployee){
                    res.render('./extra_pages/create_doctor_account',{popup: 'You are an Employee! Kindly enter the correct role!'})
                }

                else if (!patientEmail && !isNotEmployee){
                    await patient.save()
                    res.render('./extra_pages/create_doctor_account',{popup: ' Patient Registered Successfully'})
                }
            }
            else{
                const employee = new Employee({
                    EmployeeID: EmailId,
                    Name: UserName,
                    JobType: role
                })
    
                const employeeEmail = await Employee.findOne({EmployeeID: EmailId})
                // const isNotPatient = await Patient.findOne({PatientID: EmailId})

                console.log(employeeEmail);

                if(employeeEmail){
                    res.render('./extra_pages/create_doctor_account',{popup: 'Email Already Exists! try another!'})
                }

                // else if (isNotPatient){
                //     res.render('./extra_pages/create_doctor_account',{popup: 'You are an Patient! Kindly enter the correct role!'})
                // }

                else if (!employeeEmail){
                    await employee.save()
                    res.render('./extra_pages/create_doctor_account',{popup: 'Employee Registered Successfully'})
                }
            }
        }
        catch(error){
            res.render('./extra_pages/create_doctor_account',{popup: 'error in code error'})
            console.log(error)
        }
    })

Router.get('/admin_home', protect, (req,res)=>{
    res.render('./main_pages/home_admin.hbs')
})

Router.get('/new_announcement', protect, (req,res)=>{
    res.render('./extra_pages/new_announcement_admin')
})

Router.post('/new_announcement', protect, async(req,res)=>{

    let article = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown,
        createdBy: "admin"

    })

    try{
        article=await article.save()
        res.redirect(`/admin/dashboard`)
        {console.log('Saved')}
    }
    catch(e){
        console.log(e)
        res.render('/',{article: article})
    }
})


Router.delete('/:id',protect, async (req,res)=>{
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/admin/dashboard')
})  

Router.get('/faq',(req,res)=>{
    res.render('./extra_pages/FAQ_page_admin')
})

Router.get('/contactUs',(req,res)=>{
    res.render('./extra_pages/Contact_us_page_admin')
})

Router.get('/patientInfo', protect, async(req,res)=>{
    patients=await homeschema.find({role:'patient'})
    res.render('./extra_pages/patientInfoPage',{patients:patients})
})

Router.get('/doctorInfo',protect, async(req,res)=>{
    doctors=await homeschema.find({role:'doctor'})
    res.render('./extra_pages/doctorInfoPage')
})


Router.get('/staffInfo',protect, async(req,res)=>{
    // staff=await homeschema.find({role:'staff'})
    staff=await homeschema.find({ role: { $in: ['receptionist', 'pharmacist', 'nurse'] } })
    res.render('./extra_pages/staffInfoPage',{staff:staff})
})

// new Changes

Router.get('/DiagnosisInfo',protect, async(req,res)=>{
    diagnosis =await Diagnosis.find({})
    res.render('./extra_pages/DiagnosisInfoPage',{Diagnosis:diagnosis})
})

Router.get('/AmbulanceInfo',protect, async(req,res)=>{
    ambulances = await Ambulance.find({})
    res.render('./extra_pages/AmbulanceInfoPage',{Ambulance:ambulances})
})

Router.get('/InventoryInfo',protect, async(req,res)=>{
    inventory = await Inventory.find({})
    res.render('./extra_pages/InventoryInfoPage',{Inventory:inventory})
})

module.exports = Router;