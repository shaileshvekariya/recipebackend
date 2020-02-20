DataBaseConnection=require('./connection');
user=require('../model/user.model');
validationUser=require('../util/commonFunction');

middleware={};

middleware.validationCheck=async function(req,res,next){
    data=await validationUser(req);
    if(data.length==0){
        next();
    }else{
        return res.send(data);
    }
}

middleware.registerCheck=async function(req,res,next){
    // console.log(req.body);
    data=[];
    check=false;
    count=0;

    try{
        if(check==false){
            checkQuery=`SELECT * FROM user where user_email='${req.body.user_email}'`;
            DataBaseConnection.query(checkQuery,function (err, result){
                if(result.length==1){
                count+=1;
                data.push({status:"Error",message:"Email Already Exists"});
                check=true;
                console.log("Email Already Exists");
                }
            });
        }

        if(check==false){
            //Phone Number Already Exists
            checkQuery=`SELECT * FROM user where user_phone=${req.body.user_phone}`;
            DataBaseConnection.query(checkQuery,function(err,result){
                if(result.length==1){
                        count+=1;
                        // data.status="Error";
                        // data.message="Phone Number Already Exists";
                        data.push({status:"Error",message:"Phone Number Already Exists"});
                        check=true;
                        console.log("Phone Number Already Exists");
                    }
                });
            }

            setTimeout(function(){
                if(count==0){
                    data.push({status:"OK",message:""});
                    res.send(data);
                    req.app.set('status',"OK");
                    // registerUser();
                    next();
                }
                else if(count>0){
                    return res.send(data);
                }   
            },300);
            
    }catch(e){
        console.log(e);
    }
}

module.exports=middleware;