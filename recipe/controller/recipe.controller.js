validationRecipe = require('../utils/recipeValidation');
recipeUtil = require('../utils/recipeUtils');
conn=require('../../connection/connection');
recipeController = {};

// Validation Recipe And Add Recipe
recipeController.validateRecipe = async function (body, auth_token,recipeImageFileNames,callback) {
    try {
        // [0] = NAME  [1]=mimetype [2]=size [3]=fullImage
        data = await validationRecipe(body,recipeImageFileNames[0],recipeImageFileNames[1],recipeImageFileNames[2]);
        if (Object.entries(data).length == 0) {
            let recipe_image_name=Date.now()+"-"+recipeImageFileNames[0];
            recipeImageFileNames[3].mv('public/recipeimages/'+recipe_image_name);
            data = await recipeUtil.addRecipe(body, auth_token,recipe_image_name,function (data) {
                return callback(data);
            });
        } else {
            return callback(data);
        };
    } catch (error) {
        console.log(error);
        return callback({ status: "ERROR", message: "Recipe Controller Validation Error" });
    }
}

// Validation Recipe And Edit Recipe
recipeController.validationEdit = async function (body,recipeImageFileNames,callback) {
    try {
         // [0] = NAME  [1]=mimetype [2]=size [3]=fullImage
        data = await validationRecipe(body,recipeImageFileNames[0],recipeImageFileNames[1],recipeImageFileNames[2]);
        if (Object.entries(data).length == 0) {
            let recipe_image_name=Date.now()+"-"+recipeImageFileNames[0];
            data = await recipeUtil.editRecipe(body,recipe_image_name,recipeImageFileNames[3],function (data) {
                return callback(data);
            });
        } else {
            return callback(data);
        };
    } catch (error) {
        return callback({ status: "ERROR", message: "Recipe Controller ValidationEdit Error" });
    }
}

// Recipe Delete
recipeController.recipeDelete = async function (id, callback) {
    try {
        await recipeUtil.deleteRecipe(id, function (data) {
            return callback(data);
        });   
    } catch (error) {
        return callback({ status: "ERROR", message: "Recipe Controller RecipeDelete Error" });
    }
}

// All Recipes Gets (with user login or not login)
recipeController.recipesGets = async function (count, user, callback) {
    try {
        await recipeUtil.getRecipes(Number(count), user, function (data) {
            return callback(data);
        });    
    } catch (error) {
        return callback({ status: "ERROR", message: "Recipe Controller All Recipe Gets Error" });
    }
    
}

// single recipes get(with user login or not login)
recipeController.recipesGet = async function (id,user,callback) {
    try {
        await recipeUtil.getRecipe(id,user,function (data) {
            return callback(data);
        });    
    } catch (error) {
        return callback({ status: "ERROR", message: "Recipe Controller All Sigle Recipe Get Error" });
    }
}

// Add or Remove favorite recipe
recipeController.favorite = async function (body, callback) {
    try {
        if(body.favorite=="" || body.recipe_id==""){
            return callback({ status: "ERROR", message: "Favorite and recipe_id is not get" });
        }
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
        return callback({ status: "ERROR", message: "Recipe Controller Favorite Error" });
    }
}

// Perticular user favorite Recipe
recipeController.userFavoriteRecipe = async function (email, callback) {
    try {
        await recipeUtil.userFavoriteRecipe(email, function (data) {
            return callback(data);
        });
    } catch (error) {
        return callback({ status: "ERROR", message: "Recipe Controller User Favorite Recipe" });
    }
}


// all perticular user all recipes get
recipeController.userRecipes = async function (email,count, callback) {
    try {
        await recipeUtil.userGetsRecipes(email,count, function (data) {
            return callback(data);
        });
    } catch (error) {
        return callback({ status: "ERROR", message: "Recipe Controller User Recipes Controller" });
    }
}

// perticular user single recipes get
recipeController.userRecipe = async function (id,auth_token,callback) {
    try {
        userController.getUserIdToAuthToken(auth_token,async function(data){
            await recipeUtil.userGetRecipe(id,data,function (data) {
                return callback(data);
            });
        });
    } catch (error) {
        return callback({ status: "ERROR", message: "Recipe Controller Perticular User Recipe Get Controller" });
    }
}

// recipe comment validation check
recipeController.commentValidate = function (comment_text, callback) {
    if (comment_text.length < 1  && comment_text=="") {
        return callback(data = { status: "ERROR", message: "COMMENT IS NOT VALID" });
    } else {
        return callback(data = { status: "OK", message: "COMMENT IS VALID" });
    }
}

// any recipes to comment add
recipeController.addComment = async function (body, callback) {
    try {
        await recipeUtil.commentAdd(body, function (data) {
            return callback(data);
        });
    } catch (error) {
        return callback({ status: "ERROR", message: "Recipe Controller Add Comment Error" });
    }
}

// only Show Comment Perticular recipe ID
recipeController.showComment=async function(id,callback){
    try {
        recipeUtil.commentShow(id,function(data){
            return callback(data);
        });
    } catch (error) {
    }
}

module.exports = recipeController;