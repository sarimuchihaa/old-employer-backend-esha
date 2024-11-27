const { DataTypes } = require("sequelize");
const { projectCompletionType } = require("../enums");

module.exports.ProjectsModel = (sequelize) => {
  return sequelize.define(
    "Projects",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      current: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      media: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      completionType: {
        type: DataTypes.ENUM("solo", projectCompletionType),
        defaultValue: "solo",
      },
      associateWith: {
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
