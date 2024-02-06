const express = require('express')
const jwt = require('jsonwebtoken');
const myRepository = require('../repository/myRepository');



const authenticateMiddleware = async (req, res, next) => {

    let token = req.headers.authorization;
        
    if (token) {
        token = token.split(' ')[1];
        try {
            const decodedToken = jwt.verify(token, process.env.SECRET)
            const userEntity = await myRepository.getUserByUsername(decodedToken.username);
            req.user = userEntity;
            next();
        }
        catch (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
    } else {
      res.status(401).json({ message: 'Token missing' });
    }
};

module.exports.authenticateMiddleware = authenticateMiddleware;