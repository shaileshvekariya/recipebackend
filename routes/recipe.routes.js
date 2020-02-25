const express=require('express');
const router=express.Router();

const bodyParser=require('body-parser');
router.use(bodyParser.urlencoded({extended:true}));

const middleware=require('../middleware/middleware');
const recipeMiddleware=require('../middleware/recipe_middleware');
const recipeController=require('../controller/recipe.controller');


// Recipe Added
router.post('/add',middleware.verifyToken,recipeMiddleware.validation,function(req,res){
});

// Recipe Edited
router.post('/edit',middleware.verifyToken,recipeMiddleware.validationEdit,function(req,res){
});

// Recipe Deleted
router.post('/delete',middleware.verifyToken,async function(req,res){
    await recipeController.recipeDelete(req.body.recipe_id,function(data){
        res.send(data);
    });
});

//Recipes Get (Per Request 10 Result)
router.post('/getrecipes',middleware.verifyToken,async function(req,res){
    await recipeController.recipesGets(req.body.count,function(data){
        res.send(data);
    });
});

// Single Recipe
router.post('/getrecipe',middleware.verifyToken,function(req,res){
    recipeController.recipesGet(req.body.recipe_id,function(data){
        res.send(data);
    });
});


module.exports=router;