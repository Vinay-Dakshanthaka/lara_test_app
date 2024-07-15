module.exports = (sequelize, DataTypes) => {
    const PlacementTest = sequelize.define('PlacementTest', {
        placement_test_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        test_link: {
            type: DataTypes.STRING,
            allowNull: false
        },
        number_of_questions: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        start_time: {
            type: DataTypes.DATE,
            allowNull: false
        },
        end_time: {
            type: DataTypes.DATE,
            allowNull: false
        },
        show_result: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        timestamps: true, // Enabling timestamps for tracking purposes
        tableName: 'placementtests' // Specify the actual table name
    });

    return PlacementTest;
}; 
