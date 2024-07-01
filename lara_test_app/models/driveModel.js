const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    const Drive = sequelize.define("Drive", {
        drive_id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        job_title : {
            type : DataTypes.STRING,
            allowNull : false
        },
        job_description : {
            type : DataTypes.STRING,
            allowNull : false
        },
        company_id : {
            type : DataTypes.STRING,
            allowNull : false
        },
        no_of_openings : DataTypes.INTEGER,
        position : DataTypes.STRING,
        job_location : DataTypes.STRING,
        // job_id : {
        //     type : DataTypes.INTEGER,
        //     allowNull : false
        // },
        drive_date : {
            type : DataTypes.STRING,
            allowNull : false
        },
        drive_location : {
            type : DataTypes.STRING,
            allowNull : false
        }
    });

    Drive.associate = (models) => {
        Drive.belongsTo(models.Company, {
            foreignKey: 'company_id',
            as: 'companies'
        });
    }

    return Drive;
}