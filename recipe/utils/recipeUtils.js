const DataBaseConnection = require('../../connection/connection');
const recipe = require('../model/recipe.model');
recipeUtil = {};

// Add Recipe
recipeUtil.addRecipe = async function (body, callback) {
    try {
        recipe.recipe_name = body.recipe_name;
        recipe.type_id = Number(body.type_id);
        recipe.recipe_level = body.recipe_level;
        recipe.recipe_cookingtime = Number(body.recipe_cookingtime);
        recipe.recipe_ingredients = body.recipe_ingredients;
        recipe.recipe_steps = body.recipe_steps;
        recipe.recipe_people = Number(body.recipe_people);
        recipe.recipe_image = body.recipe_image;
        recipe.user_id = Number(body.user_id);
        recipe.recipe_description = body.recipe_description;

        await DataBaseConnection.query("INSERT INTO recipes SET ?", recipe, function (error, rows) {
            if (!error) {
                return callback(data = { status: "OK", message: "RECIPE ADDED" });
            }
        });
    } catch (error) {
        return callback(data = { status: "ERROR", message: "RECIPE NOT ADDED" });
    }

}

// Edit Recipe
recipeUtil.editRecipe = async function (body, callback) {

    try {
        recipe.recipe_name = body.recipe_name;
        recipe.type_id = Number(body.type_id);
        recipe.recipe_level = body.recipe_level;
        recipe.recipe_cookingtime = Number(body.recipe_cookingtime);
        recipe.recipe_ingredients = body.recipe_ingredients;
        recipe.recipe_steps = body.recipe_steps;
        recipe.recipe_people = Number(body.recipe_people);
        recipe.recipe_image = body.recipe_image;
        recipe_id = body.recipe_id;

        let value = [recipe.recipe_name, recipe.type_id, recipe.recipe_level, recipe.recipe_cookingtime, recipe.recipe_ingredients, recipe.recipe_steps, recipe.recipe_people, recipe.recipe_image, recipe_id];
        let sqlQuery = "UPDATE recipes SET recipe_name=? ,type_id=? ,recipe_level=? ,recipe_cookingtime=? ,recipe_ingredients=? ,recipe_steps=? ,recipe_people=? ,recipe_image=? where recipe_id=?";

        await DataBaseConnection.query(sqlQuery, value, function (error, result) {
            if (!error) {
                if (result.affectedRows == 1) {
                    return callback(data = { status: "OK", message: "RECIPE EDITED SUCCESSFULLY" });
                } else {
                    return callback(data = { status: "ERROR", message: "RECIPE NOT EXISTED" });
                }
            }
        });
    } catch (error) {
        return callback(data = { status: "ERROR", message: "RECIPE NOT EDITED" });
    }


}

// Delete Recipe
recipeUtil.deleteRecipe = async function (id, callback) {
    try {
        let sqlQuery = `delete from recipes where recipe_id=${id}`;
        await DataBaseConnection.query(sqlQuery, function (error, result) {
            if (!error) {
                if (result.affectedRows == 1) {
                    return callback(data = { status: "OK", message: "RECIPE DELETED" });
                } else {
                    return callback(data = { status: "ERROR", message: "RECIPE NOT DELETED" });
                }
            }
        });
    } catch (error) {
        return callback(data = { status: "ERROR", message: "ERROR" });
    }
}

// Get All Recipes
recipeUtil.getRecipes = async function (count, callback) {

    try {
        let countLimit = Number(count) + 10;
        let sqlQuery = `SELECT COUNT(f.recipe_id) AS favoriteCount,
        r.recipe_id,
        r.recipe_name,
        r.type_id,
        r.recipe_level,
        r.recipe_cookingtime,
        r.recipe_image
        FROM recipes r
        LEFT JOIN favorite f ON r.recipe_id=f.recipe_id
        GROUP BY r.recipe_id LIMIT ${count},${countLimit}`;
        // let sqlQuery = `SELECT recipe_id,recipe_name,type_id,recipe_level,recipe_cookingtime,recipe_image,recipe_description from recipes `;
        await DataBaseConnection.query(sqlQuery, function (error, result) {
            if (!error) {
                return callback(result);
            } else {
                return callback(data = { status: "OK", message: "Please Pass a Count Data" });
            }
        });
    } catch (error) {
        console.log(error);
    }
}

// Get Single Recipe
recipeUtil.getRecipe = async function (id, callback) {

    try {
        let sqlQuery = `SELECT recipe_id,recipe_name,type_id,recipe_level,recipe_cookingtime,recipe_ingredients,recipe_steps,recipe_people,recipe_image,recipe_description from recipes where recipe_id=${id}`;
        await DataBaseConnection.query(sqlQuery, function (error, result) {
            if (!error) {
                if (result.length == 0) {
                    return callback(data = { status: "ERROR", message: "RECIPE NOT FOUND" });
                } else {
                    return callback(result[0]);
                }

            }

        });
    } catch (error) {
        return callback(data = { status: "ERROR", message: "RECIPE NOT GET" });
    }
}

// AddFavorite Recipe
recipeUtil.addFavorite = async function (body, callback) {
    try {
        let sqlQueryUser_ID = `select user_id from user where user_email='${body.user_email}'`;
        await DataBaseConnection.query(sqlQueryUser_ID, async function (error, result) {
            let user_id = result[0].user_id;


            let sqlCheck = `SELECT COUNT(*) AS count FROM favorite where recipe_id=${body.recipe_id} AND user_id=${user_id}`;
            await DataBaseConnection.query(sqlCheck, async function (error, result) {
                if (result[0].count >= 1) {
                    return callback(data = { status: "OK", message: "Favorite Recipe Alredy Exists" });
                } else {
                    let sqlQuery = `INSERT INTO favorite (recipe_id,user_id) VALUES (${body.recipe_id},${user_id}) `;
                    await DataBaseConnection.query(sqlQuery, function (error, result) {
                        if (result.affectedRows === 1) {
                            return callback(data = { status: "OK", message: "Favorite Recipe Added" });
                        } else {
                            return callback(data = { status: "ERROR", message: "Favorite is Not Add" });
                        }
                    });
                };
            });
        });
    } catch (error) {
        return callback(data = { status: "ERROR", message: "ERROR" });
    }
}

// Favorite Remove 
recipeUtil.removeFavorite = async function (body, callback) {
    try {
        let sqlQueryUser_ID = `select user_id from user where user_email='${body.user_email}'`;
        await DataBaseConnection.query(sqlQueryUser_ID, async function (error, result) {
            let user_id = result[0].user_id;

            let sqlQuery = `DELETE FROM favorite where user_id=${user_id} AND recipe_id=${body.recipe_id}`;
            await DataBaseConnection.query(sqlQuery, function (error, result) {
                console.log(result);
                if (result.affectedRows === 1) {
                    return callback(data = { status: "OK", message: "Favorite Recipe Removed" });
                } else {
                    return callback(data = { status: "ERROR", message: "Favorite Recipe is Not Exists" });
                }
            });
        });
    } catch (error) {
        return callback(data = { status: "ERROR", message: "ERROR" });
    }
}

// User Favorite Recipe List Display
recipeUtil.userFavoriteRecipe = async function (email, callback) {
    try {
        let sqlQueryUser_ID = `select user_id from user where user_email='${email}'`;
        await DataBaseConnection.query(sqlQueryUser_ID, async function (error, result) {
            let user_id = result[0].user_id;

            let sqlQuery = `SELECT `;
            await DataBaseConnection.query(sqlQuery, function (error, result) {
                console.log(result);
                if (result.affectedRows === 1) {
                    return callback(data = { status: "OK", message: "Favorite Recipe Removed" });
                } else {
                    return callback(data = { status: "ERROR", message: "Favorite Recipe is Not Exists" });
                }
            });
        });
    } catch (error) {

    }
}

// GETS ALL USER RECIPES
recipeUtil.userGetsRecipes = async function (email, callback) {
    try {
        let sqlQueryUser_ID = `select user_id from user where user_email='${email}'`;
        await DataBaseConnection.query(sqlQueryUser_ID, async function (error, result) {
            let user_id = result[0].user_id;

            let sqlQuery = `SELECT recipe_id,recipe_name,type_id,recipe_level,recipe_cookingtime,recipe_image,recipe_description from recipes where user_id=${user_id}`;
            await DataBaseConnection.query(sqlQuery, function (error, result) {
                if (result.length <= 0) {
                    return callback(data = { status: "OK", message: "This User Not Any Existing Recipe" });
                } else {
                    return callback(result);
                }
            });
        });
    } catch (error) {
        return callback(data = { status: "ERROR", message: "GET ALL USERS RECIPE ERROR" });
    }
}

// Get Single Recipe Perticular User
recipeUtil.userGetRecipe = async function (id, callback) {
    try {
        let sqlQuery = `SELECT recipe_id,recipe_name,type_id,recipe_level,recipe_cookingtime,recipe_ingredients,recipe_steps,recipe_people,recipe_image,recipe_created,recipe_description FROM recipes where recipe_id=${id}`;
        await DataBaseConnection.query(sqlQuery, function (error, rows) {
            if (rows.length == 0) {
                return callback(data = { status: "OK", message: "RECIPE IS NOT EXISTS" });
            } else {
                return callback(rows[0]);
            }
        });
    } catch (error) {
        return callback(data = { status: "ERROR", message: "SINGLE RECIPE FETCHING ERROR" });
    }
}

// Comment Add Recipes
recipeUtil.commentAdd = async function (body, callback) {
    try {
        let sqlQueryUser_ID = `select user_id from user where user_email='${body.user_email}'`;
        await DataBaseConnection.query(sqlQueryUser_ID, async function (error, result) {
            let user_id = result[0].user_id;

            let sqlQuery = `INSERT INTO comment (recipe_id,user_id,comment_text) VALUES (${body.recipe_id},${user_id},'${body.comment_text}')`;
            await DataBaseConnection.query(sqlQuery, function (error, result) {
                if (result == undefined) {
                    return callback(data = { status: "ERROR", message: "Comment is Not Added" });
                } else {
                    return callback(data = { status: "OK", message: "Comment is Added" });
                }
            });
        });
    } catch (error) {
    }
}

module.exports = recipeUtil;