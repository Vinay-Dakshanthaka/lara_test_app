const express = require('express');
const authRoute = express.Router();

authRoute.get('/signup', async (req,res)=>{
    res.status(200).send({message:"signup success"})
})

module.exports = authRoute;