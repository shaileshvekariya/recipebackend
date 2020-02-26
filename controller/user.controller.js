const jwt = require('jsonwebtoken');
const user = require('../model/user.model');
const DataBaseConnection = require('../middleware/connection');

userController = {};

userController.profileUpdated = function (email, user_profile, callback) {
    sqlQuery = `UPDATE user SET user_profile='${user_profile}' where user_email='${email}'`;
    DataBaseConnection.query(sqlQuery, (error, result) => {
        if (error) {
            return callback(data = { status: "ERROR", message: "PROFILE IS NOT UPDATED" });
        }
        if (result.affectedRows == 1) {
            return callback(data = { status: "OK", message: "PROFILE IS UPDATED" });
        }
    });
}

userController.profile = function (email, callback) {
    let sqlQuery = `SELECT user_firstname,user_lastname,user_email,user_phone,user_gender,user_profile FROM user where user_email='${email}'`;
    DataBaseConnection.query(sqlQuery, function (error, result) {
        if (result.length >= 1) {
            return callback(result[0]);
        }
    });
};

userController.userVerifyToken = function (token_header, email, callback) {
    sqlQuery = `SELECT * FROM user where user_authtoken='${token_header}' AND user_email='${email}'`;
    DataBaseConnection.query(sqlQuery, (error, rows) => {
        if (error) {
            return callback(data = { status: "ERROR", message: "TOKEN IS NOT AVAILABLE" });
        }
        if (rows.length >= 1) {
            return callback(data = { status: "OK", message: "TOKEN IS AVAILABLE" });
        } else {
            return callback(data = { status: "ERROR", message: "USER EMAIL OR TOKEN IS NOT VALID" });
        }
    });
};

userController.registerUser = async function (req, callback) {
    user.user_firstname = req.body.user_firstname.trim().toLowerCase();
    user.user_lastname = req.body.user_lastname.trim().toLowerCase();
    user.user_email = req.body.user_email.trim();
    user.user_phone = Number(req.body.user_phone.trim());
    user.user_password = req.body.user_password.trim();
    user.user_gender = req.body.user_gender.trim().toLowerCase();

    const token = jwt.sign({ user: 'user' }, 'token');
    user.user_authtoken = token;

    let data = {};

    let sqlQuery = "INSERT INTO user SET ?";
    await DataBaseConnection.query(sqlQuery, user, (err, rows, fields) => {
        if (err) {
            console.log(err);
            req.app.set("status", "CANCEL");
            data.data = { status: "ERROR", message: "Not Inserted" };
            return callback(data);
        } else {
            console.log("INSERTED");
            req.app.set("status", "OK");
            data.data = { status: "OK", message: "RECORD SUBMITED", user_authtoken: user.user_authtoken };
            return callback(data);
        }
    });
}

userController.userCheckChangePassword = async function (req, callback) {
    let sqlQuery = `SELECT user_id FROM user where user_authtoken='${req.headers.user_authtoken}'
    AND user_password='${req.body.user_oldpassword}'`;
    await DataBaseConnection.query(sqlQuery, async function (error, rows) {
        if (rows.length == 0) {
            data = { status: "ERROR", message: "OLD PASSWORD IS NOT MATCHING" };
            return callback(data);
        } else {
            user_id = rows[0].user_id;
            let sqlQueryUpdate = `UPDATE user set user_password='${req.body.user_newpassword}' 
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

userController.userCheckLogin = async function (req, callback) {
    var sqlQuery;
    if (req.body.user_password !== undefined) {
        sqlQuery = `SELECT user_authtoken FROM user where user_email='${req.body.user_email}' AND user_password='${req.body.user_password}'`;
    } else {
        sqlQuery = `SELECT * FROM user where user_email='${req.body.user_email}'`;
    }
    await DataBaseConnection.query(sqlQuery, (error, rows, fields) => {
        if (rows.length == 0) {
            callback(data = { status: "ERROR", message: "USER NOT EXISTS" });
        } else {
            callback(data = { status: "OK", message: "USER EXISTS", user_email: rows[0].user_email, user_authtoken: rows[0].user_authtoken });
        }
    });
}

userController.forgetPassword = async function (body, callback) {
    await userController.emailExists(body, function (data) {
        if (data.status == "OK") {
            callback(data);
        } else {
            callback(data);
        }
    });
}

userController.emailExists = async function (body, callback) {
    sqlQuery = `SELECT * FROM user where user_email='${body.user_email}'`;
    await DataBaseConnection.query(sqlQuery, (error, rows, fields) => {
        if (error) {
            console.log("ERROR", error);
        } else {
            if (rows.length == 0) {
                return callback(data = { status: "ERROR", message: "USER TOKEN IS NOT VALID" });
            } else {
                return callback(data = { status: "OK", message: "", user_authtoken: rows[0].user_authtoken });
            }
        }
    });
}

userController.userForgetChangePassword = async function (req, callback) {
    let sqlQuery = `SELECT user_id FROM user where user_email='${req.body.user_email}'`;
    await DataBaseConnection.query(sqlQuery, async function (error, rows) {
        if (rows.length == 0) {
            data = { status: "ERROR", message: "PASSWORD IS NOT UPDATING" };
            callback(data);
        } else {
            user_id = rows[0].user_id;
            let sqlQuery = `UPDATE user set user_password='${req.body.user_newpassword}' 
            where user_id=${user_id}`;
            await DataBaseConnection.query(sqlQuery, function (error, rows) {
                if (rows !== "undefined") {
                    data = { status: "OK", message: "PASSWORD IS CHANGING" };
                    callback(data);
                }
            });
        }
    });
}

userController.otpTokenGenerator = async function (email, callback) {

    otpTokenPromise = new Promise(async function (resolve, reject) {

        otpToken = Math.floor(Math.random() * 90000) + 10000;
        sqlQuery = `UPDATE user SET user_otptoken=${otpToken} where user_email='${email}'`;
        await DataBaseConnection.query(sqlQuery, async function (error, result) {

            console.log("RESULT", result);
            if (result.affectedRows == 1) {
                userController.tokenClear(email);
                resolve(data = { status: "OK", message: "", user_otptoken: otpToken });
            }
            if (error) {
                reject(data = { status: "ERROR", message: "" });
            }
        });
    });

    otpTokenPromise.then(function (data) {
        callback(data);
    }, function (error) {
        callback(error);
    });
}

userController.tokenClear = function (email) {
    setTimeout(function () {
        console.log("CALLED", email);
        sqlQuery = `UPDATE user SET user_otptoken=NULL where user_email='${email}'`;
        DataBaseConnection.query(sqlQuery, function (error, result) {
        });
        clearTimeout();
    }, 180000);
}

userController.tokenCompare = async function (body, callback) { 
    try {
        let sqlQuery = `SELECT * from user where user_email='${body.user_email}' AND user_otptoken=${body.user_otptoken}`;
        console.log(sqlQuery);
        await DataBaseConnection.query(sqlQuery, async function (error, rows) {

            console.log(rows);
            if (!error) {
                if (rows.length <= 0) {
                    return await callback(data = { status: "ERROR", message: "TOKEN NOT MATCH" });
                } else {
                    return await callback(data = { status: "OK", message: "TOKEN MATCH" });
                }
            }
        });
    } catch (error) {
        return callback(data = { status: "ERROR", message: "ERROR" });
    }

}


module.exports = userController;