require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const router = require('./routes/adminRoutes');
const authRoute = require('./routes/authRoutes');
const profileRoute = require('./routes/profileRoutes')
const db = require('./models'); // Ensure this matches your Sequelize setup file path
const adminRoute = require('./routes/adminRoutes');

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
