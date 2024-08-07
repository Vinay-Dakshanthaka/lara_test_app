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

companyRoute.get('/company/:company_id',verifyToken,companyController.getCompanyDetailsById);

companyRoute.post('/uploadCompanyLogo', companyLogo.single('image'), verifyToken,companyController.uploadCompanyLogo);

companyRoute.get('/getCompanyLogo',verifyToken,companyController.getCompanyLogo);

companyRoute.post('/getAnyImageLogo',companyController.getAnyImageLogo);

companyRoute.post('/saveCompanyType',verifyToken,companyController.saveCompanyType);

companyRoute.post('/updateCompanyType',verifyToken,companyController.updateCompanyType);

companyRoute.get('/getAllCompanyTypes',verifyToken,companyController.getAllCompanyTypes);

companyRoute.get('/getCompanyByCompanyId',verifyToken,companyController.getCompanyByCompanyId);

module.exports = companyRoute