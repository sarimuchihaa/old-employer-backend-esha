const { DataTypes } = require("sequelize");
const { genderEnum, userRoles } = require("../enums");

module.exports.UserModel = (sequelize) => {
  return sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("user", userRoles),
        allowNull: false,
      },
      industry: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      watchlist: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
      },
      followers: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      following: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      availability: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );
};

// Migration file example for creating FULLTEXT index

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.sequelize.query(`
//       ALTER TABLE Profiles ADD FULLTEXT INDEX fulltext_index (firstName, lastName, country, skills);
//     `);
//   },

//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.sequelize.query(`
//       ALTER TABLE Profiles DROP INDEX fulltext_index;
//     `);
//   }
// };


