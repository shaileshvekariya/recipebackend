const recipe=require('../recipe/model/recipe.model');

function validationRecipe(body,recipeImage){


    let data={};
    
    recipe.recipe_name=body.recipe_name;
    recipe.type_id=Number(body.type_id);
    recipe.recipe_level=body.recipe_level;
    recipe.recipe_cookingtime=body.recipe_cookingtime;
    recipe.recipe_ingredients=body.recipe_ingredients;
    recipe.recipe_steps=body.recipe_steps;
    recipe.recipe_people=body.recipe_people;
    recipe.recipe_image=recipeImage;
    recipe.recipe_description=body.recipe_description;

    let regexRecipe = /^[A-Za-z]+$/;
    

    
    if((recipe.recipe_name.length<=2 
        || recipe.recipe_name.length>=50 
        || recipe.recipe_name.indexOf(' ')>=0
        || !isNaN(recipe.recipe_name))
        || !regexRecipe.test(recipe.recipe_name)
        ){
        return data.data1={status:"ERROR",message:"RECIPE NAME IS NOT VALID (Don't space between name)"};
    }

    if(isNaN(recipe.type_id) || recipe.type_id==""){
        return data.data2={status:"ERROR",message:"RECIPE TYPE ID IS NOT VALID"}
    }

    if(!['hard','medium','easy'].includes((recipe.recipe_level).toLowerCase()) || recipe.recipe_level=="" ){
        return data.data3={status:"ERROR",message:"RECIPE LEVEL IS NOT VALID (Easy, Medium, Hard)"}
    }

    if(isNaN(recipe.recipe_cookingtime) || recipe.recipe_cookingtime==""){
        return data.data4={status:"ERROR",message:"RECIPE COOKINGTIME NOT VALID"}
    }

    if((recipe.recipe_ingredients).length<=50 || recipe.recipe_ingredients==""){
        return data.data5={status:"ERROR",message:"ADD RECIPE INGREDIENTS MORE CONTENT"};
    }

    if((recipe.recipe_steps).length<=50 || recipe.recipe_steps==""){
        return data.data6={status:"ERROR",message:"ADD MORE RECIPE STEP ENTER"};
    }

    if(isNaN(recipe.recipe_people) || recipe.recipe_people==""){
        return data.data7={status:"ERROR",message:"RECIPE PEOPLE IS NOT VALID"}
    }

    if((!isNaN(recipe.recipe_image) || recipe.recipe_image.lastIndexOf('.')==-1) ||
    recipe.recipe_image==""||
    !["jpeg","jpg","png"].includes(recipe.recipe_image.substring(recipe.recipe_image.lastIndexOf('.')+ 1).toLowerCase())){
        return data.data8={status:"ERROR",message:"RECIPE IMAGE IS NOT VALID Formet(JPG JPEG PNG)"}
    }

    if(recipe.recipe_description.length<=0 || recipe.recipe_description.length>=50){
        return data.data9={status:"ERROR",message:"RECIPE DESCRIPTION NOT VALID"};
    }
    return data;
}

module.exports=validationRecipe;