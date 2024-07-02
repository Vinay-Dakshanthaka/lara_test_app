const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    const Student_Skill = sequelize.define("Student_Skill", {
        student_id : {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'Student',
                key: 'student_id'
            }
        },
        skill_id : {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Skill',
                key: 'skill_id'
            }
        }
    }, {
        tableName: 'Student_Skill',
        timestamps: false 
    });
    return Student_Skill;
}