 /* 
      collection for email varification contain owner(for every user there will be unique id ) , token (otp password),
      expirydate(expirydate of otp) 
 */
 
 
 const mongoose=require('mongoose')
 const bcrypt=require('bcrypt');
const { Result } = require('express-validator');
 const emailVerificationTokenschema=new mongoose.Schema(
     {

         owner:{
           type:mongoose.Schema.Types.ObjectId,
           ref:"User",
           required:true
         },
         token:{
           type:String,
           required:true
         },
         expiryDate:{
          type:Date,
          expiryDate:3600,
          default:Date.now()
         }
     }
 )



// hashing password before saving in collection basically  kind of middleware 

 emailVerificationTokenschema.pre('save', async function(next){
    
    if(this.isModified('token')){
       this.token=await bcrypt.hash(this.token,10);
    }

     next()
  })


emailVerificationTokenschema.methods.compareToken= async function(token){
    const reult=await bcrypt.compare(this.token,token);
    return result;
}

module.exports=mongoose.model('EmailVarificationToken',emailVerificationTokenschema);