recipeController = require('../controller/recipe.controller');
recipeUtil = require('../utils/recipeUtils');
recipeMiddleware = {};

// Validation Recipe
recipeMiddleware.validation = async function (req, res, next) {
    try {
        if (!req.files) {
            return res.send(data = { status: "ERROR", message: "Please select a recipe image" });
        }

        let recipeImageFileNames = [
            req.files.recipe_image.name,
            req.files.recipe_image.mimetype,
            req.files.recipe_image.size,
            req.files.recipe_image
        ];

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
        if (!req.files) {
            res.send(data = { status: "ERROR", message: "Please select a recipe image" });
        }
        // list [0] orignale File name , [1] filename own modifi
        let recipeImageFileNames = [req.files.recipe_image.name,
        req.files.recipe_image.mimetype,
        req.files.recipe_image.size,
        req.files.recipe_image
        ];

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
        await recipeController.commentValidate(req.body.comment_text,async function (data) {
            if (data.status == "OK") {
                await recipeController.addComment(req.body, function (data) {
                    if (data.status == "ERROR") {
                        return res.status(400).send(data);
                    } else {
                        return res.status(200).send(data);
                    }
                });
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
    await userController.getUserIdToAuthToken(req.headers['user_authtoken'], async function (user) {
        await recipeUtil.userGetRecipe(Number(req.body.recipe_id), user, function (data) {
            if (data.status == "ERROR") {
                return res.status(400).send(data = { status: "ERROR", message: "User is not authorization to recipe deleted" });
            } else {
                next();
            }
        });
    });

}

module.exports = recipeMiddleware;