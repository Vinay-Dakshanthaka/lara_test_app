const express = require('express');
const companyRoute = express.Router();
const verifyToken = require('../middleware/authMiddleware')
const companyController = require('../controllers/companyController')
const multer = require('multer');
const companyLogo = multer({dest: 'CompanyLogos/'});

companyRoute.post('/saveCompany', verifyToken, companyController.saveCompany);
companyRoute.put('/updateCompany',verifyToken,companyController.updateCompany);
//companyRoute.delete('/deleteCompany',verifyToken,companyController.deleteCompany);
companyRoute.get('/getCompanyByCompanyId',verifyToken,companyController.getCompanyByCompanyId);
companyRoute.get('/getAllCompanyDetails',verifyToken,companyController.getAllCompanyDetails);
companyRoute.post('/uploadCompanyLogo', companyLogo.single('image'), verifyToken,companyController.uploadCompanyLogo);
companyRoute.get('/getCompanyLogo',verifyToken,companyController.getCompanyLogo);

module.exports = companyRoute