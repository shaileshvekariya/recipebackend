const express = require('express');
const router = express.Router();
const fileUpload=require('express-fileupload');


const commonMiddleware = require('../shared/middleware/commonMiddleware');
const recipeMiddleware = require('../middleware/recipe_middleware');

router.use(fileUpload());



// Recipe Added
router.post('/add',commonMiddleware.verifyAuthToken,commonMiddleware.bodyCheck,recipeMiddleware.validation);

// Recipe Edited
router.post('/edit',commonMiddleware.verifyAuthToken,commonMiddleware.bodyCheck,recipeMiddleware.recipeExistsOrNot,recipeMiddleware.validationEdit);

// Recipe Deleted
router.post('/delete', commonMiddleware.verifyAuthToken,commonMiddleware.bodyCheck,recipeMiddleware.recipeExistsOrNot,recipeMiddleware.recipeDelete);

//Recipes Get (Per Request 10 Result)
router.get('/getrecipes', commonMiddleware.verifyTokenAndGetRecipesDetails,recipeMiddleware.recipesGets);

// Single Recipe
router.get('/getrecipe', commonMiddleware.verifyTokenAndGetRecipesDetails,recipeMiddleware.recipeGet);

// Select Favorite Reciped (Removed And Add)
router.post('/select/favorite',commonMiddleware.bodyCheck, commonMiddleware.verifyAuthTokenAndEmail,recipeMiddleware.favorite);

// User Favorite Recipes Gets   
router.get('/userfavorites',commonMiddleware.verifyAuthToken,recipeMiddleware.userFavoriteRecipe);

// user All recipe gets
router.get('/myrecipes', commonMiddleware.verifyAuthToken,recipeMiddleware.userRecipes);

// User Perticular Recipe Get
router.get('/myrecipe', commonMiddleware.verifyAuthToken,recipeMiddleware.userRecipe);

// Comment Add
router.post('/comment', commonMiddleware.verifyAuthTokenAndEmail,recipeMiddleware.commentCheckAndAdd);

router.use((error,req,res,next)=>{
    if(error){
        res.status(500).send(data={status:"ERROR",message:error.message});
    }
});;

module.exports = router;