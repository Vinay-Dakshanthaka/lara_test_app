const express = require('express');
const WebinarTraingsRoute = express.Router();
const webinarTrainigsController = require('../controllers/WebinarTrainigsController'); 
const verifyToken = require('../middleware/authMiddleware')

WebinarTraingsRoute.post('/add-webinars-trainings', verifyToken, webinarTrainigsController.addWebinarsTrainings);
WebinarTraingsRoute.get('/getAllWebinars', verifyToken, webinarTrainigsController.getAllWebinarsTrainings);
WebinarTraingsRoute.get('/get-webinars-training', verifyToken, webinarTrainigsController.getWebinarsTrainingsById);
WebinarTraingsRoute.put('/update-webinars-Trainings', verifyToken, webinarTrainigsController.updateWebinarsTrainings);
WebinarTraingsRoute.delete('/delete-webinars', verifyToken, webinarTrainigsController.deleteWebinarsTrainings);

module.exports = WebinarTraingsRoute;
