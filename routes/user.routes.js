// All External Packages
const express=require('express');
const router=express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));


const DataBaseConnection=require('../middleware/connection');
const middleware=require('../middleware/middleware');
const userController=require('../controller/user.controller');



// Login API
router.post('/login',function(req,res){
    let sqlQuery=`SELECT * FROM user where user_email='${req.body.user_email}`;

    //  AND user_password='${req.body.user_password}'`;
    console.log(sqlQuery);
    DataBaseConnection.query(sqlQuery,(err,rows,fields)=>{
        if(isNaN(rows)){
            res.send("");
        }
        if(rows[0].user_email===req.body.user_email && rows[0].user_password===req.body.user_password){
            res.send("SUCCESSFULLY LOGIN");
        }else{

        }
    });
});

// Register API
router.post('/register',middleware.validationCheck,middleware.registerCheck,function(req,res){

        
            promise=new Promise(function(resolve,reject){
                value=userController.registerUser(req,function(data){
                    if(data){
                        resolve(data);
                    }
                    reject("ERROR");
                });
            });
        try{
            promise.then(function(data){
                if(req.app.get('status')=="OK"){
                    res.send(data);
                }
            },function(err){
                console.log(err);
            });
        }catch(e){
            console.log(e);
        }
        
});

module.exports=router;