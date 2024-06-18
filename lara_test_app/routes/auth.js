const express = require('express');
const authRoute = express.Router();


const authController = require('../controllers/authController')


// POST route for user signup
authRoute.post('/signup', authController.signup); 

module.exports = authRoute;
