recipeController=require('../controller/recipe.controller');

recipeMiddleware={};


recipeMiddleware.validation=async function(req,res,next){
    await recipeController.validateRecipe(req.body,function(data){
        res.send(data);
        next();
    });
}

recipeMiddleware.validationEdit=async function(req,res,next){
    await recipeController.validationEdit(req.body,function(data){
        res.send(data);
        next();
    });
}

module.exports=recipeMiddleware;