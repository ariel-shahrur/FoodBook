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


//=============================================addMessage========================================================================================================


const addMessage = async (missingIngredientsArry, userId) => {
    let dbConnection = await appPool.connect();
    try {
        const addToAdminMessageQuery = `EXEC addMessage  @userId=${userId}`;
        await dbConnection.query(addToAdminMessageQuery);
        dbConnection.release();
        const messageIdQuery=`SELECT TOP(1) * FROM messages WHERE userId=${userId} ORDER BY id DESC`
        const messageId=(await dbConnection.query(messageIdQuery)).recordset[0].id; 
        missingIngredientsArry.map(async ({ quantity, ingredient }) => {
            const addToMessagesDetailsQuery = `EXEC addMessageDetails  @messageId=${messageId},@IngredientName='${ingredient}'`;
        await dbConnection.query(addToMessagesDetailsQuery);
        })
    }
    catch (err) {
        console.log("there was an error while sending query to DB ", err);
    }
};

//=============================================getMessages========================================================================================================

const getMessages = async () => {
    let dbConnection = await appPool.connect()
    let messagesDitailsFilterdByMessageId = {};
    try {
        const getMessagesQuery = `select messages.id,username,messageDate from messages inner join Customers on Customers.id=messages.userId`;
        const messages = await dbConnection.query(getMessagesQuery);
        const getMessagesDitailsQuery = `select * from messagesDetails`;
        const messagesDitails = await dbConnection.query(getMessagesDitailsQuery);
        dbConnection.release();
        messagesDitails.recordset.map((ingredient) => {
            if (!messagesDitailsFilterdByMessageId[ingredient.messagesId]) {
                messagesDitailsFilterdByMessageId[ingredient.messagesId] = [];
            }
            messagesDitailsFilterdByMessageId[ingredient.messagesId].push(ingredient.IngredientName);
        })


        return {messages:messages.recordset,messagesDitails:messagesDitailsFilterdByMessageId}

    }
    catch (err) {
        console.log("there was an error while sending query to DB ", err);
    }
}

//=============================================deleteIngredientFromMessageDitails========================================================================================================


const deleteIngredientFromMessageDitails = async (messageId,ingredientName) => {
    let dbConnection = await appPool.connect();
    try {
        const deleteIngredientFromMessageDitailsQuery = `delete from messagesDetails where messagesId=${messageId} and IngredientName='${ingredientName}'`;
        await dbConnection.query(deleteIngredientFromMessageDitailsQuery);
        const messagesDitailsQuery=`select * from messagesDetails where messagesId=${messageId}`;
        let messagesDitailsByMessageId= await dbConnection.query(messagesDitailsQuery);
        if(messagesDitailsByMessageId.recordset.length===0){
            const deleteMessageQuery=`delete from messages where id=${messageId}`;
            await dbConnection.query(deleteMessageQuery);
        }
        dbConnection.release();
        const messages=await getMessages();
        return messages;
    }
    catch (err) {
        console.log("there was an error while sending query to DB ", err);
    }
};










module.exports.addMessage = addMessage;
module.exports.getMessages = getMessages;
module.exports.deleteIngredientFromMessageDitails = deleteIngredientFromMessageDitails;