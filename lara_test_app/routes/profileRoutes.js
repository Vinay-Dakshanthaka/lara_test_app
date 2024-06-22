const express = require('express');
const profileRoute = express.Router();
const profileController = require('../controllers/profileController'); 
const verifyToken = require('../middleware/authMiddleware')

// profileRoute.get('/getprofile', async(req, res) => {
//     return res.status(200).send({message: "Profile Fetched"})
// })

profileRoute.post('/saveOrUpdateProfile', verifyToken, profileController.saveOrUpdateProfile);

profileRoute.get('/getProfileDetails', verifyToken, profileController.getProfileDetails);

profileRoute.get('/getAllProfileDetails', verifyToken, profileController.getAllProfileDetails);

profileRoute.get('/getProfileDetailsById', profileController.getProfileDetailsById);

module.exports = profileRoute;