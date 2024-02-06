const express = require('express');
const repository = require('../repository/messages');
const managementAccontRepository= require('../repository/managementAccont');
const authenticateMiddleware = require('../middleware/auth').authenticateMiddleware
const messagesRouter = express.Router()


messagesRouter.post('/sendMessage',authenticateMiddleware,async (req,res)=>{
    try {
        await repository.addMessage(req.body,req.user.id)
        res.status(201).send("");
    }
    catch (err) {
        res.status(400).send({error: err.message});
    }
})

messagesRouter.get('/',authenticateMiddleware,async (req,res)=>{
    try {
        const messages=await repository.getMessages()
        res.status(201).json(messages);
    }
    catch (err) {
        res.status(400).send({error: err.message});
    }
})


messagesRouter.delete('/ingredient',authenticateMiddleware,async (req,res)=>{
    try {
        const response=await repository.deleteIngredientFromMessageDitails(req.body.messageId,req.body.ingredient)
        res.status(201).send(response);
    }
    catch (err) {
        res.status(400).send({error: err.message});
    }
})

messagesRouter.post('/addToInventory',authenticateMiddleware,async (req,res)=>{
    try {
        await managementAccontRepository.addToInventory(req.body.IngredientName,req.body.Quantity,req.body.Price)
        res.status(201).send("");
    }
    catch (err) {
        res.status(400).send({error: err.message});
    }
})





module.exports = messagesRouter;