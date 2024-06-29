module.exports = (sequelize, DataTypes) => {
    const Company = sequelize.define("Company", {
        company_id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: DataTypes.STRING,
        type: {
            type : DataTypes.STRING,
            allowNull: false
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        general_mail_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: DataTypes.STRING,
        company_logo: DataTypes.STRING
    }, {
        timestamps: false // Disable createdAt and updatedAt
    });

    Company.associate = (models) => {
        Company.hasMany(models.Agent, {
            foreignKey: 'company_id',
            as: 'agents',
            onDelete: 'CASCADE'
        });
        Company.hasMany(models.Job, {
            foreignKey: 'company_id',
            as: 'jobs'
        });
    };

    return Company;
};