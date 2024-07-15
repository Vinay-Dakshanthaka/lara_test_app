const express = require('express');
const cumulativeTestRouter = express.Router();
const multer = require('multer');
const verifyToken = require('../middleware/authMiddleware');
const cumulativeTestController = require('../controllers/cumulativeTestController');
const { Student } = require('../models');
const upload = multer({ dest: 'cumulative_questions/' });

cumulativeTestRouter.post('/saveSubject',verifyToken,cumulativeTestController.saveSubject );

cumulativeTestRouter.put('/updateSubject',verifyToken,cumulativeTestController.updateSubject );

cumulativeTestRouter.delete('/deleteSubject',cumulativeTestController.deleteSubject );

cumulativeTestRouter.get('/getAllSubjects', verifyToken, cumulativeTestController.getAllSubjects );

cumulativeTestRouter.get('/getAllSubjectsAndTopics',verifyToken,cumulativeTestController.getAllSubjectsAndTopics );

cumulativeTestRouter.get('/getSubjectById',verifyToken,cumulativeTestController.getSubjectById );

cumulativeTestRouter.get('/getTopicsBySubjectId',verifyToken,cumulativeTestController.getTopicsBySubjectId );

cumulativeTestRouter.post('/getQuestionsByTopicIds',cumulativeTestController.getQuestionsByTopicIds );

cumulativeTestRouter.post('/getQuestionCountsByTopicIds',verifyToken,cumulativeTestController.getQuestionCountsByTopicIds );

cumulativeTestRouter.get('/getTopicById',verifyToken,cumulativeTestController.getTopicById );

cumulativeTestRouter.post('/saveTopic',verifyToken,cumulativeTestController.saveTopic );

cumulativeTestRouter.put('/updateTopic',verifyToken,cumulativeTestController.updateTopic );

cumulativeTestRouter.delete('/deleteTopic',verifyToken,cumulativeTestController.deleteTopic );

cumulativeTestRouter.post('/saveTestResults',verifyToken,cumulativeTestController.saveTestResults );

cumulativeTestRouter.post('/getTestResultsByTestId',verifyToken,cumulativeTestController.getTestResultsByTestId );

cumulativeTestRouter.get('/getTestResultsByStudentId',verifyToken,cumulativeTestController.getTestResultsByStudentId );

cumulativeTestRouter.get('/getAllTopics', verifyToken, cumulativeTestController.getAllTopics);

cumulativeTestRouter.get('/getAllSubjectsWithTopics', verifyToken, cumulativeTestController.getAllSubjectsWithTopics)

//For Uploading Quesion Topic wise
cumulativeTestRouter.post('/upload-questions',upload.single('file'),verifyToken, async (req, res) => {
     // Fetch the user's role from the database using the user's ID
     const studentId = req.student_id; 
     const user = await Student.findByPk(studentId); // Fetch user from database
     const userRole = user.role; // Get the user's role
     console.log("role :"+userRole)
     // Check if the user role is either "ADMIN" or "SUPER ADMIN"
     if (userRole !== 'SUPER ADMIN' && userRole !== 'PLACEMENT OFFICER') {
         return res.status(403).json({ error: 'Access forbidden' });
     }
    
    const topic_id = req.query.topic_id;
    const filePath = req.file.path; 

    if (!topic_id) {
        return res.status(400).send({ message: "topic_id query parameter is required." });
    }

    try {
        await cumulativeTestController.processExcel(filePath, topic_id);
        res.status(200).send({ message: "Excel data processed successfully." });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
});
 

//for uploading Question Topicid wise
cumulativeTestRouter.post('/uploadQuestionsByTopicId', upload.single('file'), verifyToken, async(req, res) => {
    const studentId = req.student_id;
    const user = await Student.findByPk(studentId);
    const userRole = user.role;

    if(userRole !== 'SUPER ADMIN' && userRole !== 'PLACEMENT OFFICER'){
        return res.status(403),send({message : "Access Forbidden"});
    }

    const filePath = req.file.path;
    try{
        await cumulativeTestController.processExcelOFTopicId(filePath);
        res.status(200).send({ message: "Excel data processed successfully." });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }   
})


module.exports = cumulativeTestRouter