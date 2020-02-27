// All External Packages
const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));


const usermiddleware = require('../middleware/usermiddleware');
const userController = require('../controller/user.controller');
const commonMiddleware = require('../../shared/middleware/commonMiddleware');

// Login API (OK)
router.post('/login', usermiddleware.userCheckLogin, function (req, res) {
});

// Register USER API (OK)
router.post('/register', usermiddleware.validationCheck, usermiddleware.registerCheck, async function (req, res) {
    await userController.registerUser(req.body, function (data) {
        res.send(data);
    });
});

// Login Forget API AND OTP TOKEN GENRATE (OK)
router.post('/login/forget', usermiddleware.emailCheck, async function (req, res) {
    try {
        await userController.otpTokenGenerator(req.body.user_email, function (data) {
            return res.send(data);
        });
    } catch (error) {
        return res.send(data = { status: "ERROR", message: "ROUTE ERROR" });
    }
});


// Foget Password OTP Token Check API AND ChangePassword API (OK)
router.post('/forget/token/check', usermiddleware.emailCheck, usermiddleware.userNewPasswordCheckValidation, usermiddleware.otpTokenCompare, async function (req, res) {
    try {
        await userController.userForgetChangePassword(req, function (dataPC) {
            return res.send(dataPC);
        });
    } catch (error) {
    }
});


// UserChangePassword Change (OK)
router.post('/userchangepassword', commonMiddleware.verifyAuthTokenAndEmail, usermiddleware.userNewPasswordCheckValidation, async function (req, res) {
    try {
        await userController.userCheckChangePassword(req.body, req.headers, function (data) {
            if (data.status == "OK") {
                res.send(data);
            } else {
                res.send(data);
            }
        });
    } catch (error) {
    }
});


// User Profile Get Profile (OK)
router.post('/profile',commonMiddleware.verifyAuthToken, async function (req, res) {
    try {
        await userController.profileGet(req.body.user_email, function (data) {
            res.send(data);
        });
    } catch (error) {
    }
});

// Profile Updated API (OK)
router.post('/profile/updated', commonMiddleware.verifyAuthToken,async function (req, res) {
    try {
        if(req.body.user_email==undefined || req.body.user_profile==undefined){
                res.send({status:"ERROR",message:"PLEASE ENTER A DETAILS"});
        }else{
            await userController.profileUpdated(req.body.user_email, req.body.user_profile, function (data) {
                res.send(data);
            });
        }
    } catch (error) {   
    }
});

module.exports = router;