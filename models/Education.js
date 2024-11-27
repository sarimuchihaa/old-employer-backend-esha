const { DataTypes } = require("sequelize");

module.exports.EducationModel = (sequelize) => {
  return sequelize.define(
    "Education",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      logo: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      institute: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      degree: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fromDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      toDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      current: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      grade: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );
};
