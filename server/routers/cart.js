const express = require('express');
const repository = require('../repository/cart');
const authenticateMiddleware = require('../middleware/auth').authenticateMiddleware
const cartRouter = express.Router()

cartRouter.get('/',authenticateMiddleware,(req,res)=>{
    repository.getAllCartByUserId(req.user.id)
    .then((x)=>{
     res.send(x.recordset); 
    }) 
 });

 cartRouter.delete('/',authenticateMiddleware,async (req,res)=>{
    try {
        const cart=await repository.deleteFromCart(req.body.recipe_id,req.user.id);
        res.status(201).send(cart);
    }
    catch (err) {
        res.status(400).send({error: err.message});
    }
})

cartRouter.post('/quantitychange',authenticateMiddleware,async (req,res)=>{
    try {
        const cart=await repository.quantitychange(req.body.currCartItem.id,req.body.currCartItem.quantity,req.body.inc,req.user.id)
        res.status(201).send(cart);
    }
    catch (err) {
        res.status(400).send({error: err.message});
    }
})

cartRouter.post('/makeOrder',authenticateMiddleware, async (req,res) => {
    try {
        await repository.makeAnOrder(req.user.id);
        res.status(201).send('create an order');
    } catch (e) {
        res.status(400).send({error: e.message})
    }
})

module.exports = cartRouter;














