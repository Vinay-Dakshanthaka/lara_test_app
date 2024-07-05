const express = require('express');
const agentInteractionRoute = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const agentInteractionController = require('../controllers/agentInteractionController');

agentInteractionRoute.post('/saveAgentInteraction', verifyToken, agentInteractionController.saveAgentInteraction);
agentInteractionRoute.get('/getAgentInteractionByAgentId', verifyToken, agentInteractionController.getAgentInteractionByAgentId)
agentInteractionRoute.get('/getAllAgentInteractions', verifyToken, agentInteractionController.getAllAgentInteractions);
agentInteractionRoute.put('/updateInteractionByAgentId', verifyToken, agentInteractionController.updateInteractionByAgentId);
agentInteractionRoute.put('/updateInteractionById',verifyToken, agentInteractionController.updateInteractionById);
agentInteractionRoute.get('/getInteractionsWithAgents', verifyToken, agentInteractionController.getInteractionsWithAgents);


module.exports = agentInteractionRoute;