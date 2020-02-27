validationRecipe = require('../../util/recipeValidation');
recipeUtil = require('../utils/recipeUtils');
recipeController = {};

// Validation Recipe And Add Recipe
recipeController.validateRecipe = async function (body, callback) {
    data = await validationRecipe(body);
    if (Object.entries(data).length == 0) {
        data = await recipeUtil.addRecipe(body, function (data) {
            return callback(data);
        });
    } else {
        return callback(data);
    };
}

// Validation Recipe And Edit Recipe
recipeController.validationEdit = async function (body, callback) {
    data = await validationRecipe(body);
    if (Object.entries(data).length == 0) {
        data = await recipeUtil.editRecipe(body, function (data) {
            return callback(data);
        });
    } else {
        return callback(data);
    };
}

recipeController.recipeDelete = async function (id, callback) {
    await recipeUtil.deleteRecipe(id, function (data) {
        return callback(data);
    });
}

recipeController.recipesGets = async function (count, callback) {
    await recipeUtil.getRecipes(count, function (data) {
        return callback(data);
    });
}

recipeController.recipesGet = async function (id, callback) {
    await recipeUtil.getRecipe(id, function (data) {
        return callback(data);
    });
}

recipeController.favorite = async function (body, callback) {
    try {
        if (body.favorite == 'true') {
            await recipeUtil.addFavorite(body, function (data) {
                return callback(data);
            });
        }
        else {
            await recipeUtil.removeFavorite(body, function (data) {
                return callback(data);
            });
        }
    } catch (error) {

    }
}

recipeController.userFavoriteRecipe=async function(email,callback){
    try {
        await recipeUtil.userFavoriteRecipe(email,function(data){
            return callback(data);
        });
    } catch (error) {
        
    }
}


// ALL RECIPE GETS
recipeController.userRecipes = async function (email, callback) {
    try {
        await recipeUtil.userGetsRecipes(email, function (data) {
            return callback(data);
        });
    } catch (error) {
    }
}

// Perticular User Recipe GET
recipeController.userRecipe = async function (id, callback) {
    try {
        await recipeUtil.userGetRecipe(id,function(data){
            return callback(data);
        });
    } catch (error) {
    }
}


recipeController.commentValidate=function(comment_text,callback){
    if(comment_text.length<=2){
        return callback(data={status:"ERROR",message:"COMMENT IS NOT VALID"});
    }else{
        return callback(data={status:"OK",message:"COMMENT IS VALID"});
    }
}

recipeController.addComment=async function(body,callback){
    try {
        await recipeUtil.commentAdd(body,function(data){
            return callback(data);
        });
    } catch (error) {
        
    }
}

module.exports = recipeController;