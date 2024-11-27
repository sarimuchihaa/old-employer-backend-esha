require("dotenv").config();
const { Sequelize } = require("sequelize");
const { UserModel } = require("./models/User");
const { ProfileModel } = require("./models/Profile");
const { ExperienceModel } = require("./models/Experience");
const { EducationModel } = require("./models/Education");
const { ProjectsModel } = require("./models/Projects");
const { CompanyModel } = require("./models/company");
const { transport } = require("./services/email.service");
const { ShortListModal } = require("./models/shortList");
const { VisitorsModal } = require("./models/visitor");
const { ReviewsModel } = require("./models/Reviews");
const { EndowsModel } = require("./models/Endows");
const { PermissionModal } = require("./models/Permissions");
const { SearchModel } = require("./models/Search");
const { SuperadminModel } = require("./models/Superadmin");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("💾 Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

// Create Models
const User = UserModel(sequelize);
const Profile = ProfileModel(sequelize);
const Education = EducationModel(sequelize);
const Experience = ExperienceModel(sequelize);
const Projects = ProjectsModel(sequelize);
const shortlist = ShortListModal(sequelize);
const visitor = VisitorsModal(sequelize);
const company = CompanyModel(sequelize);
const Reviews = ReviewsModel(sequelize);
const Endows = EndowsModel(sequelize);
const Permissions = PermissionModal(sequelize);
const Search = SearchModel(sequelize);
const Superadmin = SuperadminModel(sequelize);

// Profile and user table relation
User.hasOne(Profile);
Profile.belongsTo(User);

User.hasOne(Permissions);
Permissions.belongsTo(User);

// User and education table relation
User.hasMany(Education);
Education.belongsTo(User);

// User and experience table relation
User.hasMany(Experience);
Experience.belongsTo(User);

// User and projects table relation
User.hasMany(Projects);
Projects.belongsTo(User);

// User and company table relation
User.hasMany(company, {
  as: "ownerList",
  foreignKey: "ownerId",
  sourceKey: "id",
});

company.belongsTo(User, {
  as: "owner",
  foreignKey: "ownerId",
  targetKey: "id",
});

// user and shortlist table relation
shortlist.belongsTo(User, {
  as: "Employer",
  foreignKey: "employerId",
  targetKey: "id",
});
shortlist.belongsTo(User, {
  as: "Candidate",
  foreignKey: "candidateId",
  targetKey: "id",
});

User.hasMany(shortlist, {
  as: "EmployerShortlistings",
  foreignKey: "employerId",
  sourceKey: "id",
});
User.hasMany(shortlist, {
  as: "CandidateShortlistings",
  foreignKey: "candidateId",
  sourceKey: "id",
});

// user and visitor table relation
visitor.belongsTo(User, {
  as: "visitor",
  foreignKey: "visitorId",
  targetKey: "id",
});
visitor.belongsTo(User, {
  as: "profile",
  foreignKey: "profileId",
  targetKey: "id",
});

User.hasMany(visitor, {
  as: "visitorsListings",
  foreignKey: "visitorId",
  sourceKey: "id",
});
User.hasMany(visitor, {
  as: "profileListings",
  foreignKey: "profileId",
  sourceKey: "id",
});

// User, company and review, 
Reviews.belongsTo(company, { foreignKey: "companyId" });
Reviews.belongsTo(User, { foreignKey: "review_by" });
company.hasMany(Reviews, { foreignKey: "companyId" });
User.hasMany(Reviews, { foreignKey: "review_by" });
company.hasMany(Endows, { foreignKey: "companyId" });
User.hasMany(Endows, { foreignKey: "endows_by" });
// Endows.hasOne(Reviews, { foreignKey: "review_by", constraints: false }); 

// endows, reveiws model relations
Endows.belongsTo(company, { foreignKey: "companyId" });
Endows.belongsTo(User, { foreignKey: "endows_by" });
Reviews.belongsTo(company, { foreignKey: "companyId" });
Reviews.belongsTo(User, { foreignKey: "review_by" });
// Reviews.belongsTo(Endows, { foreignKey: "endows_by", constraints: false });

if (process.env.MIGRATE_DB == "TRUE") {
  sequelize.sync().then(() => {
    console.log(`All tables synced!`);
  });
}

transport
  .verify()
  .then(() => console.log("Connected to email server"))
  .catch(() =>
    console.log(
      "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
    )
  );

module.exports = {
  User,
  Superadmin,
  Profile,
  Education,
  Experience,
  Projects,
  company,
  Reviews,
  Endows,
  sequelize,
  Permissions,
  Search,
  shortlist
};
