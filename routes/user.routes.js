// All External Packages
const express=require('express');
const router=express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));


const DataBaseConnection=require('../middleware/connection');
const middleware=require('../middleware/middleware');
const userController=require('../controller/user.controller');



// Login API
router.post('/login',middleware.userCheckLogin,function(req,res){

});

// Register API
router.post('/register',middleware.validationCheck,middleware.registerCheck,function(req,res){

            const promise=new Promise(async function(resolve,reject){
                data=await userController.registerUser(req,(data)=>{
                    if(data.data.status=="OK"){
                        resolve(data);
                    }else{
                        reject(data);
                    }
                });
            });

            promise.then((data)=>{
                return res.send(data);
            },(error)=>{
                return res.send(error);
            });
});

// userChangePassword
router.post('/userchangepassword',middleware.verifyToken,function(req,res){
});

// Login Forget API
router.post('/login/forget',middleware.userCheckLogin,function(req,res){
});

// Foget Token Change API
router.post('/forget/token/chack',async function(req,res){
    let start=async function() {
        return userController.forgetPassword(req.body).then(data=> {console.log(data);return data;})
    };
    
    data=await start();    
    // return google.login(data.username, data.password).then(token => { return token } )

    
});

module.exports=router;