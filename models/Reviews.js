const { DataTypes } = require("sequelize");

module.exports.ReviewsModel = (sequelize) => {
  return sequelize.define(
    "Reviews",
    {
      // id: {
      //   type: DataTypes.INTEGER,
      //   primaryKey: true,
      //   autoIncrement: true,
      //   allowNull: false,
      // },
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Automatically generate a UUID for each review
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      emp_status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      emp_thougts: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hide_emp_info: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      compensation: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      work_balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      career_opportunities: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cutlers: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      recommendation: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      suggestions: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      best_worst: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      environment: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      employment: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      insurance: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      residence: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      benovland_fund: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      medical: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      other_benefit: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      salary_range: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pay_on_time: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      bonus: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      increment: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      increment_duration: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      monthly_leaves: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      annually_leaves: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      public_review: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      verification_doc: {
        type: DataTypes.JSON,
        allowNull: true,
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
