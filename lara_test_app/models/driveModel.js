const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    const Drive = sequelize.define("Drive", {
        drive_id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        company_id : {
            type : DataTypes.STRING,
            allowNull : false
        },
        job_id : {
            type : DataTypes.INTEGER,
            allowNull : false
        },
        drive_date : {
            type : DataTypes.STRING,
            allowNull : false
        },
        drive_location : {
            type : DataTypes.STRING,
            allowNull : false
        }
    });
    return Drive;
}