// All External Packages
const express=require('express');
const router=express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));

const middleware=require('../middleware/middleware');
const userController=require('../controller/user.controller');

// Login API
router.post('/login',middleware.userCheckLogin,function(req,res){

});

// Register API
router.post('/register',middleware.validationCheck,middleware.registerCheck,function(req,res){

            const promise=new Promise(async function(resolve,reject){
                data=await userController.registerUser(req,(data)=>{
                    if(data.data.status=="OK"){
                        resolve(data);
                    }else{
                        reject(data);
                    }
                });
            });

            promise.then((data)=>{
                return res.send(data);
            },(error)=>{
                return res.send(error);
            });
});

// Login Forget API
router.post('/login/forget',middleware.emailCheck,async function(req,res){
    await userController.otpTokenGenerator(req.body.user_email,function(data){
        console.log(data);
        return  res.send(data);
    });
});

// Foget Token Change API
router.post('/forget/token/check',middleware.tokenCompare,function(req,res){
    let start=async function() {
        data=await userController.forgetPassword(req.body,async function(data){
            if(data.status=="OK"){
                await userController.userForgetChangePassword(req,function(dataPC){
                    return res.send(dataPC);
                });
            }else{
                return res.send(data);
            }
        });
    };
    start();
});

// userChangePassword
router.post('/userchangepassword',middleware.verifyTokenChange,function(req,res){
});

// Profile
router.post('/profile',middleware.verifyToken,function(req,res){
    userController.profile(req.body.user_email,function(data){
        res.send(data);
    });
});

// Profile Updated
router.put('/profile/updated',middleware.verifyToken,function(req,res){
    userController.profileUpdated(req.body.user_email,req.body.user_profile,function(data){
        res.send(data);
    });
});

module.exports=router;