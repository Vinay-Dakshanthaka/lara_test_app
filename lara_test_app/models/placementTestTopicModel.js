module.exports = (sequelize, DataTypes) => {
    const PlacementTestTopic = sequelize.define('PlacementTestTopic', {
        placement_test_topic_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        placement_test_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'placementtests', // Specify the actual table name
                key: 'placement_test_id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        topic_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'topics',
                key: 'topic_id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    }, {
        timestamps: true, // Enabling timestamps for tracking purposes
        tableName: 'placementtesttopics' // Specify the actual table name if different from model name
    });

    PlacementTestTopic.associate = (models) => {
        PlacementTestTopic.belongsTo(models.PlacementTest, {
            foreignKey: 'placement_test_id',
            as: 'placementtest'
        });
        PlacementTestTopic.belongsTo(models.Topic, {
            foreignKey: 'topic_id',
            // as: 'topics'
            as: 'Topics'
        });
    };
 
    return PlacementTestTopic;
};
