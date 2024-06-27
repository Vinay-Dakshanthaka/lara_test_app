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
        company_type: {
            type : DataTypes.STRING,
            allowNull: false
        },
        url: {
            type : DataTypes.STRING,
            allowNull: false
        },
        general_mail_id: {
            type : DataTypes.STRING,
            allowNull: false
        },
        phoneNumber: {
            type : DataTypes.STRING,
            allowNull: false
        },
        isActive:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        description: DataTypes.STRING,
        company_logo: DataTypes.STRING,
        
        
        // imagePath: {
        //     type: DataTypes.STRING, 
        //     allowNull: true, 
        //   }
    },{
        timestamps: false // Disable createdAt and updatedAt
    });

    Company.associate = (models) => {
        Company.hasMany(models.Agent, {
            foreignKey: 'company_id',
            as: 'agents'
        });
    };

    return Company;
};


//IF any rows are added/Deleted please Type SQL query here For implementing in DataBase
