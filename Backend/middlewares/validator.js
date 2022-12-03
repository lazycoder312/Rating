
const {body,validationResult}=require('express-validator');
const userValidator=[body("name").trim().not().isEmpty().withMessage('Name is missing'),
                     body('email').normalizeEmail().isEmail().withMessage('invalid email'),
                     body('password').trim().not().isEmpty().withMessage('password missing').isLength({min:7,max:15}).withMessage('password must longer than 8 and shorter than 15')
                    ]
const validate=(req,res,next)=>{
    const error=validationResult(req)
    console.log(error)
    if(!error.isEmpty()){
        res.status(400).json({errors:error.array()[0].msg})
    }

    
    next()
}
module.exports={userValidator,validate}
