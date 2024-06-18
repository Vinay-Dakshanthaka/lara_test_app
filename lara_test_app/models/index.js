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
db.User = require('./userModel')(sequelize, DataTypes);
db.Profile = require('./profileModel')(sequelize, DataTypes);


db.User.hasOne(db.Profile, {
    foreignKey: 'user_id',
    as: 'profile',
    onDelete: 'CASCADE'
});

db.Profile.belongsTo(db.User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});



module.exports = db;
