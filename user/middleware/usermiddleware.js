const commonFunction = require('../../shared/commonFunction/commonFunction');
const userController = require('../controller/user.controller');
const emailExistence = require('email-existence');

usermiddleware = {};

// User Check IS User Valid Or Not Login API
usermiddleware.userCheckLogin = async function (req, res, next) {
    try {
        await userController.userCheckLogin(req.body, function (data) {
            res.status(200).send(data);
            next();
        });
    } catch (error) {
    }
}

// Register User Check ALL Validation IS Full Filled
usermiddleware.validationCheck = async function (req, res, next) {
    try {
        await commonFunction.validationUser(req.body, function (data) {
            errorCount = Object.keys(data).length;
            if (errorCount == 0) {
                next();
            } else {
                return res.status(400).send(data);
            }
        });
    } catch (error) {
    }
}

// Register Check To Email ID And Phone Number Is Duplicate
usermiddleware.registerCheck = async function (req, res, next) {
    try {
        await emailExistence.check(req.body.user_email,async (error, response) => {
            if (response) {
                await userController.emailOrPhoneExists(req.body.user_email, req.body.user_phone, function (data) {
                    if (data.status == "OK") {
                        next();
                    } else {
                        res.status(400).send(data);
                    }
                });
            } else {
                res.status(400).send(data = { status: "ERROR", message: "EMAIL ID IS NOT EXISTS" });
            }
        });
    } catch (error) {

    }
}

// User Forget Password To Check Email Exists Or Not
usermiddleware.emailCheck = async function (req, res, next) {
    data = await userController.emailExists(req.body.user_email, function (data) {
        if (data.status == "OK") {
            next();
        } else {
            return res.status(400).send(data);
        }
    });
}

// User NewPassword Validation Check
usermiddleware.userNewPasswordCheckValidation = async function (req, res, next) {
    try {
        await commonFunction.passwordValid(req.body.user_newpassword, function (data) {
            if (data.status == "OK") {
                next();
            } else {
                return res.status(400).send(data);
            }
        });
    } catch (error) {
        return res.status(500).send(data = { status: "ERROR", message: "MIDDLE PASSWORD CHANGE ERROR HENDLER" });
    }
}


// OTP TOKEN COMAPARE IS VALID OR NOT
usermiddleware.otpTokenCompare = async function (req, res, next) {
    try {
        if (Object.entries(req.body).length == 0) {
            return res.status(400).send({ status: "ERROR", message: "NOT ACCEPTED REQUEST ON SERVER" });
        } else {
            await userController.otpTokenCompare(req.body, function (data) {
                if (data.status == "OK") {
                    next();
                } else {
                    return res.status(400).send(data);
                }
            });
        }
    } catch (error) {
    }
}


module.exports = usermiddleware;