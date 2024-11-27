const { DataTypes } = require("sequelize");
const { genderEnum, userRoles } = require("../enums");

module.exports.SearchModel = (sequelize) => {
  return sequelize.define(
    "Search",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      // searchType: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      // },
      searchTerm: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // userId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      // },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );
};



