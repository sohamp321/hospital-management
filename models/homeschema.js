const mongoose = require('mongoose');
const schema = mongoose.Schema;
const slugify=require('slugify')
const bcrypt=require('bcryptjs')

const userSchema = new schema({
    name: {
        type : String,
        required: false
    },
    email: {
        type : String,
        required : true,
        unique: true
    },
    password : {
        type: String,
        required:true
    },
    role : {
        type : String,
        required:true
    },
    slug: {
        type:String,
        required: true,
        unique: true
    }
})

userSchema.pre('validate',function(){
    if(this.name){
        this.slug=slugify(this.name,{lower:true})
    }
})

userSchema.pre('save',async function(next){
    const salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
    next()
})

userSchema.methods.matchPassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

module.exports = mongoose.model('Registeruser',userSchema)