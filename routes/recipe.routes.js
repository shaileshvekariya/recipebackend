const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));

const middleware = require('../middleware/middleware');
const recipeMiddleware = require('../middleware/recipe_middleware');
const recipeController = require('../controller/recipe.controller');


// Recipe Added
router.post('/add', middleware.verifyToken, recipeMiddleware.validation, function (req, res) {
});

// Recipe Edited
router.post('/edit', middleware.verifyToken, recipeMiddleware.validationEdit, function (req, res) {
});

// Recipe Deleted
router.post('/delete', middleware.verifyToken, async function (req, res) {
    await recipeController.recipeDelete(req.body.recipe_id, function (data) {
        res.send(data);
    });
});

//Recipes Get (Per Request 10 Result)
router.post('/getrecipes', middleware.verifyToken, async function (req, res) {
    await recipeController.recipesGets(req.body.count, function (data) {
        res.send(data);
    });
});

// Single Recipe
router.post('/getrecipe', middleware.verifyToken, function (req, res) {
    recipeController.recipesGet(req.body.recipe_id, function (data) {
        res.send(data);
    });
});

// Select Favorite Reciped (Removed And Add)
router.post('/select/favorite', middleware.verifyToken, async function (req, res) {
    await recipeController.favorite(req.body, (data) => {
        res.send(data);
    });
});


// user All recipe gets
router.post('/myrecipes', middleware.verifyToken, async function (req, res) {
    try {
        await recipeController.userRecipes(req.body.user_email, function (data) {
            return res.send(data);
        });
    } catch (error) {
    }
});

// User Perticular Recipe Get
router.post('/myrecipe', middleware.verifyToken, async function (req, res) {
    await recipeController.userRecipe(req.body.recipe_id, function (data) {
        return res.send(data);
    });
});

// Comment Add
router.post('/comment', middleware.verifyToken, recipeMiddleware.commentValidation, async function (req, res) {
    try {
        await recipeController.addComment(req.body, function (data) {
            return res.send(data);
        });
    } catch (error) {
            return res.send(data={status:"ERROR",message:"COMMENT ADDED ERROR"});
    }
});


module.exports = router;