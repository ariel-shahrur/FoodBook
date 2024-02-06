const express = require('express');
const repository = require('../repository/managementAccont');
const authenticateMiddleware = require('../middleware/auth').authenticateMiddleware
const managementRouter = express.Router()



managementRouter.get('/order',authenticateMiddleware, async (req,res) => {
    try {
        const allOrder=await repository.getAllOrders();
        res.status(201).send(allOrder);
    } catch (e) {
        res.status(400).send({error: e.message})
    }
})

managementRouter.get('/Inventory',authenticateMiddleware, async (req,res) => {
    try {
        const Inventory=await repository.getInventory();
        res.status(201).json(Inventory);
    } catch (e) {
        res.status(400).send({error: e.message})
    }
})


managementRouter.post('/Inventory',authenticateMiddleware, async (req,res) => {
    try {
        const Inventory=await repository.updateShopeIngredients(req.body.updatedInventory,req.body.itemId);
        res.status(201).send(Inventory);
    } catch (e) {
        res.status(400).send({error: e.message})
    }
})

managementRouter.post('/addToInventory',authenticateMiddleware, async (req,res) => {
    try {
        await repository.addToInventory(req.body.IngredientName,req.body.Quantity,req.body.Price);
    } catch (e) {
        res.status(400).send({error: e.message})
    }
})

managementRouter.delete('/Inventory',authenticateMiddleware, async (req,res) => {
    try {
        const Inventory=await repository.deleteFromInventory(req.body.ingredientId);
        res.status(201).send(Inventory);
    } catch (e) {
        res.status(400).send({error: e.message})
    }
})


module.exports = managementRouter;