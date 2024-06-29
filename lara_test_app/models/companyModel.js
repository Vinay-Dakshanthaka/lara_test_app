module.exports = (sequelize, DataTypes) => {
    const Company = sequelize.define("Company", {
        company_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: DataTypes.STRING,
        companyType_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'CompanyTypes',
                key: 'companyType_id'
            }
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
        Company.belongsTo(models.CompanyType, {
            foreignKey: 'companyType_id',
            as: 'companyType'
        }); 
    };  

    return Company;
};