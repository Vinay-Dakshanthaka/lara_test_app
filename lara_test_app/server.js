require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const router = require('./routes/adminRoutes');
const authRoute = require('./routes/authRoutes');
const profileRoute = require('./routes/profileRoutes')
const db = require('./models'); // Ensure this matches your Sequelize setup file path
const adminRoute = require('./routes/adminRoutes');
const cumulativeTestRouter = require('./routes/cumulativeTestRoutes');
const companyRoute = require('./routes/companyRoutes');
const agentRoute = require('./routes/agentRoutes');
const jobRoute = require('./routes/jobRoutes');
const driveRoute = require('./routes/driveRoutes');
const WebinarTraingsRoute = require('./routes/WebinarTrainingsRoutes')

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors()); 
app.use(express.json()); 

// Routes
app.use('/api/test', router);
app.use('/api/auth/student', authRoute);
app.use('/api/student/profile', profileRoute); 
app.use('/api/admin/activites',adminRoute);
app.use('/api/test/cumulativeTest',cumulativeTestRouter);
app.use('/api/company',companyRoute);
app.use('/api/agent', agentRoute);
app.use('/api/job', jobRoute);
app.use('/api/drive', driveRoute);
app.use('/api/webinars', WebinarTraingsRoute)

// Port
const PORT = process.env.PORT || 8080;

db.sequelize.sync({ force: false })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.error('Error synchronizing database:', error);
    });



    // job.name = name;
    //     job.description = description;
    //     job.no_of_openings = no_of_openings;
    //     job.job_location = job_location;
    //     job.position = position;

    //     await job.save();

    //     res.status(200).send({message : 'Job successfully updated' , job});