/*
   user collection contain name,email,password ,isverified(for email verification)
*/

const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const userSchema=mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true

        },

        email:{
            type:String,
            required:true,
            trim:true,
            unique:true
        },

        password:{
            type:String,
            required:true,
            
        },
        isVerified:{
           type:Boolean,
           default:false,
           required:true
        }
    }

)

  userSchema.pre('save', async function(next){
    
    if(this.isModified('password')){
       this.password=await bcrypt.hash(this.password,10);
    }

     next()
  })

  module.exports=mongoose.model('User',userSchema)