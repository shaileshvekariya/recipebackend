const recipe=require('../model/recipe.model');

function validationRecipe(body,recipeImage,mimetype,fileSize){


    let data={};
    
    recipe.recipe_name=body.recipe_name;
    recipe.type_id=Number(body.type_id);
    recipe.recipe_level=body.recipe_level;
    recipe.recipe_cookingtime=body.recipe_cookingtime;
    recipe.recipe_ingredients=body.recipe_ingredients;
    recipe.recipe_steps=body.recipe_steps;
    recipe.recipe_people=Number(body.recipe_people);
    recipe.recipe_image=recipeImage;
    recipe.recipe_description=body.recipe_description;

    let regexRecipe = /^[A-Za-z]+$/;
    

    
    if((recipe.recipe_name.length<=2 
        || recipe.recipe_name.length>=50 
        || recipe.recipe_name.indexOf(' ')>=0
        || !isNaN(recipe.recipe_name))
        || !regexRecipe.test(recipe.recipe_name)
        ){
        return data.recipeNameError={status:"ERROR",message:"RECIPE NAME IS NOT VALID (Don't space between name)"};
    }

    if(isNaN(recipe.type_id) || recipe.type_id==""){
        return data.recipeTypeError={status:"ERROR",message:"RECIPE TYPE ID IS NOT VALID"}
    }

    if(!['hard','medium','easy'].includes((recipe.recipe_level).toLowerCase()) || recipe.recipe_level=="" ){
        return data.recipeLevelError={status:"ERROR",message:"RECIPE LEVEL IS NOT VALID (Easy, Medium, Hard)"}
    }

    if(isNaN(recipe.recipe_cookingtime) || recipe.recipe_cookingtime==""){
        return data.recipeCookingtimeError={status:"ERROR",message:"RECIPE COOKINGTIME NOT VALID"}
    }

    if((recipe.recipe_ingredients).length<=50 || recipe.recipe_ingredients==""){
        return data.recipeIngredientsError={status:"ERROR",message:"ADD RECIPE INGREDIENTS MORE CONTENT"};
    }

    if((recipe.recipe_steps).length<=50 || recipe.recipe_steps==""){
        return data.recipeStepError={status:"ERROR",message:"ADD MORE RECIPE STEP ENTER"};
    }

    if(isNaN(recipe.recipe_people) || recipe.recipe_people=="" ||
        recipe.recipe_people>20 || recipe.recipe_people<1
    ){
        return data.recipePeopleError={status:"ERROR",message:"RECIPE PEOPLE IS NOT VALID"}
    }

    if((!isNaN(recipe.recipe_image) || recipe.recipe_image.lastIndexOf('.')==-1) ||
    recipe.recipe_image==""||
    !["jpeg","jpg","png"].includes(recipe.recipe_image.substring(recipe.recipe_image.lastIndexOf('.')+ 1).toLowerCase())){
        if(mimetype!=="image/jpeg" && mimetype !== "image/jpeg" && mimetype!=="image/png"){
            return callback(data.recipeImageError={status:"ERROR",message:"Only image allow format(jpeg,jpg,png)"});
        }
        if(fileSize>=2000000){
            return callback(data.recipeImageError={status:"ERROR",message:"Image File is Greater then a 2 MB upload a small file"});
        }
        return data.recipeImageError={status:"ERROR",message:"RECIPE IMAGE IS NOT VALID Formet(JPG JPEG PNG)"}
    }

    if(recipe.recipe_description.length<=0 || recipe.recipe_description.length>=50){
        return data.recipeDescriptionError={status:"ERROR",message:"RECIPE DESCRIPTION NOT VALID"};
    }
    return data;
}

module.exports=validationRecipe;