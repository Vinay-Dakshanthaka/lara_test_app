const express = require('express');
const profileRoute = express.Router();
const profileController = require('../controllers/profileController'); 

// profileRoute.get('/getprofile', async(req, res) => {
//     return res.status(200).send({message: "Profile Fetched"})
// })

profileRoute.post('/saveOrUpdateProfile', profileController.saveOrUpdateProfile);

profileRoute.get('/getProfileDetails', profileController.getProfileDetails);

profileRoute.post('/getProfileDetailsById', profileController.getProfileDetailsById);


module.exports = profileRoute;