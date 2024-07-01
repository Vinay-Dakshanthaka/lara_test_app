const express = require('express');
const skillRoute = express.Router();
const verifyToken = require('../middleware/authMiddleware')
const skillController = require('../controllers/skillController')

skillRoute.post('/saveSkill', verifyToken, skillController.saveSkill);
skillRoute.put('/updateSkill', verifyToken, skillController.updateSkill);
skillRoute.delete('/deleteSkill', verifyToken, skillController.deleteSkill);
skillRoute.get('/getAllSkills', verifyToken, skillController.getAllSkills);
//skillRoute.get('/getAgentByCompanyId', verifyToken, skillController.getAgentByCompanyId);

module.exports = skillRoute