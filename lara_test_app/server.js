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
const driveRoute = require('./routes/driveRoutes');
const jobRoute = require('./routes/jobRoutes')
const skillRoute = require('./routes/skillRoutes');
const WebinarTraingsRoute = require('./routes/WebinarTrainingsRoutes')
const AgentInteractionRoute = require('./routes/agentInteractionRoutes')
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const corsOptions = {
//     // origin: 'https://www.laragrooming.com',
//     origin: ['https://paintpulse.in'],
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   };
  
// // Enable CORS 
// app.use(cors(corsOptions)); 

app.use(cors());
// app.use(express.json()); 

// Routes
app.use('/api/test', router);
app.use('/api/auth/student', authRoute);
app.use('/api/student/profile', profileRoute); 
app.use('/api/admin/activites',adminRoute);
app.use('/api/test/cumulative-test',cumulativeTestRouter);
app.use('/api/company',companyRoute); 
app.use('/api/agent', agentRoute);
app.use('/api/job', jobRoute);
app.use('/api/drive', driveRoute);
app.use('/api/skill', skillRoute);
app.use('/api/webinars', WebinarTraingsRoute)
app.use('/api/interaction', AgentInteractionRoute);

// Port
const PORT = process.env.PORT || 5000;

db.sequelize.sync({ force: false })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.error('Error synchronizing database:', error);
    });

