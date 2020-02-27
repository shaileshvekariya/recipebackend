const userController=require('../../user/controller/user.controller');
const commonMiddleware={};

// Only Auth User Token Chacked (COMMON MIDDLEWARE USER AND RECIPE)
commonMiddleware.verifyAuthToken = async function (req, res, next) {
    if(Object.entries(req.body).length==0){
        return res.send({status:"OK",message:"PLEASE SEND A DATA"});
    }
    const token_header = req.headers['user_authtoken'];
    if (typeof token_header !== 'undefined') {
        await userController.userVerifyToken(token_header,function(data){
            if(data.status=="OK"){
                next();
            }else{
                return res.send(data);
            }
        }); 
    } else {
        // FORBIDDEN REQUEST
        res.sendStatus(403);
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
                res.send(data);
            }
        });
    } else {
        // FORBIDDEN REQUEST
        res.sendStatus(403);
    }
}

module.exports=commonMiddleware;