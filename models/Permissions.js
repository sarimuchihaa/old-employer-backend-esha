const { DataTypes } = require("sequelize");
const { userRoles } = require("../enums");

module.exports.PermissionModal = (sequelize) => {
  return sequelize.define(
    "Permissions",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM(userRoles),
        allowNull: false,
        unique: true,
      },

      permissions: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          isValidPermissions(value) {
            if (!Array.isArray(value)) {
              throw new Error("Permissions must be an array.");
            }
            value.forEach((permissionObj) => {
              if (
                typeof permissionObj !== "object" ||
                !permissionObj.permissionCategory ||
                !Array.isArray(permissionObj.permissionsValue)
              ) {
                throw new Error(
                  "Each permission must have a permissionCategory and an array of permissionsValue."
                );
              }
            });
          },
        },
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );
};
