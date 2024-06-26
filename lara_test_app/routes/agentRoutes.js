const express = require('express');
const agentRoute = express.Router();
const verifyToken = require('../middleware/authMiddleware')
const agentController = require('../controllers/agentController')

agentRoute.post('/saveOrUpdateAgent', verifyToken, agentController.saveOrUpdateAgent);
agentRoute.delete('/deleteAgent', verifyToken, agentController.deleteAgent);
agentRoute.get('/getAllAgentDetails', verifyToken, agentController.getAllAgentDetails);
agentRoute.get('/getAgentByCompanyId', verifyToken, agentController.getAgentByCompanyId);

module.exports = agentRoute