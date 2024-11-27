const { DataTypes } = require("sequelize");
const { genderEnum, userRoles } = require("../enums");

module.exports.CommentsModal = (sequelize) => {
    return sequelize.define(
        "Comments",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
            },
            employerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            candidateId: {
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
