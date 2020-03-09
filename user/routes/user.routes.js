// All External Packages
const express = require('express');
const router = express.Router();

const usermiddleware = require('../middleware/usermiddleware');
const userController = require('../controller/user.controller');
const commonMiddleware = require('../../shared/middleware/commonMiddleware');

const fileUpload=require('express-fileupload');


router.use(fileUpload());

// Login API (OK)
router.post('/login', commonMiddleware.bodyCheck, usermiddleware.userCheckLogin, function (req, res) {
});

// Register USER API (OK)
router.post('/register', commonMiddleware.bodyCheck, usermiddleware.validationCheck, usermiddleware.registerCheck, async function (req, res) {
    await userController.registerUser(req.body, function (data) {
        res.send(data);
    });
});

// Login Forget API AND OTP TOKEN GENRATE (OK)
router.post('/login/forget', commonMiddleware.bodyCheck, usermiddleware.emailCheck, async function (req, res) {
    try {
        await userController.otpTokenGenerator(req.body.user_email, function (data) {
            return res.status(200).send(data);
        });
    } catch (error) {
        return res.status(500).send(data = { status: "ERROR", message: "ROUTE ERROR" });
    }
});


// Foget Password OTP Token Check API AND ChangePassword API (OK)
router.post('/forget/token/check', commonMiddleware.bodyCheck, usermiddleware.emailCheck, usermiddleware.userNewPasswordCheckValidation, usermiddleware.otpTokenCompare, async function (req, res) {
    try {
        await userController.userForgetChangePassword(req, function (data) {
            return res.status(200).send(data);
        });
    } catch (error) {
    }
});


// UserChangePassword Change (OK)
router.post('/userchangepassword', commonMiddleware.bodyCheck, commonMiddleware.verifyAuthTokenAndEmail, usermiddleware.userNewPasswordCheckValidation, async function (req, res) {
    try {
        await userController.userCheckChangePassword(req.body, req.headers, function (data) {
            if (data.status == "OK") {
                res.status(200).send(data);
            } else {
                res.status(400).send(data);
            }
        });
    } catch (error) {
    }
});


// User Profile Get Profile (OK)
router.post('/profile', commonMiddleware.bodyCheck, commonMiddleware.verifyAuthToken, commonMiddleware.verifyAuthTokenAndEmail, async function (req, res) {
    try {
        await userController.profileGet(req.body.user_email, function (data) {
            res.send(data);
        });
    } catch (error) {
    }
});

// Profile Updated API (OK)
router.post('/profile/updated', commonMiddleware.verifyAuthToken,commonMiddleware.bodyCheck, commonMiddleware.verifyAuthTokenAndEmail, async function (req, res) {
    try {
        if(!req.files){
            return res.send(data={status:"ERROR",message:"PLEASE SEND A IMAGE"});
        }else{
            await userController.profileUpdated(req.files.user_profile,req.body.user_email,req.files.user_profile.name,req.files.user_profile.size, function (data) {
                res.send(data);
            });
        }
    } catch (error) {
        console.log(error);
        res.send("CALLED ERROR");
    }
});

router.use((error,req,res,next)=>{
    if(error){
        res.status(500).send(data={status:"ERROR",message:error.message});
    }
});

module.exports = router;