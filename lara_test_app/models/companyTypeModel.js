module.exports = (sequelize, DataTypes) => {
    const CompanyType = sequelize.define("CompanyType", {
        companyType_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        }
    }, {
        timestamps: false // Disable createdAt and updatedAt
    });

    CompanyType.associate = (models) => {
        CompanyType.hasMany(models.Company, {
            foreignKey: 'companyType_id',
            as: 'companies'
        });
    };

    return CompanyType;
};