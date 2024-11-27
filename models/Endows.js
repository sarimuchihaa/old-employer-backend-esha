const { DataTypes } = require("sequelize");

module.exports.EndowsModel = (sequelize) => {
    return sequelize.define(
        "Endows",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            emp_thougts: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            companyId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
            timestamps: true,
        }
    );
};
