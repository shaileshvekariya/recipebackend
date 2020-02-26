const jwt=require('jsonwebtoken');
const DataBaseConnection=require('./connection');
const validationUser=require('../util/commonFunction');
const userController=require('../controller/user.controller');

middleware={};

middleware.validationCheck=function(req,res,next){
    let promise=new Promise(async (resolve,reject)=>{
        data =await validationUser(req);
        errorCount=Object.keys(data).length;
        if(errorCount==0){
            resolve();
        }else{
            res.send(data);
        }
    });
    promise.then(()=>{
        next();
    });
}

middleware.registerCheck=function(req,res,next){
            // console.log(req.body);
            data={};

            // Email Already Exists
            new Promise((resolve,reject)=>{
                checkQuery=`SELECT * FROM user where user_email='${req.body.user_email}'`;
                DataBaseConnection.query(checkQuery,function (err, result){
                    try{
                        if(result.length==1){
                            data.data={status:"ERROR",message:"Email Already Exists"};
                            check=true;
                            console.log("Email Already Exists");
                            reject(res.send(data));
                        }
                        resolve();
                    }catch(error){
                        resolve(error);
                    }   
                });
            }).then(()=>{

                // Phone Number Already Exists                
                new Promise((resolve,reject)=>{
                    checkQuery=`SELECT * FROM user where user_phone=${req.body.user_phone}`;
                    DataBaseConnection.query(checkQuery,function(err,result){
                    if(result.length==1){
                            console.log("Phone Number IS DUPLICATE");
                            data.data={status:"ERROR",message:"Phone Number Already Exists"};
                            reject(res.send(data));
                        }
                        resolve();
                    });
                }).then(()=>{
                    next();
                }),(data)=>{
                    res.send(data);
                };
                
            }),(data)=>{
                console.log(data);
            };
}

middleware.verifyTokenChange=async function(req,res,next){
    const token_header=req.headers['user_authtoken'];

    if(typeof token_header!=='undefined'){
        data=await userController.userCheckChangePassword(req,function(data){
            if(data.status=="OK"){
                res.send(data);
                next();
            }else{
                res.send(data);
            }
        });
    }else{
        // FORBIDDEN REQUEST
        res.sendStatus(403);
    }
}

middleware.userCheckLogin=async function(req,res,next){
    new Promise(async (resolve,reject)=>{
        userController.userCheckLogin(req,function(data){
            resolve(data);
        });
    }).then(data=>{
        res.send(data);
        next();
    });   
}

middleware.emailCheck=async function(req,res,next){
    data=await userController.emailExists(req.body,function(data){
        if(data.status=="OK"){
            next();
        }else{
            return res.send(data={status:"ERROR",message:"EMAIL DOES NOT EXISTS"});
        }
    });
}

middleware.verifyToken=async function(req,res,next){

    const token_header=req.headers['user_authtoken'];
    const email=req.headers['user_email'];
    
    if(typeof token_header!=='undefined'){
        data=await userController.userVerifyToken(token_header,email,function(data){
            if(data.status=="OK"){
                // res.send(data);
                next();
            }else{
                res.send(data);
            }
        });
    }else{
        // FORBIDDEN REQUEST
        res.sendStatus(403);
    }
}

middleware.tokenCompare=async function(req,res,next){
    await userController.tokenCompare(req.body,function(data){
        if(data.status=="OK"){
            next();
        }else{
            return res.send(data);
        }
    });
}

module.exports=middleware;