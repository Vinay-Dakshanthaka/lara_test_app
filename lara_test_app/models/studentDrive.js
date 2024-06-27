const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    const Student_Drive = sequelize.define("Student_Drive", {
        student_id : {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Student',
                key: 'student_id'
            }
        },
        drive_id : {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Drive',
                key: 'drive_id'
            }
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
    }, {
        tableName: 'Student_Drive',
        timestamps: false 
    });
    return Student_Drive;
}