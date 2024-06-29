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
            type: DataTypes.STRING,
            allowNull: false
        },
        contactNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        designation: DataTypes.STRING,
        mail_id:{
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        isActive:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue : true
        }
    },{
        timestamps: false
    });

    Agent.associate = (models) => {
        Agent.belongsTo(models.Company, {
            foreignKey: 'company_id',
            as: 'companies',
            onDelete: 'CASCADE'
        }); 
    }

    return Agent;
};