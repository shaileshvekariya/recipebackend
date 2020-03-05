recipeController = require('../controller/recipe.controller');
recipeUtil = require('../utils/recipeUtils');
recipeMiddleware = {};

// Validation Recipe
recipeMiddleware.validation = async function (req, res, next) {
    try {
        if (req.files.length == 0) {
            res.send(data = { status: "ERROR", message: "Please select a recipe image" });
        }

        // list [0] orignale File name , [1] filename own modifi
        let recipeImageFileNames = [req.files[0].originalname, req.files[0].filename];
        await recipeController.validateRecipe(req.body, req.headers.user_authtoken, recipeImageFileNames, function (data) {
            if (data.status == "OK") {
                res.status(200).send(data);
                next();
            } else {
                return res.status(400).send(data);
            }
        });
    } catch (error) {
        return res.status(500).send({ status: "ERROR", message: "Recipemiddleware validation Error" });
    }
}

// validation on Edit Recipes
recipeMiddleware.validationEdit = async function (req, res, next) {
    try {
        if (req.files.length == 0) {
            res.send(data = { status: "ERROR", message: "Please select a recipe image" });
        }
        // list [0] orignale File name , [1] filename own modifi
        let recipeImageFileNames = [req.files[0].originalname, req.files[0].filename];
        await recipeController.validationEdit(req.body, recipeImageFileNames, function (data) {
            if (data.status == "OK") {
                res.status(200).send(data);
                next();
            } else {
                return res.status(400).send(data);
            }
        });
    } catch (error) {
        return res.status(500).send({ status: "ERROR", message: "Recipemiddleware validationEdit Error" });
    }
}

// Recipe Comment Validation
recipeMiddleware.commentValidation = async function (req, res, next) {
    try {
        await recipeController.commentValidate(req.body.comment_text, function (data) {
            if (data.status == "OK") {
                res.comment_status = req.query.comment_status;
                next();
            } else {
                return res.status(400).send(data);
            }
        });
    } catch (error) {

    }
}

// Recipe IS EXISTS OR NOT
recipeMiddleware.recipeExistsOrNot = async function (req, res, next) {
    recipeUtil.userGetRecipe(req.body.recipe_id, function (data) {
        if(data.status=="ERROR"){
            return res.status(400).send(data);
        }else{
            next();
        }
    });
}

module.exports = recipeMiddleware;