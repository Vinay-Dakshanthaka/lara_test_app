const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    const Job = sequelize.define("Job", {
        job_id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        name : {
            type : DataTypes.STRING,
            allowNull : false
        },
        description : {
            type : DataTypes.STRING,
            allowNull : false
        },
        no_of_openings : {
            type : DataTypes.INTEGER
        },
        job_location : {
            type : DataTypes.STRING
        },
        company_id : {
            type : DataTypes.STRING,
            allowNull : false
        }
    });

    Job.associate = (models) => {
        Job.belongsTo(models.Company, {
            foreignKey: 'company_id',
            as: 'companies'
        });
    }

    return Job;
}