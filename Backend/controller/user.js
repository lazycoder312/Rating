
 /*
         contain all the code required for user creation like user sign in , email verification 
 
 */
const User = require('../models/user')
const nodemailer=require('nodemailer')
const userEmailVerification=require('../models/emailVarificationToken');
const { isValidObjectId } = require('mongoose');
const emailVarificationToken = require('../models/emailVarificationToken');
 const create = async (req, res) => {
   
  const { name, email, password } = req.body

  const oldUser= await User.findOne({email})

  if(oldUser){
     return res.status(401).json({error:"user already exists"})
  }

  const newUser = new User({ name, email, password })

  let otp="";
  for(let i=0;i<6;i++){
    const randomval=Math.round(Math.random()*9);
    otp+=randomval;
  }


    //storing newuser id as id for unique owner and otp for token 


  const newVerification=new userEmailVerification(
    {
    owner:newUser._id,
    token:otp
    }
  )

   await newVerification.save();


  var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "587846ed3b876e",
      pass: "673eae027ff186"
    }
  });

   //sending otp to user for email verification in front end
  transport.sendMail({
    from:"verification@gmail.com",
    to:newUser.email,
    subject:"Email vrification",
    html:`<p> your otp for verification is ${otp}<\p>`
  })
  await newUser.save()

  res.status(201).json({ message:"please verify your email otp has been send to your email account"  })
};


 /* otp verification for email:
  whenever user will sign in they will receive verification token for mail they will put that  otp so to verify weather that
  actual otp is stored in emailVerificationToken 
 */
 const verifiedOtp= async (req,res)=>{
     const {user_id,otp}=req.body
     if(!isValidObjectId(user_id)){
      res.json({error:"invalid user"})
     }

     const user= await User.findById(user_id);

     if(!user){
      res.json({error:"user not found"})
     }

     if(user.isVerified){
      res.json({error:"Already verified"})
     }

     const token=await emailVarificationToken.findOne({owner:user_id})

     if(!token){
        req.jon({error:"token not found"})
     }
      
     //  we are sending actual otp enteredd by user which will match by hashedd otp using custom method
     const result=token.comparetoken(otp);
     if(!result) res.json({error:"enter valid otp"})

     User.isVerified=true;
     //saving collection after user verified is updatd in  it
     await User.save()
    
     // as user is verified no need to save email verification token for that user so deleted it from database
     await emailVarificationToken.findByIdAndDelete(token.user_id)

     var transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "587846ed3b876e",
        pass: "673eae027ff186"
      }
    });
  
     //sending welcome to front after verification succesfully
    transport.sendMail({
      from:"verification@gmail.com",
      to:newUser.email,
      subject:"Welcome to our website",
      html:"<h1>welcome to our website</h1>"
    })

     res.json({message:"user is verified successfully"})
    
     
 }

 //usr is already loggedin but they can't use some features which only vrified user can use so for that purpose again verification is necessary
 resendEmailVerificationToken= async (req,res)=>{
         const {userId}=req.body;
         
         const user=await User.findById(userId);
         if(!user) return res.json({error:"user not found"});

         if(user.isVerified) return res.json({error:"This email id is already verified"})

         const alreadyHasToken=await emailVarificationToken.findOne({
          owner:userId
         })

         if(alreadyHasToken) return res.json({error:"pls try after 1 hr token is not expired yet"})
         let otp="";
  for(let i=0;i<6;i++){
    const randomval=Math.round(Math.random()*9);
    otp+=randomval;
  }


    //storing newuser id as id for unique owner and otp for token 


  const newVerification=new userEmailVerification(
    {
    owner:user._id,
    token:otp
    }
  )

   await newVerification.save();


  var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "587846ed3b876e",
      pass: "673eae027ff186"
    }
  });

   //sending otp to user for email verification in front end
  transport.sendMail({
    from:"verification@gmail.com",
    to:user.email,
    subject:"Email vrification",
    html:`<p> your otp for verification is ${otp}<\p>`
  })
  await user.save()
res.send({message:"otp has been send on your email account"})

 }


module.exports={create,verifiedOtp,resendEmailVerificationToken}