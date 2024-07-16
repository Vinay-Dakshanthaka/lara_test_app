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
db.Drive = require('./driveModel')(sequelize, DataTypes);
db.Job = require('./jobModel')(sequelize, DataTypes);
db.Student_Job = require('./studentJob.js')(sequelize, DataTypes);
db.Skill = require('./skillModel.js')(sequelize, DataTypes);
db.Job_Skill = require('./jobSkill.js')(sequelize, DataTypes);
db.Student_Skill = require('./studentSkill.js')(sequelize, DataTypes);
db.WebinarsTrainings = require('./WebinarTrainings.js')(sequelize, DataTypes);
db.CompanyType = require('./companyTypeModel')(sequelize, DataTypes);
db.AgentInteraction = require('./agentInteractionModel.js')(sequelize, DataTypes);
db.PlacementTest = require('./placementTestModel.js')(sequelize, DataTypes);
db.PlacementTestTopic = require('./placementTestTopicModel.js')(sequelize, DataTypes);
db.PlacementTestStudent = require('./placementTestStudentsModel.js')(sequelize, DataTypes);
db.PlacementTestResult = require('./placementTestResultModel.js')(sequelize, DataTypes);

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

db.CompanyType.hasMany(db.Company, {
    foreignKey: 'companyType_id',
    as: 'companies'
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

db.Drive.hasMany(db.Job, {
    foreignKey: 'drive_id',
    as: 'jobs',
    onDelete: 'CASCADE'
});

db.Job.belongsTo(db.Drive, {
    foreignKey: 'drive_id',
    onDelete: 'CASCADE'
});

// Associations
db.PlacementTest.hasMany(db.PlacementTestTopic, {
    foreignKey: 'placement_test_id',
    // as: 'topics'
    as: 'Topics'
});

db.PlacementTestTopic.belongsTo(db.PlacementTest, {
    foreignKey: 'placement_test_id',
    onDelete: 'CASCADE'
});

db.Topic.hasMany(db.PlacementTestTopic, {
    foreignKey: 'topic_id',
});

db.PlacementTestTopic.belongsTo(db.Topic, {
    foreignKey: 'topic_id',
    onDelete: 'CASCADE'
});

db.PlacementTest.hasMany(db.PlacementTestResult, {
    foreignKey: 'placement_test_id',
    as: 'results'
});

db.PlacementTestResult.belongsTo(db.PlacementTest, {
    foreignKey: 'placement_test_id',
    onDelete: 'CASCADE'
});

// Define associations for PlacementTestStudent
db.PlacementTestStudent.hasMany(db.PlacementTestResult, {
    foreignKey: 'placement_test_student_id',
    as: 'results'
});

db.PlacementTestResult.belongsTo(db.PlacementTestStudent, {
    foreignKey: 'placement_test_student_id',
    onDelete: 'CASCADE'
});

//ManyToMany between Student & Job
db.Student.belongsToMany(db.Job, { through: 'Student_Job', foreignKey: 'student_id' });
db.Job.belongsToMany(db.Student, { through: 'Student_Job', foreignKey: 'job_id' });

//ManyToMany between Job & Skill
db.Job.belongsToMany(db.Skill, { through: 'Job_Skill', foreignKey: 'job_id' });
db.Skill.belongsToMany(db.Job, { through: 'Job_Skill', foreignKey: 'skill_id' });

//ManyToMany between Student & Skill
db.Student.belongsToMany(db.Skill, { through: 'Student_Skill', foreignKey: 'student_id' });
db.Skill.belongsToMany(db.Student, { through: 'Student_Skill', foreignKey: 'skill_id' });

//One to many relationship between Agent and Agent Interaction

db.Agent.hasMany(db.AgentInteraction, {
    foreignKey: 'agent_id',
    as: 'interactions',
    onDelete: 'CASCADE'
});

db.AgentInteraction.belongsTo(db.Agent, {
    foreignKey: 'agent_id',
    as: 'agent',
    onDelete: 'CASCADE'
});

module.exports = db;
