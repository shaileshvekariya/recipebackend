const userController = require('../../user/controller/user.controller');
const commonMiddleware = {};

// Only Auth User Token Chacked (COMMON MIDDLEWARE USER AND RECIPE)
commonMiddleware.verifyAuthToken = async function (req, res, next) {
    // if (Object.entries(req.body).length == 0) {
    //     return res.send({ status: "OK", message: "PLEASE SEND A DATA" });
    // }
    const token_header = req.headers['user_authtoken'];
    if (typeof token_header !== 'undefined') {
        await userController.userVerifyToken(token_header, function (data) {
            if (data.status == "OK") {
                next();
            } else {
                return res.status(400).send(data);
            }
        });
    } else {
        if (typeof token_header == "undefined") {
            res.status(403).send(data = { status: "ERROR", message: "TOKEN IS UNDEFINED" });
        }
    }
}

// User Auth Token And Mail Both Are Checked (COMMON MIDDLEWARE USER AND RECIPE)
commonMiddleware.verifyAuthTokenAndEmail = async function (req, res, next) {    
    const user_authtoken = req.headers['user_authtoken'];
    const email = req.body.user_email;


    if (typeof user_authtoken !== 'undefined') {
        await userController.userVerifyTokenAndEmail(user_authtoken, email, function (data) {
            if (data.status == "OK") {
                next();
            } else {
                res.status(200).send(data); 
            }
        });
    } else {
        // FORBIDDEN REQUEST
        res.status(403).send(data = { status: "ERROR", message: "TOKEN IS UNDEFINED" });
    }
}


// GET ALL RECIPES CHECK TO VALID USER TOKEN.
// THIS MIDDLEWARE IS USED TO ALL USER TOKEN IS VALID TO NEXT() AND NOT VALID TO NEXT()
// USING A GETRECIPES (ALL RECIPES DISPLAY ANY USER)
// THIS MIDDLEWARE USING (RESTRICTION DETAILS IN FOLLOW TO SQL QUERY RELATED)
commonMiddleware.verifyTokenAndGetRecipesDetails = async function (req, res, next) {
    // if (Object.entries(req.body).length == 0) {
    //     return res.status(200).send({ status: "OK", message: "PLEASE SEND A DATA" });
    // }
    const token_header = req.headers['user_authtoken'];
    if (token_header !== "") {
        await userController.userVerifyToken(token_header,async function (data) {
            if (data.status == "OK") {
                await userController.getUserIdToAuthToken(token_header,function(data){
                    res.user=[true,data];
                    next();
                });
            } else {
                return res.status(400).send(data);
            }
        });
    } else {
        if (token_header=="") {
            res.user=[false];
            next();
        }
    }
}

commonMiddleware.bodyCheck=async function(req,res,next){
    if(Object.entries(req.body).length==0){
        res.status(400).send({status:"ERROR",message:"PLEASE BODY IS NULL SEND DATA"});
    }else{
        next();
    }
}
module.exports = commonMiddleware;