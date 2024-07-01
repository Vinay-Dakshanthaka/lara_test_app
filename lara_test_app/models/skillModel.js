const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    const Skill = sequelize.define("Skill", {
        skill_id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        name : {
            type : DataTypes.STRING,
            allowNull : false
        }
    });

    return Skill;
}