const DataBaseConnection = require('../connection/connection');
const user = require('../model/user.model');
const commonFunction = require('../shared/commonFunction/commonFunction');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs');

// const userUtils = require('../utils/userutils');
const sendMail = require('../nodeMailer/SendMail');

userController = {};

// Login API User Exists Or Not
userController.userCheckLogin = async function (body, callback) {
    try {
        // await userUtils.userCheckLogin(body, function (data) {
        //     return callback(data);
        // });
        commonFunction.emailValid(body.user_email, async function (data) {
            if (data.status == "ERROR") {
                return callback(data);
            } else {
                let user_password = crypto.createHash('md5').update(body.user_password).digest('hex');
                let sqlQueryEmailCheck = `SELECT user_email FROM user where user_email='${body.user_email}'`;
                await DataBaseConnection.query(sqlQueryEmailCheck, async (error, rows) => {
                    if (rows.length == 0) {
                        return callback(data = { status: "ERROR", message: "Email id is not exists" });
                    } else {
                        let sqlQuery = `SELECT user_authtoken,user_email FROM user where user_email='${body.user_email}' AND user_password='${user_password}'`;
                        await DataBaseConnection.query(sqlQuery, (error, rows, fields) => {
                            if (rows.length == 0) {
                                return callback(data = { status: "ERROR", message: "Password is not matching" });
                            } else {
                                return callback(data = { status: "OK", message: "USER EXISTS", user_email: rows[0].user_email, user_authtoken: rows[0].user_authtoken });
                            }
                        });
                    }
                });

            }
        });
    } catch (error) {
        return callback(data = { status: "ERROR", message: "USER CONSTROLLER CHANGE PASSWORD MESSAGE" });
    }
}


// Email Or Phone Check To Register user to a Valid Or Already Exists
userController.emailOrPhoneExists = async function (email, phone, callback) {
    try {
        // Email Already Exists
        data = [];
        let checkQueryEmail = `SELECT * FROM user where user_email='${email}'`;
        await DataBaseConnection.query(checkQueryEmail, function (err, result) {
            if (result.length == 1) {
                data.push({ fieldName: "emailError", errorMessage: "User email already Exists" });
            }
        });

        checkQuery = `SELECT * FROM user where user_phone=${phone}`;
        await DataBaseConnection.query(checkQuery, function (err, result) {
            if (result.length == 1) {
                data.push({ fieldName: "phoneError", errorMessage: "Phone number already Exists" });
            }
            return callback(data);
        });
    } catch (error) {

    }

    // try {
    //     await userUtils.emailOrPhoneExists(email, phone, function (data) {
    //         if (Object.entries(data).length == 0) {
    //             return callback(data = { status: "OK", message: "" });
    //         } else {
    //             return callback(data);
    //         }
    //     });
    // } catch (error) {
    // }
}

// Register User Controller
userController.registerUser = async function (body, callback) {
    try {
        user.user_firstname = body.user_firstname.trim().toLowerCase();
        user.user_lastname = body.user_lastname.trim().toLowerCase();
        user.user_email = body.user_email.trim().toLowerCase();
        user.user_phone = Number(body.user_phone.trim());

        user.user_password = crypto.createHash('md5').update(body.user_password).digest('hex');

        // user.user_password = body.user_password;

        user.user_gender = body.user_gender.trim().toLowerCase();

        const token = jwt.sign({ user: 'user' }, 'token');
        user.user_authtoken = token;


        let sqlQuery = "INSERT INTO user SET ?";
        await DataBaseConnection.query(sqlQuery, user, (error) => {
            if (!error) {
                return callback({ status: "OK", message: "RECORD SUBMITED", user_authtoken: user.user_authtoken });
            } else {
                return callback({ status: "ERROR", message: "Not Inserted" });
            }
        });
    } catch (error) {
        return callback({ status: "ERROR", message: "Not Inserted" });
    }

    // try {
    //     // userUtils.registerUser(body, function (data) {
    //     //     return callback(data);
    //     // });
    // } catch (error) {
    //     return callback(data = { status: "ERROR", message: "Register Controller Error" });
    // }
}

// Email Exists Or Not Check To Common Function
userController.emailExists = async function (email, callback) {
    try {
        await commonFunction.emailExists(email, function (data) {
            return callback(data);
        });
    } catch (error) {
    }
}

// OPT TOKEN Generate
userController.otpTokenGenerator = async function (email, callback) {
    try {
        // let otpToken = Math.floor(Math.random() * 90000) + 10000;
        let otpToken = 11111;
        let mailOptions = {
            from: 'Recipe House<shailesh.vekariya.sa@gmail.com>',
            to: email,
            subject: "Reset Your Password",
            html: `<h1>Welcome Recipe House</h1> <h2 style="color:red;">Do not Share Any Person</h2>
             <h4 style="color:red;">Only 1 Minute To a  Valid a Token.</h4>
             <h2>Please Enter a OTP Token in your Mobile And Reset Your Password:<h2> 
             <u><h2 style="color:blue;">OTP: ${otpToken}</h2></u>`
        };
        await sendMail(mailOptions, async function (data) {
            if (data) {
                let sqlQuery = `UPDATE user SET user_otptoken=${otpToken} where user_email='${email}'`;
                await DataBaseConnection.query(sqlQuery, async function (error, result) {
                    if (!error) {
                        if (result.affectedRows == 1) {
                            userController.tokenClear(email);
                            return callback(data = { status: "OK", message: "OTP TOKEN SAVED", user_otptoken: otpToken });
                        }
                    }
                });
            }
        });
    } catch (error) {
        return callback(data = { status: "ERROR", message: "ERROR TOKEN NOT SAVED" });
    }
}

// User Genrate Token And Set Timeout to Expired Token
userController.tokenClear = function (email) {
    setTimeout(function () {
        sqlQuery = `UPDATE user SET user_otptoken=NULL where user_email='${email}'`;
        DataBaseConnection.query(sqlQuery, function (error, result) {
        });
        clearTimeout();
    }, 60000);
}

// USER OTP TOKEN COMPARE MATCH OR NOT 
userController.otpTokenCompare = async function (body, callback) {
    try {
        let sqlQuery = `SELECT * from user where user_email='${body.user_email}' AND user_otptoken=${body.user_otptoken}`;
        await DataBaseConnection.query(sqlQuery, function (error, rows) {
            if (!error) {
                if (rows.length <= 0) {
                    return callback(data = { status: "ERROR", message: "TOKEN NOT MATCH" });
                } else {
                    return callback(data = { status: "OK", message: "TOKEN MATCH" });
                }
            } else {
                return callback(data = { status: "ERROR", message: "TOKEN NOT MATCH" });
            }
        });
    } catch (error) {
        return callback(data = { status: "ERROR", message: "USER CONTROLLER TOKEN COMPARE ERROR" });
    }
}

// User Password Updated 
userController.userForgetChangePassword = async function (req, callback) {
    let sqlQuery = `SELECT user_id FROM user where user_email='${req.body.user_email}'`;
    await DataBaseConnection.query(sqlQuery, async function (error, rows) {
        if (rows.length == 0) {
            data = { status: "ERROR", message: "PASSWORD IS NOT UPDATING" };
            return callback(data);
        } else {
            user_id = rows[0].user_id;
            let user_password = crypto.createHash('md5').update(req.body.user_newpassword).digest('hex');
            let sqlQuery = `UPDATE user set user_password='${user_password}' 
            where user_id=${user_id}`;
            await DataBaseConnection.query(sqlQuery, function (error, rows) {
                if (rows !== "undefined") {
                    data = { status: "OK", message: "PASSWORD IS CHANGING" };
                    return callback(data);
                }
            });
        }
    });
}


// User Auth Token Verified
userController.userVerifyToken = async function (token_header, callback) {
    try {
        sqlQuery = `SELECT * FROM user where user_authtoken='${token_header}'`;
        await DataBaseConnection.query(sqlQuery, (error, rows) => {
            if (!error) {
                if (rows.length >= 1) {
                    return callback(data = { status: "OK", message: "TOKEN IS AVAILABLE" });
                } else {
                    return callback(data = { status: "ERROR", message: "TOKEN IS NOT VALID" });
                }
            }
        });
    } catch (error) {
    }
}

// Auth Token And Email Verified
userController.userVerifyTokenAndEmail = async function (user_authtoken, email, callback) {
    try {
        sqlQuery = `SELECT * FROM user where user_authtoken='${user_authtoken}' AND user_email='${email}'`;
        await DataBaseConnection.query(sqlQuery, (error, rows) => {
            if (!error) {
                if (rows.length >= 1) {
                    return callback(data = { status: "OK", message: "TOKEN IS AVAILABLE" });
                } else {
                    return callback(data = { status: "ERROR", message: "TOKEN IS NOT MATCH THIS EMAIL ID PLEASE CHANGE REGISTER EMAIL ID" });
                }
            }
        });
    } catch (error) {

    }
}


// User Check Change Password Or Updated Password
userController.userCheckChangePassword = async function (body, headers, callback) {

    let user_oldpassword = crypto.createHash('md5').update(body.user_oldpassword).digest('hex');
    let sqlQuery = `SELECT user_id FROM user where user_authtoken='${headers.user_authtoken}'
    AND user_password='${user_oldpassword}'`;
    await DataBaseConnection.query(sqlQuery, async function (error, rows) {
        if (rows.length == 0) {
            data = { status: "ERROR", message: "OLD PASSWORD IS NOT MATCHING" };
            return callback(data);
        } else {
            user_id = rows[0].user_id;

            let user_newpassword = crypto.createHash('md5').update(body.user_newpassword).digest('hex');
            let sqlQueryOldPassCheck = `SELECT user_id FROM user where user_password='${user_newpassword}'`;
            await DataBaseConnection.query(sqlQueryOldPassCheck, async function (error, rows) {
                if (rows.length == 1) {
                    data = { status: "OK", message: "OLD PASSWORD AND NEW PASSWORD IS SAME PLEASE CHANGE NEW PASSWORD" };
                    return callback(data);
                } else {
                    let sqlQueryUpdate = `UPDATE user set user_password='${user_newpassword}' 
                      where user_id=${user_id}`;
                    await DataBaseConnection.query(sqlQueryUpdate, function (error, rows) {
                        if (rows !== "undefined") {
                            data = { status: "OK", message: "PASSWORD IS CHANGE" };
                            return callback(data);
                        }
                    });
                }
            });
        }
    });
}

// User Profile Get
userController.profileGet = async function (email, callback) {
    try {
        let sqlQuery = `SELECT user_firstname,user_lastname,user_email,user_phone,user_gender,user_profile FROM user where user_email='${email}'`;
        await DataBaseConnection.query(sqlQuery, function (error, result) {
            if (result.length >= 1) {
                return callback(data = { status: "OK", message: "", user_details: result[0] });
            }
        });
    } catch (error) {
    }
};

// User Profile Image Upload And Updated
userController.profileUpdated = async function (userProfile, email, fileName, fileSize, callback) {
    await commonFunction.imageValidation(fileName, fileSize, userProfile.mimetype, async function (data) {
        if (data.status !== "ERROR") {
            let oldUserImageFetch = `SELECT user_profile FROM user WHERE user_email='${email}'`;
            await DataBaseConnection.query(oldUserImageFetch, async function (error, result) {
                let userOldImage = result[0].user_profile;
                try {
                    if (result[0].user_profile != '') {
                        fs.unlinkSync('public/userimages/' + userOldImage);
                    }
                } catch (error) {
                    return callback(data = { status: "ERROR", message: "IMAGE IS NOT UPLOAD" });
                }

                let user_profile = Date.now() + "-" + fileName;
                userProfile.mv('public/userimages/' + user_profile);
                sqlQuery = `UPDATE user SET user_profile='${user_profile}' where user_email='${email}'`;
                await DataBaseConnection.query(sqlQuery, (error, result) => {
                    if (error) {
                        return callback(data = { status: "ERROR", message: "PROFILE IS NOT UPDATED" });
                    }
                    if (result.affectedRows == 1) {
                        return callback(data = { status: "OK", message: "PROFILE IS UPDATED" });
                    }
                });

            });

        } else {
            return callback(data);
        }
    });
}

// UserToken To Get User_id
userController.getUserIdToAuthToken = async function (auth_token, callback) {
    await DataBaseConnection.query(`SELECT user_id FROM user where user_authtoken='${auth_token}'`, function (error, result) {
        return callback(result[0].user_id);
    });
}

module.exports = userController;