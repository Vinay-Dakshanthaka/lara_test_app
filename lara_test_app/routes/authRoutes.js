const express = require('express');
const authRoute = express.Router();
const verifyToken = require('../middleware/authMiddleware')
const multer = require('multer');
const xlsx = require('xlsx');
const imgUpload = multer({dest: 'Images/'});



const authController = require('../controllers/authController')

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

authRoute.post('/signup', authController.signup); 

authRoute.post('/verifyByEmail',authController.verifyByEmail);

authRoute.post('/verifyByPhone',authController.verifyByPhone);

authRoute.get('/student-details',verifyToken,authController.getStudentDetailsById);

authRoute.get('/getStudentDetails',verifyToken,authController.getStudentDetails);

authRoute.get('/all-student-details',verifyToken,authController.getAllStudentDetails);

authRoute.post('/bulk-signup', upload.single('file'),verifyToken,authController.bulkSignup);

authRoute.post('/single-signup',verifyToken, authController.signupSingle);

authRoute.post('/uploadProfileImage', imgUpload.single('file'), verifyToken, authController.uploadProfileImage);

authRoute.get('/getProfileImage',verifyToken, authController.getProfileImage);

authRoute.get('/getProfileImageFor', authController.getProfileImageFor);

module.exports = authRoute;