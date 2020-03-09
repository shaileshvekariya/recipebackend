const DataBaseConnection = require('../../connection/connection');
const recipe = require('../model/recipe.model');
const fs = require('fs');

recipeUtil = {};

// Add Recipe
recipeUtil.addRecipe = async function (body, auth_token, recipeImageFileNames, callback) {
    try {
        let sqlUserID = `SELECT user_id from user where user_authtoken='${auth_token}'`;
        await DataBaseConnection.query(sqlUserID, async function (error, result) {
            recipe.recipe_name = body.recipe_name;
            recipe.type_id = Number(body.type_id);
            recipe.recipe_level = body.recipe_level;
            recipe.recipe_cookingtime = Number(body.recipe_cookingtime);
            recipe.recipe_ingredients = body.recipe_ingredients;
            recipe.recipe_steps = body.recipe_steps;
            recipe.recipe_people = Number(body.recipe_people);
            recipe.recipe_image = recipeImageFileNames;
            recipe.user_id = result[0].user_id;
            recipe.recipe_description = body.recipe_description;

            let recipeValue = [recipe.recipe_name, recipe.type_id, recipe.recipe_level, recipe.recipe_cookingtime, recipe.recipe_ingredients, recipe.recipe_steps, recipe.recipe_people, recipe.recipe_image, recipe.user_id, recipe.recipe_description];

            await DataBaseConnection.query("INSERT INTO recipes (recipe_name,type_id,recipe_level,recipe_cookingtime,recipe_ingredients,recipe_steps,recipe_people,recipe_image,user_id,recipe_description) VALUES  (?)",
                [recipeValue], function (error, rows) {
                    if (!error) {
                        return callback(data = { status: "OK", message: "RECIPE ADDED" });
                    } else {
                        console.log(error);
                        return callback(data = { status: "ERROR", message: "RECIPE NOT ADDED" });
                    }
                });
        });
    } catch (error) {
        return callback(data = { status: "ERROR", message: "RECIPE NOT ADDED" });
    }
}

// Edit Recipe
recipeUtil.editRecipe = async function (body, recipeImageFileNames, recipeImage, callback) {
    try {
        recipe.recipe_name = body.recipe_name;
        recipe.type_id = Number(body.type_id);
        recipe.recipe_level = body.recipe_level;
        recipe.recipe_cookingtime = Number(body.recipe_cookingtime);
        recipe.recipe_ingredients = body.recipe_ingredients;
        recipe.recipe_steps = body.recipe_steps;
        recipe.recipe_people = Number(body.recipe_people);
        recipe.recipe_image = recipeImageFileNames;
        recipe.recipe_description = body.recipe_description;
        let recipe_id = body.recipe_id;

        if (!isNaN(recipe_id) && recipe_id !== "") {

            let sqlRecipeID = `SELECT recipe_image FROM recipes WHERE recipe_id=${Number(body.recipe_id)}`;
            DataBaseConnection.query(sqlRecipeID, function (error, result) {
                let recipeOldImage = result[0].recipe_image;
                try {
                    fs.unlinkSync('public/recipeimages/' + recipeOldImage);
                } catch (error) {
                }

                // console.log(recipeImageFileNames[3]);
                recipeImage.mv('public/recipeimages/' + recipe.recipe_image);


                let value = [recipe.recipe_name, recipe.type_id, recipe.recipe_level, recipe.recipe_cookingtime, recipe.recipe_ingredients, recipe.recipe_steps, recipe.recipe_people, recipe.recipe_image, recipe.recipe_description, recipe_id];
                let sqlQuery = "UPDATE recipes SET recipe_name=? ,type_id=? ,recipe_level=? ,recipe_cookingtime=? ,recipe_ingredients=? ,recipe_steps=? ,recipe_people=? ,recipe_image=?,recipe_description=? where recipe_id=?";

                DataBaseConnection.query(sqlQuery, value, function (error, result) {
                    if (!error) {
                        if (result.affectedRows == 1) {
                            return callback(data = { status: "OK", message: "RECIPE EDITED SUCCESSFULLY" });
                        } else {
                            return callback(data = { status: "ERROR", message: "RECIPE NOT EXISTED" });
                        }
                    }
                });

            });


        } else {
            return callback(data = { status: "ERROR", message: "RECIPE ID IS NOT GET " });
        }
    } catch (error) {
        return callback(data = { status: "ERROR", message: "RECIPE NOT EDITED" });
    }


}

// Delete Recipe
recipeUtil.deleteRecipe = async function (id, callback) {
    try {
        let sqlImageDelete = `SELECT recipe_image FROM recipes WHERE recipe_id=${id}`;
        await DataBaseConnection.query(sqlImageDelete, async function (error, result) {
            try {
                // remove recipe and recipe image
                try {
                    fs.unlinkSync('public/recipeimages/'+result[0].recipe_image);
                } catch (error) {
                    return callback(data = { status: "OK", message: "RECIPE DELETED" });
                }
                let sqlQuery = `delete from recipes where recipe_id=${id}`;
                await DataBaseConnection.query(sqlQuery, function (error, result) {
                    if (!error) {
                        if (result.affectedRows == 1) {
                            return callback(data = { status: "OK", message: "RECIPE DELETED" });
                        } else {
                            return callback(data = { status: "ERROR", message: "RECIPE IS NOT EXISTING" });
                        }
                    }
                });

            } catch (error) {
            }
        });
    } catch (error) {
        return callback(data = { status: "ERROR", message: "ERROR" });
    }
}

// Get All Recipes User IS Login Or User is Not Login But Data IS Restiction user is Not Login
recipeUtil.getRecipes = async function (count, user, callback) {
    try {
        if (user[0]) {
            let sqlQuery = `SELECT COUNT(f.recipe_id) AS favoriteCount,	    
			r.recipe_id,
            rt.type_name,
            r.recipe_name,
            r.recipe_level,
            r.recipe_people,
            r.recipe_cookingtime,
            r.recipe_image,
            r.recipe_description
            FROM recipes r
            LEFT JOIN recipe_type rt ON r.type_id=rt.type_id
            LEFT JOIN favorite f ON f.recipe_id=r.recipe_id 
            GROUP BY r.recipe_id  ORDER BY r.recipe_id DESC LIMIT ${count},10`;
            await DataBaseConnection.query(sqlQuery, async function (error, resultOuter) {
                if (!error) {
                    let sqlQuery = `SELECT COUNT(f.recipe_id) AS recipeLike 
                    FROM recipes r
                    LEFT JOIN favorite f ON f.recipe_id=r.recipe_id AND f.user_id=${user[1]}
                    GROUP BY r.recipe_id ORDER BY r.recipe_id DESC LIMIT ${count},10`;

                    await DataBaseConnection.query(sqlQuery, function (error, result) {
                        resultOuter.map((item,i)=>{
                            resultOuter[i].recipeLike=result[i].recipeLike;
                        });
                        return callback(resultOuter);
                    });
                } else {
                    return callback(data = { status: "ERROR", message: "Please Pass a Count Data" });
                }
            });
        } else {
            let sqlQuery = `SELECT COUNT(f.recipe_id) AS favoriteCount,
            r.recipe_id,
            rt.type_name,
            r.recipe_name,
            r.recipe_level,
            r.recipe_people,
            r.recipe_cookingtime,
            r.recipe_image,
            r.recipe_description
            FROM recipes r
            LEFT JOIN recipe_type rt ON r.type_id=rt.type_id
            LEFT JOIN favorite f ON r.recipe_id=f.recipe_id
            GROUP BY r.recipe_id ORDER BY r.recipe_id DESC LIMIT ${count},10`;
            await DataBaseConnection.query(sqlQuery, function (error, result) {
                if (!error) {
                    return callback(result);
                } else {
                    return callback(data = { status: "ERROR", message: "Please Pass a Count Data" });
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
}

// Get Single Recipe
recipeUtil.getRecipe = async function (id, user, callback) {
    try {
        if (user[0]) {
            let sqlQuery = `SELECT COUNT(f.recipe_id) AS favoriteCount,
            r.recipe_id,
            rt.type_name,
            r.recipe_name,
            r.recipe_level,
            r.recipe_people,
            r.recipe_cookingtime,
            r.recipe_image,
            r.recipe_ingredients,
            r.recipe_steps,
            r.recipe_description
            FROM recipes r
            LEFT JOIN recipe_type rt ON r.type_id=rt.type_id
            LEFT JOIN favorite f ON r.recipe_id=f.recipe_id
            GROUP BY r.recipe_id HAVING r.recipe_id=${id}`;
            await DataBaseConnection.query(sqlQuery, async function (error, resultOuter) {
                if (!error) {
                    let sqlQuery = `SELECT COUNT(*) as recipeLike FROM favorite WHERE recipe_id=${id} AND user_id=${user[1]}`;
                    await DataBaseConnection.query(sqlQuery, async function (error, result) {
                        if (!error) {
                            resultOuter[0].recipeLike = result[0].recipeLike;
                            return callback(resultOuter);
                        }
                    });
                } else {
                    return callback(data = { status: "ERROR", message: "Please Passed a Recipe ID" });
                }
            });
        } else {
            let sqlQuery = `SELECT COUNT(f.recipe_id) AS favoriteCount,
            r.recipe_id,
            rt.type_name,
            r.recipe_name,
            r.recipe_level,
            r.recipe_people,
            r.recipe_cookingtime,
            r.recipe_image,
            r.recipe_ingredients,
            r.recipe_steps,
            r.recipe_description
            FROM recipes r
            LEFT JOIN recipe_type rt ON r.type_id=rt.type_id
            LEFT JOIN favorite f ON r.recipe_id=f.recipe_id
            GROUP BY r.recipe_id
            Having r.recipe_id=${id}`;

            await DataBaseConnection.query(sqlQuery, function (error, result) {
                if (!error) {
                    if (result.length == 0) {
                        return callback(data = { status: "ERROR", message: "RECIPE NOT FOUND" });
                    } else {
                        return callback(result[0]);
                    }
                }
            });
        }
    } catch (error) {
        // console.log(error);
        return callback(data = { status: "ERROR", message: "RECIPE NOT GET" });
    }
}

// AddFavorite Recipe
recipeUtil.addFavorite = async function (body, callback) {
    try {
        let sqlQueryUser_ID = `select user_id from user where user_email='${body.user_email}' `;
        await DataBaseConnection.query(sqlQueryUser_ID, async function (error, result) {
            if (result.length == 0) {
                return callback(data = { status: "ERROR", message: "Email ID Is Not Exists" });
            } else {
                let user_id = result[0].user_id;

                let sqlCheck = `SELECT COUNT(*) AS count FROM favorite where recipe_id=${body.recipe_id} AND user_id=${user_id}`;
                await DataBaseConnection.query(sqlCheck, async function (error, result) {
                    if (result[0].count == 1) {
                        return callback(data = { status: "OK", message: "Favorite Recipe Alredy Exists" });
                    } else {
                        let sqlQuery = `INSERT INTO favorite (recipe_id,user_id) VALUES (${body.recipe_id},${user_id}) `;
                        await DataBaseConnection.query(sqlQuery, function (error, result) {
                            if (error) {
                                return callback(data = { status: "ERROR", message: "Recipe IS Not Exists" });
                            }
                            if (result.affectedRows === 1) {
                                return callback(data = { status: "OK", message: "Favorite Recipe Added" });
                            } else {
                                return callback(data = { status: "ERROR", message: "Favorite is Not Add" });
                            }
                        });
                    };
                });
            }
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
            if (Object.entries(result).length == 0) {
                return callback(data = { status: "ERROR", message: "USER EMAIL ID NOT PASS IN BODY" });
            }
            let user_id = result[0].user_id;
            let sqlQuery = `DELETE FROM favorite where user_id=${user_id} AND recipe_id=${body.recipe_id}`;
            await DataBaseConnection.query(sqlQuery, function (error, result) {
                if (error) {
                    return callback(data = { status: "ERROR", message: "Favorite Recipe is Not Exists" });
                }
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

            let sqlQuery = `SELECT COUNT(f.recipe_id) AS favoriteCount,	    
			f.user_id,
			r.recipe_id,
            rt.type_name,
            r.recipe_name,
            r.recipe_level,
            r.recipe_people,
            r.recipe_cookingtime,
            r.recipe_image,
            r.recipe_description
            FROM recipes r
            LEFT JOIN recipe_type rt ON r.type_id=rt.type_id
            LEFT JOIN favorite f ON f.recipe_id=r.recipe_id 
            GROUP BY r.recipe_id
            HAVING f.user_id=${user_id} ORDER BY r.recipe_id DESC `;
            await DataBaseConnection.query(sqlQuery, async function (error, resultOuter) {
                if (result.length >= 1) {
                    let sqlQuery = `SELECT COUNT(f.recipe_id) AS recipeLike
                    FROM recipes r
                    INNER JOIN favorite f ON f.recipe_id=r.recipe_id AND f.user_id=${user_id}
                    GROUP BY r.recipe_id`;
                    await DataBaseConnection.query(sqlQuery, function (error, result) {
                        for (let i = 0; i < Object.keys(resultOuter).length; i++) {
                            resultOuter[i].recipeLike = result[i].recipeLike;
                        }
                        return callback(resultOuter);
                    });
                } else {
                    return callback(data = { status: "ERROR", message: "Favorite Recipe is Not Exists" });
                }
            });
        });
    } catch (error) {
    }
}

// GETS Perticular USER RECIPES
recipeUtil.userGetsRecipes = async function (email, count, callback) {
    try {
        let sqlQueryUser_ID = `select user_id from user where user_email='${email}'`;
        await DataBaseConnection.query(sqlQueryUser_ID, async function (error, result) {
            let user_id = result[0].user_id;

            let sqlQuery = `SELECT COUNT(f.recipe_id) AS favoriteCount,
            r.recipe_id,
            rt.type_name,
            r.recipe_name,
            r.recipe_level,
            r.recipe_people,
            r.recipe_cookingtime,
            r.recipe_image,
            r.recipe_description
            FROM recipes r
            JOIN recipe_type rt ON r.type_id=rt.type_id AND ${user_id}=r.user_id
            LEFT JOIN favorite f ON r.recipe_id=f.recipe_id
            GROUP BY r.recipe_id ORDER BY r.recipe_id DESC  LIMIT ${count},10`;
            await DataBaseConnection.query(sqlQuery, async function (error, resultOuter) {
                if (resultOuter.length <= 0) {
                    return callback(data = { status: "OK", message: "This User Not Any Existing Recipe" });
                } else {
                    let sqlQuery = `SELECT COUNT(f.user_id) AS recipeLike
                                    FROM recipes r
                                    LEFT JOIN favorite f ON f.recipe_id=r.recipe_id AND f.user_id=r.user_id
                                    WHERE r.user_id=${user_id}
                                    GROUP BY r.recipe_id ORDER BY r.recipe_id DESC  LIMIT ${count},10 `;
                    await DataBaseConnection.query(sqlQuery, function (error, result) {
                        resultOuter.map((item,i)=>{
                            resultOuter[i].recipeLike=result[i].recipeLike;
                        });
                        return callback(resultOuter);
                    });
                }
            });
        });
    } catch (error) {
        return callback(data = { status: "ERROR", message: "GET ALL USERS RECIPE ERROR" });
    }
}

// Get Single Recipe Perticular User
recipeUtil.userGetRecipe = async function (id, user_id, callback) {
    try {
        let sqlQuery = `SELECT COUNT(f.recipe_id) AS favoriteCount,
        r.recipe_id,
        rt.type_name,
        r.recipe_name,
        r.recipe_level,
        r.recipe_people,
        r.recipe_cookingtime,
        r.recipe_image,
        r.recipe_ingredients,
        r.recipe_steps,
        r.recipe_description
        FROM recipes r
        LEFT JOIN recipe_type rt ON r.type_id=rt.type_id
        LEFT JOIN favorite f ON r.recipe_id=f.recipe_id
        GROUP BY r.recipe_id HAVING r.recipe_id=${id}`;
        await DataBaseConnection.query(sqlQuery, async function (error, resultOuter) {
            if (error) {
                console.log(error);
                return callback(data = { status: "ERROR", message: "RECIPE ID IS NOT EXISTS ERROR" });
            }
            if (resultOuter.length == 0) {
                return callback(data = { status: "ERROR", message: "RECIPE IS NOT EXISTS"});
            } else {
                let sqlQuery = `SELECT COUNT(*) as recipeLike FROM favorite WHERE recipe_id=${id} AND user_id=${user_id}`;
                await DataBaseConnection.query(sqlQuery, function (error, result) {
                    resultOuter[0].recipeLike = result[0].recipeLike;
                    return callback(resultOuter);
                });
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
                if (!error) {
                    if (result == undefined) {
                        return callback(data = { status: "ERROR", message: "Comment is Not Added" });
                    } else {
                        return callback(data = { status: "OK", message: "Comment is Added" });
                    }
                } else {
                    return callback(data = { status: "ERROR", message: "Comment is not add recipe_id  is not exists " });
                }
            });
        });
    } catch (error) {
        return callback(data = { status: "ERROR", message: "Comment is Not data is Miss Match" });
    }
}

recipeUtil.commentShow = async function (id, callback) {
    try {
        let sqlQuery = `SELECT c.comment_text,c.comment_time,CONCAT(u.user_firstname," ",u.user_lastname) AS fullname,r.recipe_id
        FROM comment c
        JOIN user u ON u.user_id=c.user_id
        JOIN recipes r ON r.recipe_id=c.recipe_id WHERE r.recipe_id=${id} ORDER BY c.comment_time DESC`;

        await DataBaseConnection.query(sqlQuery, function (error, result) {
            if (!error) {
                if (result.length == 0) {
                    return callback({ status: "ERROR", message: "recipe in comment not Exists" });
                }
                return callback(comment={status:"OK",message:"",comment:result});
            } else {
                return callback(data = { status: "ERROR", message: "Comment is not show recipe_id  is not match " });
            }
        });
    } catch (error) {
    }
}

module.exports = recipeUtil;