const DataBaseConnection=require('../middleware/connection');
const recipe=require('../model/recipe.model');
recipeUtil={};

recipeUtil.addRecipe=async function(body,callback){

    recipe.recipe_name=body.recipe_name;
    recipe.type_id=Number(body.type_id);
    recipe.recipe_level=body.recipe_level;
    recipe.recipe_cookingtime=Number(body.recipe_cookingtime);
    recipe.recipe_ingredients=body.recipe_ingredients;
    recipe.recipe_steps=body.recipe_steps;
    recipe.recipe_people=Number(body.recipe_people);
    recipe.recipe_image=body.recipe_image;
    recipe.user_id=Number(body.user_id);
    recipe.recipe_description=body.recipe_description;

    await DataBaseConnection.query("INSERT INTO recipes SET ?",recipe,function(error,rows){
            if(error){
                console.log(error);
                return  callback(data={status:"ERROR",message:"RECIPE NOT ADDED"});
            }else{
                return  callback(data={status:"OK",message:"RECIPE ADDED"});
            }
    });
}

recipeUtil.editRecipe=async function(body,callback){
    recipe.recipe_name=body.recipe_name;
    recipe.type_id=Number(body.type_id);
    recipe.recipe_level=body.recipe_level;
    recipe.recipe_cookingtime=Number(body.recipe_cookingtime);
    recipe.recipe_ingredients=body.recipe_ingredients;
    recipe.recipe_steps=body.recipe_steps;
    recipe.recipe_people=Number(body.recipe_people);
    recipe.recipe_image=body.recipe_image;
    recipe_id=body.recipe_id;

    let value=[recipe.recipe_name,recipe.type_id,recipe.recipe_level,recipe.recipe_cookingtime,recipe.recipe_ingredients,recipe.recipe_steps,recipe.recipe_people,recipe.recipe_image,recipe_id];
    let sqlQuery="UPDATE recipes SET recipe_name=? ,type_id=? ,recipe_level=? ,recipe_cookingtime=? ,recipe_ingredients=? ,recipe_steps=? ,recipe_people=? ,recipe_image=? where recipe_id=?";

    await DataBaseConnection.query(sqlQuery,value,function(error,result){
        if(error){
            return  callback(data={status:"ERROR",message:"RECIPE NOT EDITED"});
        }
        if(result.affectedRows==1){
            return  callback(data={status:"OK",message:"RECIPE EDITED SUCCESSFULLY"});
        }else{
            return  callback(data={status:"ERROR",message:"RECIPE NOT EXISTED"});
        }
    });
}

recipeUtil.deleteRecipe=async function(id,callback){

    let sqlQuery=`delete from recipes where recipe_id=${id}`;
    await DataBaseConnection.query(sqlQuery,function(error,result){
        if(error){
            console.log(error);
            return  callback(data={status:"ERROR",message:"ERROR"});
        }
        if(result.affectedRows==1){
            return  callback(data={status:"OK",message:"RECIPE DELETED"});
        }else{
            return  callback(data={status:"ERROR",message:"RECIPE NOT DELETED"});
        }
    });
}

recipeUtil.getRecipes=async function(count,callback){
    let countLimit=Number(count)+10;
    let sqlQuery=`SELECT recipe_id,recipe_name,type_id,recipe_level,recipe_cookingtime,
    recipe_image,recipe_description from recipes LIMIT ${count},${countLimit}`;
    await DataBaseConnection.query(sqlQuery,function(error,result){
        if(error){
            console.log(error);
        }
        return callback(result);
    });
}

recipeUtil.getRecipe=async function(id,callback){
    let sqlQuery=`SELECT recipe_id,recipe_name,type_id,recipe_level,recipe_cookingtime,recipe_ingredients,recipe_steps,recipe_people,recipe_image,recipe_description from recipes where recipe_id=${id}`;

    await DataBaseConnection.query(sqlQuery,function(error,result){
        if(error){
            return callback(data={status:"ERROR",message:"RECIPE NOT GET"});
        }
        if(result.length==0){
            return callback(data={status:"ERROR",message:"RECIPE NOT FOUND"});
        }else{
            return callback(result[0]);
        }
    });
}

module.exports=recipeUtil;