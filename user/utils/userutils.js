const jwt = require('jsonwebtoken');
const user = require('../model/user.model');
const DataBaseConnection = require('../../connection/connection');


userUtils = {};

// Only Check To User Exists Or Not Using Login API
userUtils.userCheckLogin = async function (body, callback) {
    let sqlQuery = `SELECT user_authtoken,user_email FROM user where user_email='${body.user_email}' AND user_password='${body.user_password}'`;
    await DataBaseConnection.query(sqlQuery, (error, rows, fields) => {
        if (rows.length == 0) {
            callback(data = { status: "ERROR", message: "USER NOT EXISTS" });
        } else {
            callback(data = { status: "OK", message: "USER EXISTS", user_email: rows[0].user_email, user_authtoken: rows[0].user_authtoken });
        }
    });
}

// Email Or Phone Already Exists Or Not On User Register
userUtils.emailOrPhoneExists = async function (email, phone, callback) {
    try {
        // Email Already Exists
        data = {};
        let checkQueryEmail = `SELECT * FROM user where user_email='${email}'`;
        await DataBaseConnection.query(checkQueryEmail, function (err, result) {
            if (result.length == 1) {
                data.data1 = { status: "ERROR", message: "User Email Already Exists" };
            }
        });

        checkQuery = `SELECT * FROM user where user_phone=${phone}`;
        await DataBaseConnection.query(checkQuery, function (err, result) {
            if (result.length == 1) {
                data.data2 = { status: "ERROR", message: "Phone Number Already Exists" };
            }
            return callback(data);
        });
    } catch (error) {
    }
}

// Inserted In DataBase User Register Value
userUtils.registerUser = async function (body, callback) {
    try {

        user.user_firstname = body.user_firstname.trim().toLowerCase();
        user.user_lastname = body.user_lastname.trim().toLowerCase();
        user.user_email = body.user_email.trim();
        user.user_phone = Number(body.user_phone.trim());
        user.user_password = body.user_password.trim();
        user.user_gender = body.user_gender.trim().toLowerCase();

        const token = jwt.sign({ user: 'user' }, 'token');
        user.user_authtoken = token;

        let sqlQuery = "INSERT INTO user SET ?";
        await DataBaseConnection.query(sqlQuery, user, (error) => {
            if (!error) {
                return callback({ status: "OK", message: "RECORD SUBMITED", user_authtoken: user.user_authtoken });
            }
        });
    } catch (error) {
        return callback({ status: "ERROR", message: "Not Inserted" });
    }
}

module.exports = userUtils;