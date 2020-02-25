const express=require('express');
const app=express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// Globel Variable
app.set("status","CANCEL");

// Routes Import
const user=require('./routes/user.routes');
const recipe=require('./routes/recipe.routes');



// Router Assign User
app.use('/user',user);

//Router Assign Recipe
app.use('/recipe',recipe);

app.listen(3000);