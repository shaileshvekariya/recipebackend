recipeController=require('../controller/recipe.controller');

recipeMiddleware={};

// Validation Recipe
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

recipeMiddleware.commentValidation=async function(req,res,next){
    try {
        await recipeController.commentValidate(req.body.comment_text,function(data){
            if(data.status=="OK"){
                next();
            }else{
                return res.send(data);
            }
        });
    } catch (error) {
        
    }
}

module.exports=recipeMiddleware;