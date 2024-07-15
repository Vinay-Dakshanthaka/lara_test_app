module.exports = (sequelize, DataTypes) => {
    const PlacementTestStudent = sequelize.define('PlacementTestStudent', {
        placement_test_student_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        student_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        }
    }, {
        timestamps: true, // Enabling timestamps for tracking purposes
        tableName: 'placementteststudents' // Specify the actual table name
    });

    return PlacementTestStudent;
};
