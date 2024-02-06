const express = require('express');
const repository = require('../repository/favorite');
const authenticateMiddleware = require('../middleware/auth').authenticateMiddleware
const favoriteRouter = express.Router()



favoriteRouter.get('/',authenticateMiddleware,(req,res)=>{
    repository.getAllLikedRecipes(req.user.id)
    .then((x)=>{
     res.send(x);
    }) 
 });

 favoriteRouter.delete('/',authenticateMiddleware,async(req,res)=>{
   let response= await repository.deleteFromLikes(req.body.recipeId,req.user.id)
    res.status(201).json(response);
    
 });



 favoriteRouter.post('/addToCart',authenticateMiddleware,async (req,res)=>{
    try {
        await repository.addToCart(req.body,req.user.id,req.body.id)
        res.status(201).json("");
    }
    catch (err) {
        res.status(400).send({error: err.message});
    }
})




module.exports = favoriteRouter;