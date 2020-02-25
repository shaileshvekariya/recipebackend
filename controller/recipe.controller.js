validationRecipe=require('../util/recipeValidation');
recipeUtil=require('../util/recipeUtils');
recipeController={};

// Validation Recipe And Add Recipe
recipeController.validateRecipe=async function(body,callback){
    data=await validationRecipe(body);
    if(Object.entries(data).length==0){
        data=await recipeUtil.addRecipe(body,function(data){
            return callback(data);
        });
    }else{
        return callback(data);
    };
}

// Validation Recipe And Edit Recipe
recipeController.validationEdit=async function(body,callback){
    data=await validationRecipe(body);
    if(Object.entries(data).length==0){
        data=await recipeUtil.editRecipe(body,function(data){
            return callback(data);
        });
    }else{
        return callback(data);
    };
}

recipeController.recipeDelete=async function(id,callback){
    await recipeUtil.deleteRecipe(id,function(data){
        return callback(data);
    });
}

recipeController.recipesGets=async function(count,callback){
    await recipeUtil.getRecipes(count,function(data){
        return callback(data);
    });
}

recipeController.recipesGet=async function(id,callback){
    await recipeUtil.getRecipe(id,function(data){
        return callback(data);
    });
}

module.exports=recipeController;