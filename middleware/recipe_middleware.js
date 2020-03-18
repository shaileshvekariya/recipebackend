recipeController = require('../controller/recipe.controller');
recipeUtil = require('../utils/recipeUtils');
commonFunction = require('../shared/commonFunction/commonFunction');
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
                // next();
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
        if (req.body.comment_text == undefined) {
            return res.status(400).send(data = { status: "ERROR", message: "comment_text data not get" });
        }
        await recipeController.commentValidate(req.body.comment_text, async function (data) {
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
    if (req.body.recipe_id == '' || req.body.recipe_id == undefined) {
        return res.status(400).send(data = { status: "ERROR", message: "Select Recipe (recipe id is not get)" });
    } else {
        await userController.getUserIdToAuthToken(req.headers['user_authtoken'], async function (user) {
            await recipeUtil.userGetRecipe(Number(req.body.recipe_id), user, function (data) {
                if (data.status == "ERROR") {
                    return res.status(400).send(data = { status: "ERROR", message: "User is not authorization to this recipe" });
                } else {
                    next();
                }
            });
        });
    }
}



// Recipe Deleted
recipeMiddleware.recipeDelete = async function (req, res, next) {
    try {
        await recipeController.recipeDelete(Number(req.body.recipe_id), function (data) {
            if (data.status == "OK") {
                res.status(200).send(data);
            } else {
                res.status(400).send(data);
            }
        });
    } catch (error) {
    }
}

// Recipe Gets (Per request 10 Result)
recipeMiddleware.recipesGets = async function (req, res, next) {
    try {
        if (isNaN(req.query.count)) {
            return res.status(400).send({ status: "ERROR", message: "Count is not valid format" });
        }
        await recipeController.recipesGets(req.query.count, res.user, function (data) {
            if (data.status == "ERROR") {
                res.status(400).send(data);
            } else {
                res.status(200).send(data);
            }
        });
    } catch (error) {
    }
}

// Single Recipe
recipeMiddleware.recipeGet = async function (req, res, next) {
    try {
        if (isNaN(req.query.recipe_id)) {
            return res.status(400).send({ status: "ERROR", message: "Recipe_id is not valid format" });
        }
        await recipeController.recipeGet(Number(req.query.recipe_id), res.user, function (data) {
            if (data.status == "ERROR") {
                res.status(400).send(data);
            } else {
                res.status(200).send(data);
            }
        });
    } catch (error) {
    }
}

// favoritre Recipe (Add OR remove )
recipeMiddleware.favorite = async function (req, res, next) {
    try {
        await recipeController.favorite(req.body, (data) => {
            if (data.status == "ERROR") {
                res.status(400).send(data);
            } else {
                res.status(200).send(data);
            }
        });
    } catch (error) {
    }
}

// User Favorite Recipes Gets 
recipeMiddleware.userFavoriteRecipe = async function (req, res, next) {
    try {
        commonFunction.emailExists(req.query.user_email, async function (data) {
            if (data.status == "ERROR") {
                res.status(400).send(data);
            } else {
                await recipeController.userFavoriteRecipe(req.query.user_email, function (data) {
                    if (data.status == "ERROR") {
                        res.status(400).send(data);
                    } else {
                        res.status(200).send(data);
                    }
                });
            }
        });
    } catch (error) {
    }
}

// user All recipe gets
recipeMiddleware.userRecipes = async function (req, res, next) {
    try {
        if (isNaN(req.query.count)) {
            return res.status(400).send({ status: "ERROR", message: "Count is not valid" });
        }
        commonFunction.emailExists(req.query.user_email, async function (data) {
            if (data.status == "ERROR") {
                res.status(400).send(data);
            } else {
                await recipeController.userRecipes(req.query.user_email, req.query.count, function (data) {
                    return res.status(200).send(data);
                });
            }
        });
    } catch (error) {
    }
}

// User Perticular Recipe Get
recipeMiddleware.userRecipe = async function (req, res, next) {
    if (req.query.recipe_id === undefined && req.query.recipe_id == "") {
        res.status(400).send(data = { status: "ERROR", message: "Recipe id is not get" });
    }
    await recipeController.userRecipe(req.query.recipe_id, req.headers['user_authtoken'], function (data) {
        return res.status(200).send(data);
    });
}

// Comment Add
recipeMiddleware.commentCheckAndAdd = async function (req, res, next) {
    try {
        if (req.query.comment_status == "add") {
            data = await recipeMiddleware.commentValidation(req, res);
        }
        else if (req.query.comment_status == "show") {
            await recipeController.showComment(req.body.recipe_id, function (data) {
                return res.status(200).send(data);
            });
        } else {
            return res.status(400).send(data = { status: "ERROR", message: "Comment status is not valid" });
        }
        if (req.query.comment_status == undefined) {
            return res.status(400).send(data = { status: "ERROR", message: "Comment Status is Not Get Please Passed Query in comment status" });
        }
    } catch (error) {
        return res.status(500).send(data = { status: "ERROR", message: "COMMENT ADDED ERROR" });
    }
}

module.exports = recipeMiddleware;