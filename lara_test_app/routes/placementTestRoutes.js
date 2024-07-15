const express = require('express');
const placementTestRoute = express.Router();
const verifyToken = require('../middleware/authMiddleware')
const placementTestContoller = require('../controllers/placementTestController')

placementTestRoute.post('/create-test-link', placementTestContoller.createPlacementTestLink); 
placementTestRoute.post('/save-placement-test-student', placementTestContoller.savePlacementTestStudent); 

module.exports = placementTestRoute;
