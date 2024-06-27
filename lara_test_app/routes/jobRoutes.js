const express = require('express');
const jobRoute = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const jobController = require('../controllers/jobController');

jobRoute.post('/saveJob', verifyToken, jobController.saveJob);

module.exports = jobRoute