module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true 
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        imagePath: {
            type: DataTypes.STRING, 
            allowNull: true
        },
        role: {
            type: DataTypes.ENUM('STUDENT', 'SUPER ADMIN','PLACEMENT OFFICER'),
            allowNull: false
        },
        college_id: {
            type: DataTypes.INTEGER, 
            allowNull: true
        }
    }, {
        timestamps: false // Disable createdAt and updatedAt
    });

    return User;
};
