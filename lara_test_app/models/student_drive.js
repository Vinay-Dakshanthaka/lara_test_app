const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    const StudentDrive = sequelize.define("StudentDrive", {
        student_id : {
            type : DataTypes.STRING,
            allowNull : false
        },
        drive_id : {
            type : DataTypes.INTEGER,
            allowNull : false
        },
        round_1 : {
            type : DataTypes.BOOLEAN,
            defaultValue : false
        },
        round_2 : {
            type : DataTypes.BOOLEAN,
            defaultValue : false
        },
        round_3 : {
            type : DataTypes.BOOLEAN,
            defaultValue : false
        },
        round_4 : {
            type : DataTypes.BOOLEAN,
            defaultValue : false
        },
        round_5 : {
            type : DataTypes.BOOLEAN,
            defaultValue : false
        },
        result: {
            type: DataTypes.ENUM('ACCEPTED', 'REJECTED')
        }
    });
    return StudentDrive;
}