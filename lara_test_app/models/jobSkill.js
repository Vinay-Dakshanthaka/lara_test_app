// const { DataTypes } = require("sequelize");
// const { sequelize } = require(".");

// module.exports = (sequelize, DataTypes) => {
//     const Job_Skill = sequelize.define("Job_Skill", {
//         job_id : {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             primaryKey: true,
//             references: {
//                 model: 'Job',
//                 key: 'job_id'
//             }
//         },
//         skill_id : {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             primaryKey: true,
//             references: {
//                 model: 'Skill',
//                 key: 'skill_id'
//             }
//         },
//         tableName: 'Job_Skill',
//         timestamps: false 
//     });
//     return Job_Skill;
// }