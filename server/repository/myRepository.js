const { json } = require('body-parser');
const mssql = require('mssql')
const jwt = require('jsonwebtoken');

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


//=============================================addCustomer========================================================================================================

const addCustomer = async (body) => {
    const { username, email, password,profileImg } = body;
    if (!username || !email || !password) {
        throw Error('you should provide non-empty username, email and password');
    }
    const dbConnection = await appPool.connect();
    const query = `INSERT INTO Customers(username, eAdress,password_) values ('${username}','${email}','${password}')`;
    await dbConnection.query(query);
    dbConnection.release();
}


//=============================================costumerLogin========================================================================================================

const costumerLogin = async (username,password) => {
    let adminConnected = false;
    if (!username || !password) {
        throw Error('you should provide non-empty username and password');
    }
    const dbConnection = await appPool.connect();
    const loadUserQuery = `SELECT * from Customers WHERE username = '${username}'`
    const user = await dbConnection.query(loadUserQuery);

    const loadAdminQuery = `select Admins.id as adminId,Customers.username from Admins
    inner join Customers on Customers.id=Admins.userId
    where Customers.username='${username}'`;
    const admin = await dbConnection.query(loadAdminQuery);
    if (user.recordset.length === 0) {
        throw Error(`Wrong credentials`);
    }

    if (user.recordset[0]['password_'] !== password) {
        throw Error(`Wrong password`);
    }

    if (admin.recordset.length > 0) {
        adminConnected = true;
    }

    const userToken = jwt.sign({ username, password }, process.env.SECRET);
    const userTokenAreExistQuery= `select * from Sessions where usernameId=${user.recordset[0].id}`
    const userTokenAreExistResponse= await dbConnection.query(userTokenAreExistQuery);
    if(userTokenAreExistResponse.recordset.length===0){
        const addTokenQuery = `INSERT INTO Sessions(usernameId, token) values (${user.recordset[0].id}, '${userToken}')`
    await dbConnection.query(addTokenQuery);
    }
    
    dbConnection.release();
    return { token: userToken, isAdminConnected: adminConnected };
}

//=============================================getUserByUsername========================================================================================================

const getUserByUsername = async (username) => {
    const dbConnection = await appPool.connect();
    const loadUserQuery = `SELECT * from Customers WHERE username = '${username}'`
    const user = await dbConnection.query(loadUserQuery);
    if (user.recordset.length === 0) {
        throw Error(`user  ${username} not exists`);
    }
    dbConnection.release();
    return user.recordset[0];
}

//=============================================addRcipePost========================================================================================================

const addRecipePost = async (req) => {
    let { recipeName, time, ingredientsNum, servingNum, Description, ingredients, directions, likes } = req.body;
    recipeName=recipeName.replace(/'/g, '&').replace(/"/g, '%').replace(/`/g, '#');
    Description=Description.replace(/'/g, '&').replace(/"/g, '%').replace(/`/g, '#');
    const userId=req.user.id;
    const dbConnection = await appPool.connect();
    const query = `INSERT INTO recipes(name,time,ingredientsNum,servingNum,Description,likes,usernameId) values ('${recipeName}',${time},${ingredientsNum},${servingNum},'${Description}',${likes},${userId})`;
    await dbConnection.query(query);

    const loadRecipeQuery = `SELECT * from recipes WHERE name = '${recipeName}' order by id desc`
    const recipe = await dbConnection.query(loadRecipeQuery);
    Object.entries(ingredients).map(async ([title, ingredientsArr]) => {
        ingredientsArr.map(async ({ quantity, ingredient }, idx) => {
            const ingredientsQuery = `INSERT INTO ingredients(recipe_id, title, ingredientName,quantity) VALUES (${recipe.recordset[0].id}, '${title}', '${ingredient}','${quantity}')`;
            await dbConnection.query(ingredientsQuery);
        }
        )
    });

    Object.entries(directions).map(async ([title, directionsArr]) => {
        for (let direction of directionsArr) {
            direction=direction.replace(/'/g, '&').replace(/"/g, '%').replace(/`/g, '#');
            const directionsQuery = `INSERT INTO directions(recipe_id, title, stepDescription) VALUES (${recipe.recordset[0].id}, '${title}', '${direction}')`;
            await dbConnection.query(directionsQuery);
        }

    })
    dbConnection.release();
    return recipe.recordset[0].id;
}

//=============================================insertImagesToDataBase========================================================================================================
const insertImagesToDataBase =async (recipeId,filesInfo)=>{
    const dbConnection = await appPool.connect();
        const query = `INSERT INTO images(recipeId,src) values (${recipeId},'${filesInfo}')`;
        await dbConnection.query(query);
}
//=============================================getAllImagesByRecipeId========================================================================================================
const getAllImagesByRecipeId =async (recipeId)=>{
    const dbConnection = await appPool.connect();
        const query = `select * from images where recipeId=${recipeId}`;
       let results= await dbConnection.query(query);
       return results.recordset;
}



module.exports.addCustomer = addCustomer;
module.exports.costumerLogin = costumerLogin;
module.exports.addRecipePost = addRecipePost;
module.exports.getUserByUsername = getUserByUsername;
module.exports.insertImagesToDataBase = insertImagesToDataBase;
module.exports.getAllImagesByRecipeId = getAllImagesByRecipeId;
