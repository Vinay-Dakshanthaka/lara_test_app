const dbConfig = require('../config/dbConfig.js');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

sequelize.authenticate()
    .then(() => {
        console.log('Connected to the database.');
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
    });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.Student = require('./studentModel')(sequelize, DataTypes);
db.Profile = require('./profileModel')(sequelize, DataTypes);
db.Subject = require('./subjectModel')(sequelize, DataTypes);
db.Topic = require('./topicModel')(sequelize, DataTypes);
db.TestResults = require('./testResultModel')(sequelize, DataTypes);
db.CumulativeQuestion = require('./cumulativeQuestionModel')(sequelize, DataTypes);
db.Company = require('./companyModel')(sequelize, DataTypes);
db.Agent = require('./agentModel')(sequelize, DataTypes);
//db.Job = require('./jobModel')(sequelize, DataTypes);
db.Drive = require('./driveModel')(sequelize, DataTypes);
db.Student_Drive = require('./studentDrive.js')(sequelize, DataTypes);
db.Skill = require('./skillModel.js')(sequelize, DataTypes);
//db.Job_Skill = require('./jobSkill.js')(sequelize, DataTypes);

db.Student.hasOne(db.Profile, {
    foreignKey: 'student_id',
    as: 'profile',
    onDelete: 'CASCADE'
});

db.Profile.belongsTo(db.Student, {
    foreignKey: 'student_id',
    onDelete: 'CASCADE'
});

db.Subject.hasMany(db.Topic, {
    foreignKey: 'subject_id',
    as: 'topics',
    onDelete: 'CASCADE'
});

db.Topic.belongsTo(db.Subject, {
    foreignKey: 'subject_id',
    onDelete: 'CASCADE'
});

db.Topic.hasMany(db.CumulativeQuestion, {
    foreignKey: 'topic_id',
    as: 'cumulativequestions',
    onDelete: 'CASCADE'
});

db.CumulativeQuestion.belongsTo(db.Topic, {
    foreignKey: 'topic_id',
    onDelete: 'CASCADE'
});

db.Company.hasMany(db.Agent, {
    foreignKey: 'company_id',
    as: 'agents',
    onDelete: 'CASCADE'
});

db.Agent.belongsTo(db.Company, {
    foreignKey: 'company_id',
    onDelete: 'CASCADE'
});

db.Company.hasMany(db.Drive, {
    foreignKey: 'company_id',
    as: 'drives',
    onDelete: 'CASCADE'
});

db.Drive.belongsTo(db.Company, {
    foreignKey: 'company_id',
    onDelete: 'CASCADE'
});

// db.Job.hasOne(db.Drive, {
//     foreignKey: 'job_id',
//     as: 'drives',
//     onDelete: 'CASCADE'
// });

// db.Drive.belongsTo(db.Job, {
//     foreignKey: 'job_id',
//     onDelete: 'CASCADE'
// });

//ManyToMany between Student & Drive
db.Student.belongsToMany(db.Drive, { through: 'Student_Drive', foreignKey: 'student_id' });
db.Drive.belongsToMany(db.Student, { through: 'Student_Drive', foreignKey: 'drive_id' });

//ManyToMany between Job & Skill
// db.Job.belongsToMany(db.Skill, { through: 'Job_Skill', foreignKey: 'job_id' });
// db.Skill.belongsToMany(db.Job, { through: 'Job_Skill', foreignKey: 'skill_id' });

module.exports = db;
