const express=require('express');
const app=express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// Globel Variable
app.set("status","CANCEL");

// Routes Import
var user=require('./routes/user.routes');


// Router Assign
app.use('/user',user);

app.listen(3000);