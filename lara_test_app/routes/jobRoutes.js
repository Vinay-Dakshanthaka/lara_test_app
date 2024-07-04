const express = require('express');
const jobRoute = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const jobController = require('../controllers/jobController');

jobRoute.post('/saveJob', verifyToken, jobController.saveJob);
jobRoute.put('/updateJob', verifyToken, jobController.updateJob);
jobRoute.delete('/deleteJob', verifyToken, jobController.deleteJob);
jobRoute.post('/getJobByJobId', verifyToken, jobController.getJobByJobId);
jobRoute.get('/getJobsByDriveId', verifyToken, jobController.getJobsByDriveId);
jobRoute.post('/addSkillsToJob', verifyToken, jobController.addSkillsToJob);
jobRoute.delete('/removeSkillFromJob', verifyToken, jobController.removeSkillFromJob);
jobRoute.get('/getStudentsForJobWithSkills', verifyToken, jobController.getStudentsForJobWithSkills);
jobRoute.post('/sendDriveToStudents', verifyToken, jobController.sendDriveToStudents);
jobRoute.post('/getSkillsByJobId', verifyToken, jobController.getSkillsByJobId);

module.exports = jobRoute