const express = require('express');
const adminRoute = express.Router();
const verifyToken = require('../middleware/authMiddleware')
const adminController = require('../controllers/adminController')

adminRoute.post('/update-role',verifyToken,adminController.updateRole);

adminRoute.get('/all-student-details',verifyToken,adminController.getAllStudentDetails);

adminRoute.post('/send-notification-mail',verifyToken,adminController.sendNotificationEmails);

module.exports = adminRoute