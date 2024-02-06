const mssql = require('mssql')
const repository = require('../repository/feed');

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
const getAllLikedRecipes = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dbConnection = await appPool.connect()
            try {
                let results = await repository.getAllRecipe();
                let allLikedRecipesIdByUserIdArr = (await dbConnection.query(`SELECT *
                FROM LikedRecipes
                where CustomerId = ${userId} 
                order by LikeId desc`)).recordset

                let allLikeRecipesAfterFilter = [];

                allLikedRecipesIdByUserIdArr.filter(curr => {
                    results.map(currRecipe => {
                        if (currRecipe.id === curr.RecipeId) {
                            allLikeRecipesAfterFilter.push(currRecipe);
                        }
                    })
                })
                dbConnection.release();
                resolve(allLikeRecipesAfterFilter);
            }
            catch (err) {
                console.log("there was an error while sending query to DB ", err);
                reject(err);
            }
        }
        catch (err) {
            console.error('ERROR CONNECTION TO DB: ', err);
            reject('ERROR CONNECTION TO DB: ', err);
        }
    })
}


//=============================================deleteFromLikes========================================================================================================

const deleteFromLikes = async (recipeId, userId) => {

    try {
        let dbConnection = await appPool.connect()
        const query = `delete from LikedRecipes
            where RecipeId=${recipeId} and CustomerId=${userId}`
        await dbConnection.query(query);
        let likeCount = await dbConnection.query(`SELECT COUNT(*) as likesNumber FROM LikedRecipes WHERE RecipeId = ${recipeId};`);
        await dbConnection.query(`update recipes
            Set likes = ${likeCount.recordset[0].likesNumber} where id=${recipeId}`) // update the number of likes in recipes table
        dbConnection.release();
        return getAllLikedRecipes(userId);
    }
    catch (err) {
        console.log("there was an error while sending query to DB ", err);
    }
};
//=============================================addToCart========================================================================================================

const addToCart = async (recipe, userId, recipeId) => {
    let dbConnection = await appPool.connect()
    try {
        Object.entries(recipe.ingredients).map(async ([title, ingredientsArr]) => {
            ingredientsArr.map(async ({ quantity, ingredient }) => {
                const addToCartingredientsQuery = `EXEC addToCart  @customerId =${userId} ,@IngredientName= '${ingredient}',@recipeId=${recipeId};`;
                const results = await dbConnection.query(addToCartingredientsQuery);
                dbConnection.release();
            })
        });
    }
    catch (err) {
        console.log("there was an error while sending query to DB ", err);
    }
};




module.exports.deleteFromLikes = deleteFromLikes;
module.exports.getAllLikedRecipes = getAllLikedRecipes;
module.exports.addToCart = addToCart;
