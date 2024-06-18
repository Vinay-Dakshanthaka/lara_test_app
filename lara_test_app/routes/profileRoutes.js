const express = require('express');
const profileRoute = express.Router();

profileRoute.get('/getprofile', async(req, res) => {
    return res.status(200).send({message: "Profile Fetched"})
})

module.exports = profileRoute;