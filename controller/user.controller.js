const jwt=require('jsonwebtoken');
user=require('../model/user.model');
const DataBaseConnection=require('../middleware/connection');

userController={};

userController.registerUser=async function(req,callback){
    user.user_firstname = req.body.user_firstname.trim().toLowerCase();
    user.user_lastname  = req.body.user_lastname.trim().toLowerCase();
    user.user_email     = req.body.user_email.trim();
    user.user_phone     = Number(req.body.user_phone.trim());
    user.user_password  = req.body.user_password.trim();
    user.user_gender    = req.body.user_gender.trim().toLowerCase();

    const token = jwt.sign({ user:'user' }, 'token');
    user.user_authtoken=token;

    let data={};

    let sqlQuery="INSERT INTO user SET ?";
    await DataBaseConnection.query(sqlQuery,user,(err,rows,fields)=>{
        if(err){
            console.log(err);
            req.app.set("status","CANCEL");
            data.data={status:"ERROR",message:"Not Inserted"};
            return callback(data); 
        }else{
            console.log("INSERTED");
            req.app.set("status","OK");
            data.data={status:"OK",message:"RECORD SUBMITED",user_authtoken:user.user_authtoken};
            return callback(data);
        }
    });
}   


userController.userCheckChengePassword=async function(req,callback){
    // console.log(req.body);
    // console.log(req.headers);
    let data={};
    let sqlQuery=`SELECT user_id FROM user where user_authtoken='${req.headers.user_authtoken}'
    AND user_password='${req.body.user_oldpassword}'`;
    await DataBaseConnection.query(sqlQuery,async function(error,rows){
        if(rows.length==0){
            data.data={status:"ERROR",message:"OLD PASSWORD IS NOT MATCHING"};
            callback(data);
        }else{
            user_id=rows[0].user_id;

            let sqlQuery=`UPDATE user set user_password='${req.body.user_newpassword}' 
            where user_id=${user_id}`;
            await DataBaseConnection.query(sqlQuery, function(error,rows){
                if(rows!=="undefined"){
                    data.data={status:"OK",message:"PASSWORD IS CHANGING"};
                    callback(data);
                }
            });
        }
    });
}

userController.userCheckLogin=async function(req,callback){
    var sqlQuery;
    if(req.body.user_password!==undefined){
        sqlQuery=`SELECT user_authtoken FROM user where user_email='${req.body.user_email}' AND user_password='${req.body.user_password}'`;
    }else{
        sqlQuery=`SELECT * FROM user where user_email='${req.body.user_email}'`;
    }
    await DataBaseConnection.query(sqlQuery,(error,rows,fields)=>{
        if(rows.length==0){
            callback(data={status:"ERROR",message:"USER NOT EXSITS"});
        }else{
            callback(data={status:"OK",message:"",user_authtoken:rows[0].user_authtoken});
        }
    });
}

userController.forgetPassword=function(body){
        promise=new Promise((resolve,reject)=>{
            userController.emailExsits(body,function(data){
                if(data.status=="OK"){
                    resolve(data);
                }else{
                    resolve(data);
                }
            });
        });

        
}

userController.emailExsits=function(body,callback){
    sqlQuery=`SELECT * FROM user where user_email='${body.user_email}' AND user_otptoken=${Number(body.user_otptoken)}`;
    DataBaseConnection.query(sqlQuery,(error,rows,fields)=>{
        if(error){
                console.log(error);
        }else{
            if(rows.length==0){
                return callback (data={status:"ERROR",message:"USER TOKEN IS NOT VALID"});
            }else{
                return callback (data={status:"OK",message:"",user_authtoken:rows[0].user_authtoken});
            }
        }
    });
}
module.exports=userController;