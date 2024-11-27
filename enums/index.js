const genderEnum = ['male', 'female'];
const projectCompletionType = ['contributor', 'solo'];

const roleRights = {
  superadmin: "superadmin",
  admin: 'admin',
  moderator: 'moderator',
  blogmoderator: "blogmoderator",
  forummoderator: "forummoderator",
  employer: "employer",
  featuredemployer: "featuredemployer",
  employermoderator: "employermoderator",
  user: 'user',
};

const userRoles = Object.keys(roleRights);


module.exports = { genderEnum, userRoles, projectCompletionType, roleRights };
