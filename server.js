// --------------- MAIN SERVER ------------------------


const express = require('express')
const mongoose = require('mongoose')
const hbs = require('hbs')
const app=express()
const articleRouter=require('./routes/articles')
const override=require('method-override')
const path  = require('path')
const adminRouter=require('./routes/adminRouter')
const homeRouter=require('./routes/homerouter')
const bodyParser = require('body-parser');

mongoose.set('strictQuery', true);
// mongoose.connect(`mongodb://0.0.0.0:27017/HospitalTest`,{
//     useNewUrlParser: true, useUnifiedTopology: true
//   })

mongoose.connect(`mongodb+srv://admin:admin@cluster1.ij8lsgu.mongodb.net/?retryWrites=true&w=majority`,{
    useNewUrlParser: true, useUnifiedTopology: true
  })


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});



app.set('view engine','ejs')
app.use(express.urlencoded({extended: false}))
app.use(override('_method'))
app.use('/articles',articleRouter)



app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/' , homeRouter);   
app.use('/admin',adminRouter)

app.use(express.static('public'));


app.listen(3030)