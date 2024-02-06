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

//=============================================getAllOrders========================================================================================================

const getAllOrders = async () => {
    return new Promise(async (resolve, reject) => {
            let dbConnection = await appPool.connect()
            try {
                let results = await dbConnection.query(`SELECT Orders.id, Orders.customerId, Orders.orderDate, shopeIngredients.IngredientName, OrdersDetail.quantity
                FROM Orders
                INNER JOIN OrdersDetail ON Orders.id = OrdersDetail.orderId
                INNER JOIN shopeIngredients ON OrdersDetail.IngredientId = shopeIngredients.id
                `)
                dbConnection.release();
                resolve(results.recordsets[0]);
            }
            catch (err) {
                console.log("there was an error while sending query to DB ", err);
                reject(err);
            }
    })
};

//=============================================getInventory========================================================================================================

const getInventory = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let dbConnection = await appPool.connect()
            try {
                let results = await dbConnection.query(`select * FROM shopeIngredients`)
                resolve(results.recordsets[0]);
            }
            catch (err) {
                console.log("there was an error while sending query to DB ", err);
                dbConnection.release();
                reject(err);
            }
        }
        catch (err) {
            console.error('ERROR CONNECTION TO DB: ', err);
            reject('ERROR CONNECTION TO DB: ', err);
        }
    })
};

//=============================================updateShopeIngredients========================================================================================================

const updateShopeIngredients = async (updatedInventory,shopeIngredientId) => {
    let shopeIngredientById=updatedInventory.filter((curr)=>{if(curr.id===shopeIngredientId){return curr}});
    const dbConnection = await appPool.connect();
    await dbConnection.query(`update shopeIngredients
    Set Quantity = ${shopeIngredientById[0].Quantity},
    Price = ${shopeIngredientById[0].Price}
     where id=${shopeIngredientById[0].id}`) // update the number of likes in recipes table
     dbConnection.release();
};


//=============================================addToInventory========================================================================================================
const addToInventory = async (IngredientName,quantity,Price) => {
    const dbConnection = await appPool.connect();
    await dbConnection.query(`EXEC [dbo].[addIngredientToInventory] @IngredientName = '${IngredientName}',@Quantity=${quantity},@Price=${Price};`);
    dbConnection.release();
};


//=============================================deleteFromInventory========================================================================================================

const deleteFromInventory = async (ingredientId) => {
      return new Promise(async (resolve, reject) => {
        try {
            const dbConnection = await appPool.connect();

            const deleteIngredientQuery = `EXEC [dbo].[deleteIngredientToInventory] @IngredientId = ${ingredientId};`
            const ingredientRemove = await dbConnection.query(deleteIngredientQuery);
            dbConnection.release();
            resolve(getInventory());
        }
        catch (err) {
            console.log("there was an error while sending query to DB ", err);
            reject(err);
        }
    })
};




module.exports.getAllOrders = getAllOrders;
module.exports.getInventory = getInventory;
module.exports.updateShopeIngredients = updateShopeIngredients;
module.exports.addToInventory = addToInventory;
module.exports.deleteFromInventory = deleteFromInventory;