const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use(express.static(path.join(__dirname,'public')));


// Globel Variable Any App to Access
app.set("status", "CANCEL");

// Routes
const user = require('./user/routes/user.routes');
const recipe = require('./recipe/routes/recipe.routes');

// Router Assign User
app.use('/user', user);

//Router Assign Recipe
app.use('/recipe', recipe);

app.listen(3000);