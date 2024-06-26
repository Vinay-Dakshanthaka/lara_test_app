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
db.Job = require('./jobModel')(sequelize, DataTypes);
db.Drive = require('./driveModel')(sequelize, DataTypes);
db.StudentDrive = require('./student_drive')(sequelize, DataTypes);

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
    as: 'companies',
    onDelete: 'CASCADE'
});

db.Agent.belongsTo(db.Company, {
    foreignKey: 'company_id',
    onDelete: 'CASCADE'
});

module.exports = db;
