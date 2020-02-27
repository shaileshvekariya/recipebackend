const express=require('express');
const app=express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// Globel Variable Any App to Access
app.set("status","CANCEL");

// Routes
const user=require('./user/routes/user.routes');
const recipe=require('./recipe/routes/recipe.routes');

// Router Assign User
app.use('/user',user);

//Router Assign Recipe
app.use('/recipe',recipe);

app.listen(3000);