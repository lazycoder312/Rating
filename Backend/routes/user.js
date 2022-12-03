const express=require('express');
const {userValidator,validate} = require('../middlewares/validator');

const {create,verifiedOtp,resendEmailVerificationToken} = require('./../controller/user')



const router=express.Router();

router.post("/create",userValidator,validate,create)
router.post("/verify-email", verifiedOtp)
router.post("/resent-email-verification-token",resendEmailVerificationToken)


module.exports=router
