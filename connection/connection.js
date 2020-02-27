const mysql=require('mysql');

var DataBaseConnection=mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'',
        database:'recipe_house'
    });

    DataBaseConnection.connect((err)=>{
        if(err){
            console.log("Database is not connected");
        }else{
            console.log("Connection Successfully Created");
        }
    });

    DataBaseConnection.on('error', function(err) {
        console.log("[mysql error]",err);
    });
module.exports= DataBaseConnection;
