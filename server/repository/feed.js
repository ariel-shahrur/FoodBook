const mssql = require('mssql')

const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    server: 'localhost', //Server to connect to. You can use 'localhost\instance' to connect to named instance.
    port: 1433, //Port to connect to (default: 1433). Don't set when connecting to named instance.
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false, // for azure use true
        trustServerCertificate: true // use true for local dev / self-signed certs
    }
}
const appPool = new mssql.ConnectionPool(sqlConfig);

//=============================================getAllRecipe========================================================================================================

const getAllRecipe = async () => {
    let allRecipes, allIngredients, allDirections, allComments;
    try {
        // Create promises for querying recipes and ingredients
        const allRecipesPromise = new Promise(async (resolve, reject) => {
            try {
                const myConnectionPoolToDB = await appPool.connect();
                const results = await myConnectionPoolToDB.query(`SELECT recipes.id ,name ,time,ingredientsNum,servingNum,Description,likes,usernameId from recipes
                inner join Customers
                on recipes.usernameId=Customers.id
                ORDER BY recipes.id DESC;`);
                results.recordsets[0].map(currRecipe=>{
                    currRecipe.name=currRecipe.name.replace(/&/g, "'").replace(/%/g, '"').replace(/#/g, '`')
                    currRecipe.Description=currRecipe.Description.replace(/&/g, "'").replace(/%/g, '"').replace(/#/g, '`')
                })
                resolve(results.recordsets[0]);
                myConnectionPoolToDB.release();
            } catch (err) {
                console.log("There was an error while sending the query to the DB for recipes: ", err);
                reject(err);
            }
        });

        // Create promises for querying ingredients
        const allIngredientsPromise = new Promise(async (resolve, reject) => {
            try {
                const myConnectionPoolToDB = await appPool.connect();
                const results = await myConnectionPoolToDB.query(`SELECT recipe_id, title, ingredientName,quantity FROM ingredients ORDER BY recipe_id, title `);
                myConnectionPoolToDB.release();
                resolve(results.recordsets[0]);

            } catch (err) {
                console.log("There was an error while sending the query to the DB for ingredients: ", err);
                reject(err);
            }
        });

        // Create promises for querying directions
        const allDirectionsPromise = new Promise(async (resolve, reject) => {
            try {
                const myConnectionPoolToDB = await appPool.connect();
                const results = await myConnectionPoolToDB.query(`SELECT recipe_id, title, stepDescription FROM directions ORDER BY recipe_id, title `);
                results.recordsets[0].map(currDirection=>{
                    currDirection.stepDescription=currDirection.stepDescription.replace(/&/g, "'").replace(/%/g, '"').replace(/#/g, '`')
                })
                resolve(results.recordsets[0]);
                myConnectionPoolToDB.release();
            } catch (err) {
                console.log("There was an error while sending the query to the DB for ingredients: ", err);
                reject(err);
            }
        });

        const allCommentsPromise = new Promise(async (resolve, reject) => {
            try {
                const myConnectionPoolToDB = await appPool.connect();
                const results = await myConnectionPoolToDB.query(`SELECT recipe_id, comment FROM comment ORDER BY recipe_id, comment `);
                resolve(results.recordsets[0]);
                myConnectionPoolToDB.release();
            } catch (err) {
                console.log("There was an error while sending the query to the DB for ingredients: ", err);
                reject(err);
            }
        });

        const allImagesPromise = new Promise(async (resolve, reject) => {
            try {
                const myConnectionPoolToDB = await appPool.connect();
                const results = await myConnectionPoolToDB.query(`SELECT recipeId, src FROM images ORDER BY recipeId `);
                resolve(results.recordsets[0]);
                myConnectionPoolToDB.release();
            } catch (err) {
                console.log("There was an error while sending the query to the DB for ingredients: ", err);
                reject(err);
            }
        });
        
        [allRecipes, allIngredients, allDirections, allComments,allImages] = await Promise.all([allRecipesPromise, allIngredientsPromise, allDirectionsPromise, allCommentsPromise,allImagesPromise]);
    } catch (err) {
        console.error('ERROR CONNECTION TO DB: ', err);
    }

    const allRecipesData = [];

    allRecipes.forEach((currRecipe) => {
        const recipeData = { ...currRecipe, ingredients: {}, directions: {}, comments: [],images:[] };

        allIngredients.forEach((currIngredient) => {
            if (currRecipe.id === currIngredient.recipe_id) {
                if (!recipeData.ingredients[currIngredient.title]) {
                    recipeData.ingredients[currIngredient.title] = []; //create an empty arr if there is no title yet
                }
                recipeData.ingredients[currIngredient.title].push({ quantity: currIngredient.quantity, ingredient: currIngredient.ingredientName }); // push to the arr the ingredient by title
            }
        });

        allDirections.forEach((currDirection) => {
            if (currRecipe.id === currDirection.recipe_id) {
                if (!recipeData.directions[currDirection.title]) {
                    recipeData.directions[currDirection.title] = [];
                }
                recipeData.directions[currDirection.title].push(currDirection.stepDescription);
            }
        });

        allComments.forEach((currComment) => {
            if (currRecipe.id === currComment.recipe_id) {
                if (!recipeData.comments) {
                    recipeData.comments = [];
                }
                recipeData.comments.push(currComment.comment);
            }
        });
        allImages.forEach((currImage) => {
            if (currRecipe.id === currImage.recipeId) {
                if (!recipeData.images) {
                    recipeData.images = [];
                }
                recipeData.images.push(currImage.src);
            }
        });

        allRecipesData.push(recipeData);
    });
    return allRecipesData;
};


//=============================================deleteFromFeed========================================================================================================

const deleteFromFeed = async (recipeId) => {
        try {
            let dbConnection = await appPool.connect()
            const query = `
            delete from LikedRecipes where RecipeId=${recipeId};
            delete from directions where recipe_id=${recipeId};
            delete from comment where recipe_id=${recipeId};
            delete from ingredients where recipe_id=${recipeId};
            delete from images where recipeId=${recipeId};
            delete from recipes where id=${recipeId};
             `
            await dbConnection.query(query);
            dbConnection.release();
            return 
        }
        catch (err) {
            console.log("there was an error while sending query to DB ", err);
        }
}

//=============================================like========================================================================================================

const like = async (recipeId, userId) => {
    const db = await appPool.connect();
    try {
        // Check if the customer has already liked this recipe
        const existingLike = await db.query(
            `SELECT * FROM LikedRecipes WHERE RecipeId = ${recipeId} AND CustomerId = ${userId}`);

        if (existingLike.recordset.length === 0) {
            // Customer hasn't liked this recipe yet, so insert a new like
            await db.query(`INSERT INTO LikedRecipes (RecipeId, CustomerId) VALUES (${recipeId}, ${userId});`);
        } else {
            await db.query(`DELETE FROM LikedRecipes WHERE CustomerId=${userId} and RecipeId= ${recipeId}; `); //if clicked again remove from LikedRecipes 
        }
    } catch (error) {
        console.error('ERROR CONNECTION TO DB: ', error);
    }
    let likeCount = await db.query(`SELECT COUNT(*) as likesNumber FROM LikedRecipes WHERE RecipeId = ${recipeId};`);
    await db.query(`update recipes
    Set likes = ${likeCount.recordset[0].likesNumber} where id=${recipeId}`) // update the number of likes in recipes table
    db.release();
    return { likesNumber: likeCount.recordset[0].likesNumber }
}

//=============================================addComment========================================================================================================

const addComment = async (recipeId, comment, userId) => {
    const dbConnection = await appPool.connect();
    comment=comment.replace(/'/g, '&').replace(/"/g, '%').replace(/`/g, '#');
    const query = `insert into comment  (recipe_id,comment,customersId) values (${recipeId},'${comment}',${userId})`;
    await dbConnection.query(query);

    dbConnection.release();
    return await getAllComments(recipeId);
}

//=============================================deleteComment========================================================================================================

const deleteComment= async (commentId,recipeId) => {
    const dbConnection = await appPool.connect();
    const delteQuery = `delete from comment where id=${commentId}`;
    await dbConnection.query(delteQuery);
    dbConnection.release();
    return await getAllComments(recipeId);
}

//=============================================getAllComments========================================================================================================

const getAllComments = async (recipeId) => {
    return new Promise(async (resolve, reject) => {
        let dbConnection = await appPool.connect()
        try {
            let results = await dbConnection.query(`SELECT comment.id,comment.recipe_id, comment.comment,comment.commentDate ,Customers.username,Customers.id as userId
                FROM comment 
                INNER JOIN Customers ON comment.customersId = Customers.id
                where recipe_id=${recipeId} `)
            dbConnection.release();
            results.recordsets[0].map(currComment=>{
                currComment.comment=currComment.comment.replace(/&/g, "'").replace(/%/g, '"').replace(/#/g, '`')
            })
            resolve(results.recordsets[0]);
        }
        catch (err) {
            console.log("there was an error while sending query to DB ", err);
            reject(err);
        }
    })
}

//=============================================getLikesByUser========================================================================================================

const getLikesByUser = async(userId,recipeId)=>{
    let dbConnection = await appPool.connect()
        try {
            let likesNumberByUserId = await dbConnection.query(`select * from LikedRecipes where CustomerId=${userId} and RecipeId=${recipeId}`)
            let likesNumberByRecipeId = await dbConnection.query(`SELECT COUNT(*) as likesNumber FROM LikedRecipes WHERE RecipeId = ${recipeId};`)
            dbConnection.release();
            return {likesNumberByUserId:likesNumberByUserId.recordsets[0].length,likesNumberByRecipeId:likesNumberByRecipeId.recordset[0].likesNumber};
        }
        catch (err) {
            console.log("there was an error while sending query to DB ", err);
           return err;
        }
}



module.exports.getAllRecipe = getAllRecipe;
module.exports.like = like;
module.exports.addComment = addComment;
module.exports.getAllComments = getAllComments;
module.exports.deleteFromFeed = deleteFromFeed;
module.exports.getLikesByUser = getLikesByUser;
module.exports.deleteComment = deleteComment;