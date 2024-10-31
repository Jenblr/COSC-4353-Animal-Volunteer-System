module.exports = (sequelize, DataTypes) => {
    const State = sequelize.define('State', {
        code: {
            type: DataTypes.STRING(2),
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        timestamps: false // States won't need timestamp tracking
    });

    State.associate = (models) => {
        State.hasMany(models.Profile, {
            foreignKey: 'state',
            sourceKey: 'code'
        });
    };

    return State;
};