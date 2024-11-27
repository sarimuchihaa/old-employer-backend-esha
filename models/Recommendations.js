const { DataTypes } = require("sequelize");
const { genderEnum, userRoles } = require("../enums");

module.exports.RecommendationsModal = (sequelize) => {
    return sequelize.define(
        "Recommendations",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
            },
            employeId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            recommendedBy: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            message: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
            timestamps: true,
        }
    );
};
