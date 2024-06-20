const express = require('express');
const adminRoute = express.Router();
const verifyToken = require('../middleware/authMiddleware')
const adminController = require('../controllers/adminController')

adminRoute.post('/update-role',verifyToken,adminController.updateRole);

module.exports = adminRoute