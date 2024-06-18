module.exports = (sequelize, DataTypes) => {
    const Profile = sequelize.define("Profile", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false
        },
        highest_education: DataTypes.STRING,
        year_of_passout: DataTypes.INTEGER,
        specialization: DataTypes.STRING,
        highest_education_percent: DataTypes.FLOAT,
        tenth_percentage: DataTypes.FLOAT,
        twelth_percentage: DataTypes.FLOAT,
        
        mobile_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        father_name: DataTypes.STRING,
        father_mobile_number: DataTypes.STRING,
        father_occupation: DataTypes.STRING,
        mother_name: DataTypes.STRING,
        adhaar_number: DataTypes.STRING,
        address: DataTypes.STRING,
        pincode: DataTypes.STRING,
        city: DataTypes.STRING,
        district: DataTypes.STRING,
        state: DataTypes.STRING,
        country: DataTypes.STRING,
        // imagePath: {
        //     type: DataTypes.STRING, 
        //     allowNull: true, 
        //   }
    },{
        timestamps: false // Disable createdAt and updatedAt
    });

    Profile.associate = (models) => {
        // Define association with the Students table
        Profile.belongsTo(models.User, {
            foreignKey: 'user_id', // Explicitly specify the foreign key field
            onDelete: 'CASCADE' // Delete the profile if the associated student is deleted
        });
    };

    return Profile;
};


//IF any rows are added/Deleted please Type SQL query here For implementing in DataBase
