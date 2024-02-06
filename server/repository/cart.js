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

//=============================================getAllCartByUserId========================================================================================================

const getAllCartByUserId = async (userId) => {

    return new Promise(async (resolve, reject) => {
        try {
            const dbConnection = await appPool.connect()

            const query = `SELECT
            Cart.id,
                        Cart.customerId,
                        Cart.recipe_id,
                        shopeIngredients.ingredientName,
                        shopeIngredients.Price,
                        Cart.quantity,
                        recipes.name as recipeName
                    FROM
                        Cart
                        inner join shopeIngredients
                        on Cart.IngredientId=shopeIngredients.id
                        inner join recipes
                        on Cart.recipe_id=recipes.id
                        where Cart.customerId=${userId};`
           
            const cartByUserId = await dbConnection.query(query);
            dbConnection.release();
            cartByUserId.recordsets[0].map(currCartItem=>{
                currCartItem.recipeName=currCartItem.recipeName.replace(/&/g, "'").replace(/%/g, '"').replace(/#/g, '`')
            })
            resolve(cartByUserId);
        }
        catch (err) {
            console.log("there was an error while sending query to DB ", err);
            reject(err);
        }
    })
};



//=============================================deleteFromCart========================================================================================================

const deleteFromCart = async (recipe_id,userId) => {

    try {
        let dbConnection = await appPool.connect()
        const query = `delete from Cart
            where recipe_id=${recipe_id}`
        await dbConnection.query(query);
        dbConnection.release();
        let newcart=await getAllCartByUserId(userId)
        return newcart.recordset;
    }
    catch (err) {
        console.log("there was an error while sending query to DB ", err);
    }
}

//=============================================quantitychange========================================================================================================


const quantitychange = async (cartItemId,quantity,inc,userId) => {
    let query;

    try {
        let dbConnection = await appPool.connect()
        if (inc) {
            query = `update Cart
            Set quantity= ${quantity + 1}
            where id=${cartItemId}`;
        }
        else {
            if ((quantity - 1) === 0) {
                query = `delete from Cart where id=${cartItemId}`;
            } else {
                query = `update Cart
            Set quantity= ${quantity - 1}
            where id=${cartItemId}`;
            }
        }

       await dbConnection.query(query);
        dbConnection.release();

         let newcart=await getAllCartByUserId(userId)
        return newcart.recordset;
    }
    catch (err) {
        console.log("there was an error while sending query to DB ", err);
    }
};


//=============================================makeAnOrder========================================================================================================


const makeAnOrder = async (customerId) => {
    const dbConnection = await appPool.connect();
    const query = `INSERT INTO Orders(customerId) values (${customerId})`
    await dbConnection.query(query);
    const orderIdQuery = `SELECT TOP(1) * FROM Orders WHERE customerId = ${customerId} ORDER BY id DESC`//get the last orderId 
    const orderId = (await dbConnection.query(orderIdQuery)).recordset[0].id;
    const runsotre = ` EXEC [dbo].[addOrderDetailsByOrderId] @orderId = ${orderId};`
    await dbConnection.query(runsotre);

    
    const deleteAllItemsFromCart = `delete from Cart WHERE customerId=${customerId}`
    await dbConnection.query(deleteAllItemsFromCart)
    dbConnection.release();
};





module.exports.getAllCartByUserId = getAllCartByUserId;
module.exports.quantitychange = quantitychange;
module.exports.deleteFromCart = deleteFromCart;
module.exports.makeAnOrder = makeAnOrder;
