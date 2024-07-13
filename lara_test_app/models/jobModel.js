const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    const Job = sequelize.define("Job", {
        job_id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        job_title : {
            type : DataTypes.STRING,
            allowNull : false
        },
        description : {
            type : DataTypes.TEXT,
            allowNull : false
        },
        no_of_openings : DataTypes.INTEGER,
        position : DataTypes.STRING,
        job_location : DataTypes.STRING,
        year_of_exp : {
            type : DataTypes.STRING,
            allowNull : false
        },
        drive_id : {
            type : DataTypes.INTEGER,
            allowNull : false
        },
        total_rounds : {
            type : DataTypes.INTEGER,
            allowNull : false
        }
    });

    Job.associate = (models) => {
        Job.belongsTo(models.Drive, {
            foreignKey: 'drive_id',
            as: 'drives'
        });
    }

    return Job;
}