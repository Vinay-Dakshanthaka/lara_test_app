const express = require('express');
const authRoute = express.Router();
const verifyToken = require('../middleware/authMiddleware')
const multer = require('multer');
const xlsx = require('xlsx');


const authController = require('../controllers/authController')

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

authRoute.post('/signup', authController.signup); 

authRoute.post('/verifyByEmail',authController.verifyByEmail);

authRoute.post('/verifyByPhone',authController.verifyByPhone);

authRoute.get('/student-details',verifyToken,authController.getStudentDetailsById);

authRoute.get('/all-student-details',verifyToken,authController.getAllStudentDetails);

authRoute.post('/bulk-signup', upload.single('file'),verifyToken,authController.bulkSignup);

authRoute.post('/single-signup',verifyToken, authController.signupSingle);

authRoute.post('/update-password',verifyToken, authController.updatePassword);

authRoute.post('/password-reset-email', authController.sendPasswordResetEmail);

authRoute.post('/reset-password', authController.resetPassword);

module.exports = authRoute;
