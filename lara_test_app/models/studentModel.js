/* This code snippet is defining a Sequelize model for a "Student" entity in a database using
JavaScript.*/
module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define("Student", {
        student_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            primaryKey: true
        },
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
            allowNull: true
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
            type: DataTypes.ENUM('STUDENT', 'SUPER ADMIN', 'PLACEMENT OFFICER'),
            allowNull: false
        },
        college_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
        // ALTER TABLE laratest.students ADD COLUMN isActive BOOLEAN NOT NULL DEFAULT TRUE;
    }, {
        timestamps: false // Disable createdAt and updatedAt
    });

    return Student;
};
