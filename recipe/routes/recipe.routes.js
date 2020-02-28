const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));

const commonMiddleware = require('../../shared/middleware/commonMiddleware');
const recipeMiddleware = require('../middleware/recipe_middleware');
const recipeController = require('../controller/recipe.controller');


// Recipe Added
router.post('/add', commonMiddleware.verifyAuthToken, recipeMiddleware.validation, function (req, res) {
});

// Recipe Edited
router.post('/edit', commonMiddleware.verifyAuthToken, recipeMiddleware.validationEdit, function (req, res) {
});

// Recipe Deleted
router.post('/delete', commonMiddleware.verifyAuthToken, async function (req, res) {
    try {
        await recipeController.recipeDelete(req.body.recipe_id, function (data) {
            if (data.status == "OK") {
                res.status(200).send(data);
            } else {
                res.status(400).send(data);
            }
        });
    } catch (error) {

    }
});

//Recipes Get (Per Request 10 Result)
router.get('/getrecipes', commonMiddleware.verifyTokenAndGetRecipesDetails, async function (req, res) {
    try {
        await recipeController.recipesGets(req.query.count, res.user, function (data) {
            if (data.status == "ERROR") {
                res.status(400).send(data);
            } else {
                res.status(200).send(data);
            }
        });
    } catch (error) {

    }
});

// Single Recipe
router.get('/getrecipe', commonMiddleware.verifyTokenAndGetRecipesDetails, async function (req, res) {
    try {
        await recipeController.recipesGet(Number(req.query.recipe_id),res.user, function (data) {
            if (data.status == "ERROR") {
                res.status(400).send(data);
            } else {
                res.status(200).send(data);
            }
        });
    } catch (error) {
    }
});

// Select Favorite Reciped (Removed And Add)
router.post('/select/favorite', commonMiddleware.verifyAuthToken, async function (req, res) {
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
});

// User Favorite Recipes Gets
router.post('/userfavorites', commonMiddleware.verifyAuthToken, async function (req, res) {
    try {
        await recipeController.userFavoriteRecipe(req.body.user_email, function (data) {
            if (data.status == "ERROR") {
                res.status(400).send(data);
            } else {
                res.status(200).send(data);
            }
        });
    } catch (error) {

    }
});

// user All recipe gets
router.post('/myrecipes', commonMiddleware.verifyAuthToken, async function (req, res) {
    try {
        await recipeController.userRecipes(req.body.user_email, function (data) {
            return res.status(200).send(data);
        });
    } catch (error) {
    }
});

// User Perticular Recipe Get
router.get('/myrecipe', commonMiddleware.verifyAuthToken, async function (req, res) {
    await recipeController.userRecipe(req.query.recipe_id, function (data) {
        return res.status(200).send(data);
    });
});

// Comment Add
router.post('/comment', commonMiddleware.verifyAuthToken, recipeMiddleware.commentValidation, async function (req, res) {
    try {
        await recipeController.addComment(req.body, function (data) {
            if (data.status == "ERROR") {
                return res.status(400).send(data);
            } else {
                return res.status(200).send(data);
            }
        });
    } catch (error) {
        return res.status(500).send(data = { status: "ERROR", message: "COMMENT ADDED ERROR" });
    }
});

module.exports = router;