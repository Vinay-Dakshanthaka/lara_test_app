const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    const Student_Job = sequelize.define("Student_Job", {
        student_id : {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'Student',
                key: 'student_id'
            }
        },
        job_id : {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Job',
                key: 'job_id'
            }
        },
        rounds_cleared : {
            type : DataTypes.INTEGER,
            defaultValue : false
        },
        result : {
            type: DataTypes.ENUM('SELECTED', 'REJECTED'),
            allowNull: false 
        }
    }, {
        tableName: 'Student_Job',
        timestamps: false 
    });
    return Student_Job;
}