const { User } = require("../db");

const isUserExist = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });
    return !!user;
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = {
  isUserExist,
};
