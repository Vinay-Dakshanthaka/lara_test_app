module.exports = (sequelize, DataTypes) => {
    const AgentInteraction = sequelize.define("AgentInteraction", {
        interaction_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        agent_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        interaction_info: {
            type: DataTypes.STRING,
            allowNull: false
        },
        interaction_date: {
            type: DataTypes.STRING,
            allowNull: false
        },
        interaction_time: {
            type: DataTypes.STRING,
            allowNull: false
        },
        next_interaction_date: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        timestamps: false
    });

    AgentInteraction.associate = (models) => {
        AgentInteraction.belongsTo(models.Agent, {
            foreignKey: 'agent_id',
            as: 'agent',
            onDelete: 'CASCADE'
        });
    };

    return AgentInteraction;
};
