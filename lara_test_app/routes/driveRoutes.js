const express = require('express');
const driveRoute = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const driveController = require('../controllers/driveController');

driveRoute.post('/saveDrive', verifyToken, driveController.saveDrive);
driveRoute.post('/updateDrive', verifyToken, driveController.updateDrive);
driveRoute.get('/getAllDrives', verifyToken, driveController.getAllDrives);
driveRoute.get('/getDrivesByCompanyId', verifyToken, driveController.getDrivesByCompanyId);
//driveRoute.get('/getDrivesByJobId', verifyToken, driveController.getDrivesByJobId);
// driveRoute.post('/addSkillsToDrive', verifyToken, driveController.addSkillsToDrive);
// driveRoute.delete('/removeSkillFromDrive', verifyToken, driveController.removeSkillFromDrive);
// driveRoute.get('/getStudentsByDriveId', verifyToken, driveController.getStudentsByDriveId);

driveRoute.post('/fetchDrivesByDate', verifyToken, driveController.fetchDrivesByDate);
driveRoute.post('/fetchDrivesByYear', verifyToken, driveController.fetchDrivesByYear);
driveRoute.post('/fetchDrivesByMonth', verifyToken, driveController.fetchDrivesByMonth);
driveRoute.post('/fetchDrivesBetweenDates', verifyToken, driveController.fetchDrivesBetweenDates);
driveRoute.get('/fetchAll', verifyToken, driveController.fetchAll);

module.exports = driveRoute;