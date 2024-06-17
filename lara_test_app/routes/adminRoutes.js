const express = require('express');
const route = express.Router();


route.get('/test-started', async(req,res)=>{
    
    res.status(200).send({message:"test-started"})
})


module.exports = route