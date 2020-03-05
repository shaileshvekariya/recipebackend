SELECT COUNT(f.recipe_id) AS favoriteCount,	    
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
            LEFT JOIN favorite f ON f.recipe_id=r.recipe_id GROUP BY r.recipe_id, LIMIT 0,10


SELECT COUNT(f.recipe_id) AS recipeLike,	    
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
            LEFT JOIN favorite f ON f.recipe_id=r.recipe_id AND f.user_id=2
            GROUP BY r.recipe_id