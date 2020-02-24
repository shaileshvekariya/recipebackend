user=require('../model/user.model');


function validationUser(req){
    data={};

    user.user_firstname = req.body.user_firstname.trim().toLowerCase();
    user.user_lastname  = req.body.user_lastname.trim().toLowerCase();
    user.user_email     = req.body.user_email.trim();
    user.user_phone     = Number(req.body.user_phone);
    user.user_password  = req.body.user_password.trim();
    user.user_gender    = req.body.user_gender.trim().toLowerCase();

    
    let regexUser = /^[A-Za-z]+$/;
    let regexEmail=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let regexPhone=/^[6-9][0-9]{9}$/;
    let regexPassword= /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/;

    if((user.user_firstname.length<=1 
        || user.user_firstname.length>=15 
        || user.user_firstname.indexOf(' ')>=0
        || !isNaN(user.user_firstname))
        || !regexUser.test(user.user_firstname)
        ){
        data.data1={status:"ERROR",message:"USER FIRST NAME NOT VALID"};
    }
    if((user.user_lastname.length<=1 
        || user.user_lastname.length>=15 
        || user.user_lastname.indexOf(' ')>=0
        || !isNaN(user.user_lastname))
        || !regexUser.test(user.user_lastname)
        ){
        data.data2={status:"ERROR",message:"USER LAST NAME NOT VALID"};
    }
    if(!regexEmail.test(user.user_email) || user.user_email.length==0){
        data.data3={status:"ERROR",message:"EMAIL IS NOT VALID"};
    }

    if(!regexPhone.test(user.user_phone)){
        data.data4={status:"ERROR",message:"Phone Number IS Not Valid"};
    }

    if(!regexPassword.test(user.user_password)){
        data.data5={status:"ERROR",message:"Password Not Match Valid"};
    }

    if(!(user.user_gender.length==1 &&
        (user.user_gender !='m' ||
        user.user_gender != 'f' ))){
        data.data6={status:"ERROR",message:"GENDER IS NOT SELECTED"};
    }
   return data;
}

module.exports=validationUser;