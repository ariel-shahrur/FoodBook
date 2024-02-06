const express = require('express');
const repository = require('../repository/feed');
const authenticateMiddleware = require('../middleware/auth').authenticateMiddleware
const feedRouter = express.Router()


feedRouter.get('/',authenticateMiddleware,(req,res)=>{
    const userid=req.user.id;
    repository.getAllRecipe()
    .then((feedData)=>{;
     res.send({feedData,userid});
    }) 
 })
 
 feedRouter.delete('/',authenticateMiddleware,(req,res)=>{
     repository.deleteFromFeed(req.body.recipeId)
     res.status(201).send("")
  });

  feedRouter.post('/like',authenticateMiddleware,async (req,res)=>{
    try {
        let likeResponse =await repository.like(req.body.recipeId,req.user.id)
        res.status(200).json( {likeResponse} );
    }
    catch (err) {
        res.status(200).send({error: err.message});
    }
})




feedRouter.post('/addComment',authenticateMiddleware,async (req,res)=>{
    try {
        let allCommentsByRecipeId =await repository.addComment(req.body.recipeId,req.body.comment,req.user.id)
        res.status(201).json( allCommentsByRecipeId );
    }
    catch (err) {
        res.status(400).send({error: err.message});
    }
})

feedRouter.delete('/comment',authenticateMiddleware,async (req,res)=>{
    try {
        let allCommentsByRecipeId =await repository.deleteComment(req.body.commentId,req.body.recipeId)
        res.status(201).json( allCommentsByRecipeId );
    }
    catch (err) {
        res.status(400).send({error: err.message});
    }
})

feedRouter.get('/allComment/:recipeId',(req,res)=>{
   repository.getAllComments(req.params.recipeId)
   .then((x)=>{
    res.send(x);
   }) 
})

feedRouter.get('/likesByUser',authenticateMiddleware,async(req,res)=>{
    try {
        let allLikesByUser =await repository.getLikesByUser(req.user.id,req.query.recipeId)
        res.status(201).send( allLikesByUser );
    }
    catch (err) {
        res.status(400).send({error: err.message});
    }
 })

  
module.exports = feedRouter;