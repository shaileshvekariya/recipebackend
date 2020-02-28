recipeController = require('../controller/recipe.controller');

recipeMiddleware = {};

// Validation Recipe
recipeMiddleware.validation = async function (req, res, next) {
    try {
        await recipeController.validateRecipe(req.body, req.headers.user_authtoken, function (data) {
            if (data.status == "OK") {
                res.status(200).send(data);
                next();
            } else {
                return res.status(400).send(data);
            }
        });
    } catch (error) {
        return res.status(500).send({status:"ERROR",message:"Recipemiddleware validation Error"});
    }
}

// validation on Edit Recipes
recipeMiddleware.validationEdit = async function (req, res, next) {
    try {
        await recipeController.validationEdit(req.body, function (data) {
            if(data.status=="OK"){
                res.status(200).send(data);
                next();
            }else{
                return res.status(400).send(data);
            }
        });
    } catch (error) {
        return res.status(500).send({status:"ERROR",message:"Recipemiddleware validationEdit Error"});
    }
}

// Recipe Comment Validation
recipeMiddleware.commentValidation = async function (req, res, next) {
    try {
        await recipeController.commentValidate(req.body.comment_text, function (data) {
            if (data.status == "OK") {
                next();
            } else {
                return res.status(400).send(data);
            }
        });
    } catch (error) {

    }
}

module.exports = recipeMiddleware;