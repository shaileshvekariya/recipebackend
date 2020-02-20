user=require('../model/user.model');
var DataBaseConnection=require('../middleware/connection');

userController={};

userController.registerUser=function(req,callback){
    user.user_firstname = req.body.user_firstname.trim().toLowerCase();
    user.user_lastname  = req.body.user_lastname.trim().toLowerCase();
    user.user_email     = req.body.user_email.trim();
    user.user_phone     = Number(req.body.user_phone.trim());
    user.user_password  = req.body.user_password.trim();
    user.user_gender    = req.body.user_gender.trim().toLowerCase();

    user.user_authtoken=new Date();

    let data={};

    sqlQuery="INSERT INTO user SET ?";
    DataBaseConnection.query(sqlQuery,user,(err,rows,fields)=>{
        if(err){
            console.log(err);
            req.app.set("status","CANCEL");
            data={status:"Error",message:"Not Inserted"};
            return callback(data);
        }else{
            console.log("INSERTED");
            req.app.set("status","OK");
            data={status:"OK",message:"RECORD SUBMITED"};
            return  callback(data);
        }
    });
}   

module.exports=userController;