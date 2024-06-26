const express = require('express');
const companyRoute = express.Router();
const verifyToken = require('../middleware/authMiddleware')
const companyController = require('../controllers/companyController')
const multer = require('multer');
const companyLogo = multer({dest: 'CompanyLogos/'});

companyRoute.post('/saveCompany', companyLogo.single('file'), verifyToken, companyController.saveCompany);
companyRoute.put('/updateCompany',verifyToken,companyController.updateCompany);
companyRoute.delete('/deleteCompany',verifyToken,companyController.deleteCompany);
companyRoute.get('/getAllCompanyDetails',verifyToken,companyController.getAllCompanyDetails);

module.exports = companyRoute