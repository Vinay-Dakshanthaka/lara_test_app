module.exports = (sequelize, DataTypes) => {
    const Agent = sequelize.define("Agent", {
        agent_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        company_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        contactNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        designation: DataTypes.STRING,
        mail_id:{
            type: DataTypes.STRING,
            allowNull: false
        },
        state:{
            type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
            allowNull: false
        }
    },{
        timestamps: false
    });

    Agent.associate = (models) => {
        Agent.belongsTo(models.Company, {
            foreignKey: 'company_id',
            as: 'companies'
        });
    }

    return Agent;
};