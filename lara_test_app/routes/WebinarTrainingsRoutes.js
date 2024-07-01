const express = require('express');
const WebinarTraingsRoute = express.Router();
const webinarTrainigsController = require('../controllers/WebinarTrainigsController'); 
const verifyToken = require('../middleware/authMiddleware')

WebinarTraingsRoute.post('/addwebinarstrainings', verifyToken, webinarTrainigsController.AddWebinarsTrainings);

module.exports = WebinarTraingsRoute;
