const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
// const multer = require('multer');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, '../images/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     }
// });

// const upload = multer({ storage: storage });

router.use(bodyParser.urlencoded({ extended: false }));


const commonMiddleware = require('../../shared/middleware/commonMiddleware');
const recipeMiddleware = require('../middleware/recipe_middleware');
const recipeController = require('../controller/recipe.controller');


// Recipe Added
router.post('/add', commonMiddleware.verifyAuthToken, commonMiddleware.bodyCheck,recipeMiddleware.validation);

// Recipe Edited
router.post('/edit', commonMiddleware.verifyAuthToken,commonMiddleware.bodyCheck,recipeMiddleware.validationEdit);

// Recipe Deleted
router.post('/delete', commonMiddleware.verifyAuthToken,commonMiddleware.bodyCheck, async function (req, res) {
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
        if(isNaN(req.query.count)){
            return res.status(400).send({status:"ERROR",message:"Count is not valid"});
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
});

// Single Recipe
router.get('/getrecipe', commonMiddleware.verifyTokenAndGetRecipesDetails, async function (req, res) {
    try {
        await recipeController.recipesGet(Number(req.query.recipe_id), res.user, function (data) {
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
router.post('/select/favorite',commonMiddleware.bodyCheck, commonMiddleware.verifyAuthTokenAndEmail, async function (req, res) {
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
router.post('/userfavorites',commonMiddleware.verifyAuthTokenAndEmail, async function (req, res) {
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
router.post('/myrecipes', commonMiddleware.verifyAuthTokenAndEmail, async function (req, res) {
    try {
        if(isNaN(req.query.count)){
            return res.status(400).send({status:"ERROR",message:"Count is not valid"});
        }
        await recipeController.userRecipes(req.body.user_email,req.query.count,function (data) {
            return res.status(200).send(data);
        });
    } catch (error) {
    }
});

// User Perticular Recipe Get
router.get('/myrecipe', commonMiddleware.verifyAuthToken, async function (req, res) {
    if(req.query.recipe_id === undefined && req.query.recipe_id == ""){
        res.status(400).send(data={status:"ERROR",message:"Recipe id is not get"});
    }
    await recipeController.userRecipe(req.query.recipe_id, function (data) {
        return res.status(200).send(data);
    });
});

// Comment Add
router.post('/comment', commonMiddleware.verifyAuthTokenAndEmail, recipeMiddleware.commentValidation, async function (req, res) {
    try {
        if (res.comment_status == "add") {
            await recipeController.addComment(req.body, function (data) {
                if (data.status == "ERROR") {
                    return res.status(400).send(data);
                } else {
                    return res.status(200).send(data);
                }
            });
        }
        else if (res.comment_status == "show") {
            await recipeController.showComment(req.body.recipe_id, function (data) {
                return res.status(200).send(data);
            });
        }else{
            return res.status(400).send(data={status:"ERROR",message:"Comment status is not valid"});
        }
        if(res.comment_status==undefined){
            return res.status(400).send(data={status:"ERROR",message:"Comment Status is Not Get Please Passed Query in comment status"});
        }
    } catch (error) {
        return res.status(500).send(data = { status: "ERROR", message: "COMMENT ADDED ERROR" });
    }
});

module.exports = router;