const express = require('express');
const Router = express.Router();
const { default: mongoose } = require('mongoose');
const generateToken = require('../auth/generateToken')
const store = require('store')
const { protect } = require('../auth/middleware')

const app = express();
app.use(express.urlencoded({ extended: true }));

const Ambulance = require('../models/ambulance');
// const article = require('../models/article');
const Article = require('../models/article')
const Billings = require('../models/billings');
const CityHospitalIntegration = require('../models/cityHospitalIntegration');
const Diagnosis = require('../models/diagnosis')
const Employee = require('../models/employee');
const homeschema = require('../models/homeschema')
const Inventory = require('../models/inventory');
const MedicalRecord = require('../models/medicalrecords');
const Patient = require('../models/patient')
const PrescribedMedicine = require('../models/prescribedMedicines');
const PrescribedTest = require('../models/prescribedTest');
const Quiz= require('../models/quiz');
// const Inventory = require('../models/inventory');

// delete mongoose.models.Ambulance;
// delete mongoose.models.Article;
// delete mongoose.models.Billing;
// delete mongoose.models.CityHospitalIntegration;
// delete mongoose.models.Diagnosis;
// delete mongoose.models.Employee;
// delete mongoose.models.Registeruser;
// delete mongoose.models.Inventory;
// // delete mongoose.models.MedicalRecord;
delete mongoose.models.Patient;
// delete mongoose.models.PrescribedMedicine;
// delete mongoose.models.PrescribedTest;
// delete mongoose.models.Quiz;





Router.get('/logout', (req, res) => {
    //Clear local storage and redirect to ind
    store.clearAll();

    console.log("Logged out");

    res.redirect('/ind');
});

Router.get('/ind',(req,res) =>{
    res.render('./main_pages/logreg.hbs',{title : "tarun raj singh", name: "jai ho", password: '', email: ''})
    
})
Router.get('',(req,res)=>{
    res.render('./main_pages/main.hbs',{title : "tarun raj singh", name: "jai ho", password: 'jaiho jaiho', email: ''})
})

Router.get('/faq',(req,res)=>{
    res.render('./extra_pages/FAQ_page')
})

Router.get('/contact',(req,res)=>{
    res.render('./extra_pages/Contact_us_page')
})

Router.get('/register',(req,res) =>{
    res.render('./main_pages/register.hbs',{title : "tarun raj singh", name: "jai ho", password: '', email: ''})
})

// Login Case for a Patient

Router.get('/:slug', protect, async(req,res)=>{
    if(req.params.slug!=''){

        const result=await homeschema.findOne({slug:req.params.slug})
        
        if(result.role === 'patient' ){
            
            const quizes=await Quiz.find({Active:true,Started:true}).sort({createdAt: 'desc'})
            const articles=await Article.find().sort({createdAt:'desc'})
            
            // const Diagnoses = await Diagnosis.find({PatientID: store.get('accessToken').EmailId})
            const Diagnoses = await Diagnosis.find({PatientID: result.email})
            const archived_quizes=await Quiz.find({Active:false})
            res.render('./main_pages/dashboard1',{name:result.name , result : result,quizes:quizes,archived_quizes:archived_quizes,articles:articles, Diagnosis: Diagnoses})
        }
        else{
            res.redirect('/logout');
        }
    }
})

Router.get('/patient/:slug/home',protect, async (req,res)=>{

    
    
    res.render('./main_pages/home.hbs',{slug:req.params.slug})
})



// Login case for a doctor

Router.get('/doctor/:slug',protect,async(req,res)=>{
    if(req.params.slug!=''){
        const result=await homeschema.findOne({slug:req.params.slug})
        if(result.role === 'doctor'){
            const articles=await Article.find({createdBy:result.name})
            // const articles=await Article.find({createdBy: { $in: [result.name, 'admin'] }})
           
            const admin_articles=await Article.find({createdBy:'admin'})

            const Diagnoses = await Diagnosis.find({DoctorID: store.get('accessToken').EmailId})
            console.log(Diagnoses)

            res.render('./extra_pages/doctor_dashboard',{articles: articles , result : result,admin_articles: admin_articles, Diagnosis: Diagnoses })
        }
    }
    else{
        res.redirect('/logout');
    }
})

Router.get('/doctor/:slug/home',protect,async(req,res)=>{
    const token=store.get('accessToken').token

    res.render('./main_pages/home_doctor.hbs',{slug:req.params.slug})
})




// Login case for a staff

Router.get('/staff/:slug',protect,async(req,res)=>{
    if(req.params.slug!=''){
        const result=await homeschema.findOne({slug:req.params.slug})
        if(result){
            const articles=await Article.find({createdBy:result.name})
            const admin_articles=await Article.find({createdBy:'admin'})
            const quizes=await Quiz.find({createdBy:result.name}).sort({createdAt: 'desc'})
            const Diagnoses = await Diagnosis.find({})
            res.render('./extra_pages/staff_dashboard',{articles: articles , result : result,quizes:quizes,admin_articles: admin_articles, Diagnosis: Diagnoses })
        }
    }
})


// Login case for a receptionist

Router.get('/receptionist/:slug', protect, async(req,res)=>{
    if(req.params.slug!=''){
        const result=await homeschema.findOne({slug:req.params.slug})
        if(result){
            const articles=await Article.find({})
            const admin_articles=await Article.find({createdBy:'admin'})
            const quizes=await Quiz.find({createdBy:result.name}).sort({createdAt: 'desc'})
            const Diagnoses = await Diagnosis.find({})
            res.render('./extra_pages/receptionist_dashboard',{articles: articles , result : result,quizes:quizes,admin_articles: admin_articles, Diagnosis: Diagnoses })
        }
    }
})

// // Login case for a pharmacist
// Router.get('/pharmacist/:slug',async(req,res)=>{
//     if(req.params.slug!=''){
//         const result=await homeschema.findOne({slug:req.params.slug})
//         if(result){
//             const articles=await Article.find({})
//             const admin_articles=await Article.find({createdBy:'admin'})
//             const quizes=await Quiz.find({createdBy:result.name}).sort({createdAt: 'desc'})
//             const Inventory = await Inventory.find({})
//             res.render('./extra_pages/pharmacist_dashboard',{articles: articles , result : result,quizes:quizes,admin_articles: admin_articles, Inventory: Inventory })
//         }
//     }
// })




// //For Pharmacist
// Router.get('/pharmacist/:slug/home',protect,async(req,res)=>{
//     // ! Change This
//     res.render('./main_pages/home_staff.hbs',{slug:req.params.slug})
// })

Router.get('/pharmacist/:slug',protect,async(req,res)=>{
    if(req.params.slug!=''){
        const result=await homeschema.findOne({slug:req.params.slug})
        
        

        if(result.role === 'pharmacist'){
            const articles=await Article.find({})
            const admin_articles=await Article.find({createdBy:'admin'})
            const quizes=await Quiz.find({createdBy:result.name}).sort({createdAt: 'desc'})
            const Items = await Inventory.find({})
            res.render('./extra_pages/pharmacist_dashboard',{articles: articles , result : result,quizes:quizes,admin_articles: admin_articles, inventoryItems: Items })
        }
        else{
            res.redirect('/logout');
        }
    }
})

Router.get('/staff/:slug/home',protect,async(req,res)=>{
    res.render('./main_pages/home_staff.hbs',{slug:req.params.slug})
})




// REGISTRATION //

//Checks for the role during signup
Router.post('/registeruser_next',async(req,res)=>{
    try{
        const { EmailId, role } = req.body;

        const useremail = await homeschema.findOne({email: EmailId})

        if(useremail){
            res.render('./main_pages/logreg.hbs',{title : "", name: "", password: '', email: 'You are already registered! Please Login!'})
        }

        if(role === "patient"){
            res.render('./main_pages/signup_patient.hbs',{role : role, name: "", password: 'Enter Patient Details for :', email: EmailId})
        }
        else if (role === "employee"){
            res.render('./main_pages/signup_doctor.hbs',{role : role, name: "", password: 'Enter Employee Details for :', email: EmailId})
        }
    }
    catch(error){
        res.render('./main_pages/logreg.hbs',{title : "error in code", name: "jai ho", password: '', email: ''})
    }
})

//  Registers Patients
Router.post('/registeruser-patient',async(req,res)=>{
    
    try{
        const {
            UserName,
            RollNo,
            email,
            role,
            aadhar,
            Contact_no,
            password,
            cpassword
        } = req.body;

        if(password === cpassword){

            const userData = new homeschema({
                name : UserName,
                email  : email,
                password : password,
                role : role
            })
            
            console.log(userData);
            // const useremail = await homeschema.findOne({email: EmailId})

            // if(useremail)
            // {
            //     res.render('./main_pages/logreg.hbs',{title : "", name: "", password: '', email: 'Email Already Exists! try another!'})
            // }
            // else 
            // {
                const Saveduser = await userData.save()

                res.render('./main_pages/logreg.hbs',{title : "", name: "", password: 'Registered Successfully', email: ''})
            // }

            const existingPatient = await Patient.findOne({ PatientID: email });

            console.log(existingPatient);
            if(existingPatient){

                existingPatient.PatientID = email;
                existingPatient.Name = UserName;
                existingPatient.RollNo = RollNo;
                existingPatient.AadharNo = aadhar;
                existingPatient.Contact = Contact_no;
                
                existingPatient = await existingPatient.save();
            }
        }
        else{
            res.render('./main_pages/logreg.hbs',{title : "", name: "", password: 'Password do not match', email: ''})
        }
    }
    catch(error){
        res.render('./main_pages/logreg.hbs',{title : "error in code", name: "jai ho", password: '', email: ''})
    }
})

//Registers Employees
Router.post('/registeruser-employee',async(req,res)=>{
    
    try{
        const {
            UserName,
            aadhar,
            email,
            Contact_no,
            Job_title,
            Qualification,
            password,
            cpassword
        } = req.body;

        if(password === cpassword){
            const Userdata = new homeschema({
                name: UserName,
                email: email,
                password: password,
                role:Job_title
            })

            console.log(Userdata);

            console.log("Yahan Tak Ayaa..?");

            // const useremail = await homeschema.findOne({email: EmailId})

            // console.log(useremail);

            // if(useremail)
            // {
            //     res.render('./main_pages/logreg.hbs',{title : "", name: "", password: '', email: 'Email Already Exists! try another!'})
            // }
            // else 
            // {
                console.log("Kya yahan aya..?");
                // await Userdata.save()
                const savedUser = await Userdata.save();

                console.log("Yahan Tak Ayaa..?.. Kya yahan Chala..");


                res.render('./main_pages/logreg.hbs',{title : "", name: "", password: 'Registered Successfully', email: ''})
            // }

            const existingEmployee = await Employee.findOne({ EmployeeID: email });

            if(existingEmployee){

                existingEmployee.EmployeeID = email;
                existingEmployee.Name = UserName;
                existingEmployee.AadharNo = aadhar;
                existingEmployee.Contact = Contact_no;
                existingEmployee.JobType = Job_title;
                existingEmployee.Qualification = Qualification;
                
                existingEmployee = await existingEmployee.save();
            }
        }
        else{
            res.render('./main_pages/logreg.hbs',{title : "", name: "", password: 'Password do not match', email: ''})
        }
    }
    catch(error){
        res.render('./main_pages/logreg.hbs',{title : "error in code", name: "jai ho", password: '', email: ''})
    }
})

//  Log IN // 
Router.post('/login', async(req,res)=>{
    const quizes=await Quiz.find().sort({createdAt: 'desc'})
    const {
        EmailId,
        UserName,
        password,
        // role,
    } = req.body;

    homeschema.findOne({email:EmailId})

    .then(async (result)=>{

        if((EmailId === result.email && await (result.matchPassword(password))) || (EmailId===result.email && result.password === password))
            
            {   console.log("Password Matched")

                const token = generateToken(EmailId);

                // console.log(token);
                
                const data = {
                                "EmailId" : EmailId,
                                "role" : homeschema.findOne({email:EmailId}).role,
                                "token" : token 
                            }
                // Store the token in local storage
                console.log("Debugging statement for login")
                store.set('accessToken', data); 

                console.log(store.get('accessToken'));
                
                console.log(store.get('accessToken').EmailId);
                
                // * To Retrieve the token
                // const storedToken = localStorage.getItem('accessToken');


                if(result.role == "doctor")
                    {
                        res.redirect(`doctor/${result.slug}`)
                    }

                else if(result.role == "staff")
                    {
                        res.redirect(`staff/${result.slug}`)
                    }
                
                else if(result.role=='admin'){
                    res.redirect(`/admin/dashboard`)
                }
                else if(result.role=='receptionist'){
                    res.redirect(`/receptionist/${result.slug}`)
                }
                else if(result.role=='pharmacist'){
                    res.redirect(`/pharmacist/${result.slug}`)
                }
                else if (result.role == "patient")
                    {
                        res.redirect(`/${result.slug}`)
                    }
                    else{
                        res.render('./main_pages/logreg.hbs',{title : "", name: "", password: `You are not a ${role}`, email: ''})

                    }
            }
        else{
            if(password != result.password)
                {
                    res.render('./main_pages/logreg.hbs',{title : "", name: "", password: 'wrong password', email: ''})
                }
            console.log(err);
        }
    })

    // ? Change the error
    .catch((err)=>{
        console.log(err);
        res.render('./main_pages/logreg.hbs',{title : "tarun raj singh", name: "jai ho", password: 'User does not exist', email: ''})
    })
   
})

Router.delete("/doctor/:te_slug/:id/announcement_delete",protect,async(req,res)=>{
    await Article.findByIdAndDelete(req.params.id)
    res.redirect(`/doctor/${req.params.te_slug}`)
})

Router.get("/doctor/:slug/contact",protect,(req,res)=>{
    res.render("./extra_pages/Contact_us_page_doctor",{slug:req.params.slug})
})

Router.get("/doctor/:slug/faq",protect,(req,res)=>{
    res.render("./extra_pages/FAQ_page_doctor",{slug:req.params.slug})
})



Router.get("/patient/:slug/contact",protect,(req,res)=>{
    res.render("./extra_pages/Contact_us_page_patient",{slug:req.params.slug})
})

Router.get("/patient/:slug/faq",protect,(req,res)=>{
    res.render("./extra_pages/FAQ_page_patient",{slug:req.params.slug})
})



Router.get("/staff/:slug/contact",protect, (req,res)=>{
    res.render("./extra_pages/Contact_us_page_staff",{slug:req.params.slug})
})

Router.get("/staff/:slug/faq",protect, (req,res)=>{
    res.render("./extra_pages/FAQ_page_staff",{slug:req.params.slug})
})





//Add diagnosis by Receptionist
Router.post("/diagnosis/receptionist/:slug/new",protect, async(req,res)=>{
    const user = await homeschema.findOne({slug:req.params.slug})
    console.log(req.body);
    const currentDate = new Date();
    let diagnosis = new Diagnosis({
        DiagnosisID: req.body.dia_ID,
        PatientID: req.body.Patient_ID,
        DoctorID: req.body.Doctor_ID,
        NurseID: req.body.Nurse_ID,
        // DateTime: "2023-01-02"
        DateTime: currentDate
    });
    console.log(diagnosis);

    try{
        diagnosis = await diagnosis.save();
        res.redirect(`/receptionist/${user.slug}`);
        {
            console.log("Diagnosis Added");
        }
    }
    catch(e){
        console.log(e);
        res.redirect(`/receptionist/${user.slug}`);
    }
})






// Add Medical Record and Treatment by Doctor
Router.post('/diagnosis/doctor/:slug/treatment', async (req, res) => {
    console.log("Kya yahan aya?")
    console.log(req.body);

    // const user=await homeschema.findOne({slug:req.params.slug})
    //Please Create the Medical Record Schema

    console.log(req.body);
    let record = new MedicalRecord({
        DiagnosisID: req.body.Diagnosis_ID,
        Diagnosis: req.body.Diagnosis_details,
        Treatment: req.body.Treatment
    })
    try {
      record = await record.save();
      res.redirect(`/doctor/${req.params.slug}`);
      {
        console.log("Saved Record Successfully");
      }
    } catch (e) {
      console.log(e);
      res.redirect(`/doctor/${req.params.slug}`);
    }
  });




// Add medicine
Router.post('/diagnosis/doctor/:slug/medicine', async (req, res) => {
console.log("Kya yahan aya?")
console.log(req.body);

// const user=await homeschema.findOne({slug:req.params.slug})
//Please Create the Medical Record Schema
console.log("Debugging Medicine Add");
console.log("Req Body");
console.log(req.body);
let medicine = new PrescribedMedicine({
    DiagnosisID: req.body.Diagnosis_ID,
    MedicineName: req.body.Medicine_name,
    Contents        : req.body.Medicine_Content,    
    Dosage: req.body.Medicine_dosage
})
try {
    medicine = await medicine.save();
    res.redirect(`/doctor/${req.params.slug}`);
    {
    console.log("Saved Record Successfully");
    }
} catch (e) {
    console.log(e);
    res.redirect(`/doctor/${req.params.slug}`);
}
});
Router.post('/diagnosis/doctor/:slug/tests', async (req, res) => {
// console.log("Kya yahan aya?")
// console.log(req.body);

// const user=await homeschema.findOne({slug:req.params.slug})
//Please Create the Medical Record Schema
console.log("Debugging Test");
console.log("Req Body");
console.log(req.body);
let test = new PrescribedTest({
    DiagnosisID: req.body.Diagnosis_ID,
    TestName: req.body.Test_name,
    Result        : req.body.Result,    
})
try {
    test = await test.save();
    res.redirect(`/doctor/${req.params.slug}`);
    {
    console.log("Saved Test Record Successfully");
    
    }
} catch (e) {
    console.log(e);
    res.redirect(`/doctor/${req.params.slug}`);
}
});

Router.post('/diagnosis/pharmacist/:slug/bill', async (req, res) => {
// console.log("Kya yahan aya?")
// console.log(req.body);

    // const user=await homeschema.findOne({slug:req.params.slug})
    //Please Create the Medical Record Schema
    console.log("Debugging Billings");
    console.log("Req Body");
    console.log(req.body);

    let bill = new Billings({
        DiagnosisID: req.body.dia_ID,
        ItemID: req.body.item_ID,
        Type: req.body.type,    
        Quantity: req.body.quantity,   
        Price: req.body.price,  
        ExpireDate: req.body.expiredate,   
        Manufacturer: req.body.Manufacturer,   
})
try {
    bill = await bill.save();
    res.redirect(`/pharmacist/${req.params.slug}`);
    {
    console.log("Saved Test Record Successfully");
    
    }
} catch (e) {
    console.log(e);
    res.redirect(`/pharmacist/${req.params.slug}`);
}
});


Router.post('/diagnosis/pharmacist/:slug/item', async (req, res) => {
// console.log("Kya yahan aya?")
// console.log(req.body);

    const user=await homeschema.findOne({slug:req.params.slug})
    //Please Create the Medical Record Schema
    console.log("Debugging Item");
    console.log("Req Body");
    console.log(req.body);

    const itemExists = await Inventory.findOne({ ItemID: req.body.item_ID });

    if(itemExists){

        itemExists.ItemID = req.body.item_ID;
        itemExists.Name = req.body.name;
        itemExists.Type = req.body.type;
        itemExists.Quantity = req.body.quantity;
        itemExists.Price = req.body.price;
        itemExists.ExpireDate = req.body.expiredate;
        itemExists.Manufacturer = req.body.Manufacturer;
        
        updatedItem = await itemExists.save();

        res.redirect(`/pharmacist/${req.params.slug}`);

    }else{
        let item = new Inventory({
            // DiagnosisID: req.body.dia_ID,
            ItemID: req.body.item_ID,
            Name: req.body.name,
            Type: req.body.type,    
            Quantity: req.body.quantity,   
            Price: req.body.price,  
            ExpireDate: req.body.expiredate,   
            Manufacturer: req.body.Manufacturer,   
        })
        try {
            item = await item.save();
            res.redirect(`/pharmacist/${req.params.slug}`);
            {
            console.log("Saved Item Record Successfully");
            
            }
        } catch (e) {
            console.log(e);
            res.redirect(`/pharmacist/${req.params.slug}`);
        }
    }

    // let item = new Inventory({
    //     // DiagnosisID: req.body.dia_ID,
    //     ItemID: req.body.item_ID,
    //     Name: req.body.name,
    //     Type: req.body.type,    
    //     Quantity: req.body.quantity,   
    //     Price: req.body.price,  
    //     ExpireDate: req.body.expiredate,   
    //     Manufacturer: req.body.Manufacturer,   
    // })
    // try {
    //     item = await item.save();
    //     res.redirect(`/pharmacist/${req.params.slug}`);
    //     {
    //     console.log("Saved Item Record Successfully");
        
    //     }
    // } catch (e) {
    //     console.log(e);
    //     res.redirect(`/pharmacist/${req.params.slug}`);
    // }
});



// New
// Router.get('/patient/diagnosisInfo',async(req,res)=>{
//     // patients=await homeschema.find({role:'patient'})
//     medical_records = await MedicalRecord.find({DiagnosisID: req.body.Diagnosis_ID})
//     res.render('./extra_pages/Patient_diagnosis_details',{patients:patients})
// })


Router.get('/patient/diagnosisInfo/:diagnosisID', async(req,res) => {
    const diagnosisID = req.params.diagnosisID;
    // const slug = await homeschema.findOne({slug: store.get('accessToken').EmailId});

    const slugData = await homeschema.findOne({ email: store.get('accessToken').EmailId });

    // const slugData = await homeschema.findOne({ email: store.get('accessToken').EmailId }, { slug: 1 });
    const slug = slugData ? slugData.slug : null;

    // const slug = "Hello";
    
    console.log("For backwards from Patient");

    console.log(slugData.slug);
    
    console.log(slug);
    console.log(store.get('accessToken').EmailId);
    
    // const slug = await homeschema.findOne({slug: store.get('accessToken').EmailId})

    medical_records = await MedicalRecord.find({DiagnosisID: diagnosisID})
    prescribed_medicines = await PrescribedMedicine.find({DiagnosisID: diagnosisID})
    prescribed_tests = await PrescribedTest.find({DiagnosisID: diagnosisID})
    res.render('./extra_pages/Patient_diagnosis_details',{Medical_record:medical_records, Prescribed_medicines:prescribed_medicines, Prescribed_tests:prescribed_tests, my_slug:slug})
    
});


module.exports = Router;
