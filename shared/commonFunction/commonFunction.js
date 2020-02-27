const user = require('../../user/model/user.model');
const DataBaseConnection = require('../../connection/connection');

commonFunction = {};

// User Register Checked All Validation Full Filed
commonFunction.validationUser = function (body, callback) {
    let data = {};

    user.user_firstname = body.user_firstname.trim().toLowerCase();
    user.user_lastname = body.user_lastname.trim().toLowerCase();
    user.user_email = body.user_email.trim();
    user.user_phone = Number(body.user_phone);
    user.user_password = body.user_password;
    user.user_gender = body.user_gender.trim().toLowerCase();


    let regexUser = /^[A-Za-z]+$/;
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let regexPhone = /^[6-9][0-9]{9}$/;
    let regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/;

    if ((user.user_firstname.length <= 1
        || user.user_firstname.length >= 15
        || user.user_firstname.indexOf(' ') >= 0
        || !isNaN(user.user_firstname))
        || !regexUser.test(user.user_firstname)
    ) {
        data.data1 = { status: "ERROR", message: "USER FIRST NAME NOT VALID" };
    }
    if ((user.user_lastname.length <= 1
        || user.user_lastname.length >= 15
        || user.user_lastname.indexOf(' ') >= 0
        || !isNaN(user.user_lastname))
        || !regexUser.test(user.user_lastname)
    ) {
        data.data2 = { status: "ERROR", message: "USER LAST NAME NOT VALID" };
    }
    if (!regexEmail.test(user.user_email) || user.user_email.length == 0) {
        data.data3 = { status: "ERROR", message: "EMAIL IS NOT VALID" };
    }

    if (!regexPhone.test(user.user_phone)) {
        data.data4 = { status: "ERROR", message: "Phone Number IS Not Valid" };
    }

    if (!regexPassword.test(user.user_password)) {
        data.data5 = { status: "ERROR", message: "Password Not Match Valid" };
    }

    if (!(user.user_gender.length == 1 &&
        (user.user_gender != 'm' ||
            user.user_gender != 'f'))) {
        data.data6 = { status: "ERROR", message: "GENDER IS NOT SELECTED" };
    }
    return callback(data);
}

// Email Exists Or Not to Check
commonFunction.emailExists = async function (email, callback) {
    try {
        sqlQuery = `SELECT * FROM user where user_email='${email}'`;
        await DataBaseConnection.query(sqlQuery, (error, rows) => {
            if (!error) {
                if (rows.length == 0) {
                    return callback(data = { status: "ERROR", message: "USER EMAIL ID IS NOT MATCH" });
                } else {
                    return callback(data = { status: "OK", message: "", user_authtoken: rows[0].user_authtoken });
                }
            }
        });
    } catch (error) {
        console.log(error);
        return callback(data = { status: "ERROR", message: "COMMON FUNCTION ERROR" });
    }
}

// Password Validation
commonFunction.passwordValid = async function (password, callback) {
    let regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/;
    if (!regexPassword.test(password)) {
        return callback({ status: "ERROR", message: "Password is Not Currect Format" });
    } else {
        return callback({ status: "OK", message: "" });
    }
}

module.exports = commonFunction;