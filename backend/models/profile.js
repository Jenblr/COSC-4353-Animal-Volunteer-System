module.exports = (sequelize, DataTypes) => {
    const Profile = sequelize.define('Profile', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        
        // Other fields are optional for admin users
        address1: {
            type: DataTypes.STRING,
            allowNull: true
        },
        address2: {
            type: DataTypes.STRING,
            allowNull: true
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true
        },
        state: {
            type: DataTypes.STRING(2),
            allowNull: true
        },
        zipCode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        skills: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true,
            defaultValue: []
        },
        preferences: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        availability: {
            type: DataTypes.ARRAY(DataTypes.DATE),
            allowNull: true,
            defaultValue: []
        }
    });

    Profile.associate = (models) => {
        Profile.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'User'
        });
    };

    return Profile;
};