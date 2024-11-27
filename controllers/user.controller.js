const { User, Profile, Experience, Education, Projects, Permissions, company, shortlist } = require("../db");
const { Op } = require("sequelize");
const { sequelize } = require("../db");

const getCurrentUser = async (req, res) => {
  try {
    const {
      user: { id },
    } = req;

    const getUser = await User.findByPk(id, {
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      include: [
        {
          model: Profile,
          attributes: { exclude: ["UserId", "createdAt", "updatedAt"] },
        },
        {
          model: Experience,
          attributes: { exclude: ["UserId", "createdAt", "updatedAt"] },
        },
        {
          model: Education,
          attributes: { exclude: ["UserId", "createdAt", "updatedAt"] },
        },
        {
          model: Projects,
          tributes: { exclude: ["UserId", "createdAt", "updatedAt"] },
        },
      ],
    });

    if (!getUser) throw new Error("User not Found");

    res.status(200).send(getUser);
  } catch (err) {
    res.status(404).send(err.message);
  }
};

const addOrUpdateProfile = async (req, res) => {
  try {
    const { user, body, file } = req;

    if (file) body.avatar = `/public/uploads/${file.filename}`;

    if (file) body.resume = `/public/uploads/${file.filename}`;

    const findProfile = await Profile.findOne({ where: { UserId: user.id } });

    if (findProfile) {
      await Profile.update(body, { where: { userId: user.id } });
      return res.status(201).send({ message: "Profile updated successfully" });
    } else await Profile.create({ ...body, UserId: user.id });

    return res.status(201).send({ message: "Profile created successfully" });
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const addExperience = async (req, res) => {
  try {
    const { user, body } = req;

    await Experience.create({ ...body, UserId: user.id });
    res.status(201).send({ message: "Experience added successfull" });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const addEducation = async (req, res) => {
  try {
    const { user, body } = req;

    await Education.create({ ...body, UserId: user.id });
    res.status(201).send({ message: "Education added successfull" });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const addProject = async (req, res) => {
  try {
    const { user, body, file } = req;

    if (file) body.media = `/public/uploads/${file.filename}`;
    await Projects.create({ ...body, UserId: user.id });

    res.status(201).send({ message: "Project added successfull" });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const updateProject = async (req, res) => {
  try {
    const {
      query: { id },
      body,
      file,
    } = req;

    const project = await Projects.findByPk(id);

    if (!project) throw new Error("Project not found");

    if (file) body.media = `/public/uploads/${file.filename}`;

    await Projects.update(body, { where: { id } });
    res.status(200).send("Project updated successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const updateExperience = async (req, res) => {
  try {
    const {
      query: { id },
      body,
    } = req;

    const experience = await Experience.findByPk(id);

    if (!experience) throw new Error("Experience not found");

    await Experience.update(body, { where: { id } });
    res.status(200).send("Experience updated successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const updateEducation = async (req, res) => {
  try {
    const {
      query: { id },
      body,
    } = req;

    const education = await Education.findByPk(id);

    if (!education) throw new Error("Education not found");

    await Education.update(body, { where: { id } });
    res.status(200).send("Education updated successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const searchUsers = async (req, res) => {
  try {
    const { query } = req;

    const getUser = await User.findAll({
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      include: [
        {
          model: Profile,
          attributes: { exclude: ["UserId", "createdAt", "updatedAt"] },
          where: {
            [Op.or]: [
              { skills: { [Op.regexp]: `^${query.skills}` } },
              sequelize.literal(
                `MATCH (skills) AGAINST (${sequelize.escape(query.searchText)} IN NATURAL LANGUAGE MODE)`
              ),
            ],
          },
        },
        {
          model: Experience,
          attributes: { exclude: ["UserId", "createdAt", "updatedAt"] },
        },
        {
          model: Education,
          attributes: { exclude: ["UserId", "createdAt", "updatedAt"] },
        },
        {
          model: Projects,
          attributes: { exclude: ["UserId", "createdAt", "updatedAt"] },
        },
      ],
      where: {
        [Op.or]: [
          { country: query.country },
          { city: query.city },
          { industry: { [Op.regexp]: `^${query.industry}` } },
          sequelize.literal(
            `MATCH (firstName, lastName, country, city, industry) AGAINST (${sequelize.escape(
              query.searchText
            )} IN NATURAL LANGUAGE MODE)`
          ),
        ],
      },
    });

    if (!getUser || getUser.length === 0) throw new Error("User not Found");

    res.status(200).send(getUser);
  } catch (err) {
    res.status(404).send(err.message);
  }
};

const searchUsersFilters = async (req, res) => {
  try {
    const {
      query: { country, city, skills, industry, searchText },
    } = req;

    console.log("Request received:", req.query);

    const conditions = [];

    // Add conditions based on provided filters for User table
    if (country) conditions.push({ country });
    if (city) conditions.push({ city });

    // Handle multiple selections for industry (split by commas)
    if (industry) {
      const industriesArray = industry.split(',').map(ind => ind.trim());
      conditions.push({ industry: { [Op.in]: industriesArray } });
    }

    // Handle multiple skills selections (split by commas)
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      const skillsConditions = skillsArray.map(skill => ({
        // This condition uses the Profile table to filter by skills
        id: {
          [Op.in]: sequelize.literal(`(
            SELECT UserId
            FROM Profile
            WHERE skills LIKE '%${skill}%'
          )`),
        },
      }));

      // Add OR conditions for each skill
      if (skillsConditions.length > 0) {
        conditions.push({
          [Op.or]: skillsConditions,
        });
      }
    }

    // Search text filtering on firstname, lastname, and skills
    if (searchText) {
      conditions.push({
        [Op.or]: [
          { firstname: { [Op.like]: `%${searchText}%` } },
          { lastname: { [Op.like]: `%${searchText}%` } },
          sequelize.where(
            sequelize.literal(`(
              SELECT skills
              FROM Profile
              WHERE Profile.UserId = User.id
            )`),
            { [Op.like]: `%${searchText}%` }
          ),
        ],
      });
    }

    console.log("Generated Conditions:", { conditions });

    // If no conditions are provided, return an empty array
    if (conditions.length === 0) {
      return res.status(200).send([]); // Return an empty array if no filters are set
    }

    // Prepare the main query for fetching users
    const users = await User.findAll({
      include: [
        {
          model: Profile,
          attributes: ['avatar', 'skills'], // Exclude profile attributes from main query result
        },
        {
          model: Experience,
          attributes: ['designation', 'current'],
          where: {
            current: 1, // Change this to match integer `1` instead of boolean `true`
          },
          required: false,
        },

      ],
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT skills 
              FROM Profile 
              WHERE Profile.UserId = User.id
            )`),
            'skills', // Provide an alias for the skills attribute
          ],
        ],
      },
      where: {
        [Op.or]: conditions, // Use the conditions directly
      },
    });

    console.log("Retrieved Users:", users);

    const formattedUsers = users.map(user => ({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      country: user.country,
      city: user.city,
      skills: user.Profile?.skills || 'No skills listed',
      avatar: user.Profile?.avatar ? JSON.parse(user.Profile.avatar).originalname : null,
      designation: user.Experience?.length > 0 ? user.Experience[0].designation : 'No designation listed',
    }));

    res.status(200).send(formattedUsers);
  } catch (err) {
    console.error('Error in searchUsersFilters:', err.message);
    res.status(500).send(err.message);
  }
};

const getUserDetails = async (req, res) => {
  try {
    const { query: { id } } = req;

    const getUser = await User.findByPk(id, {
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      include: [
        {
          model: Profile,
          attributes: { exclude: ["UserId", "createdAt", "updatedAt"] },
        },
        {
          model: Experience,
          attributes: { exclude: ["UserId", "createdAt", "updatedAt"] },
        },
        {
          model: Education,
          attributes: { exclude: ["UserId", "createdAt", "updatedAt"] },
        },
        {
          model: Projects,
          attributes: { exclude: ["UserId", "createdAt", "updatedAt"] },
        },
      ],
    });

    if (!getUser) throw new Error("User not Found");
    res.status(200).send(getUser);
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(404).send(err.message);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      include: [
        {
          model: Profile,
          attributes: { exclude: ["UserId", "createdAt", "updatedAt"] },
        },
        {
          model: Experience,
          attributes: { exclude: ["UserId", "createdAt", "updatedAt"] },
        },
        {
          model: Education,
          attributes: { exclude: ["UserId", "createdAt", "updatedAt"] },
        },
        {
          model: Projects,
          attributes: { exclude: ["UserId", "createdAt", "updatedAt"] },
        },
      ],
    });

    if (!users || users.length === 0) {
      return res.status(404).send({ message: "No users found." });
    }
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send({ message: "An error occurred while fetching users." });
  }
};

const deleteUserById = async (req, res) => {
  const { query: { id } } = req;

  try {
    // Find and delete the user by ID
    const user = await User.destroy({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const grantUserPermissions = async (req, res) => {
  try {
    const { role, permissions } = req.body;
    if (!role || !permissions) {
      return res.status(400).json({ message: "Role and permissions are required." });
    }
    const newPermission = await Permissions.create({
      role,
      permissions,
    });
    return res.status(201).json({
      message: "Permission entry created successfully",
      data: newPermission,
    });

  } catch (error) {
    console.error("Error adding permission entry:", error);
    return res.status(500).json({
      message: "An error occurred while adding the permission entry",
      error: error.message,
    });
  }
};

const updateUserPermissions = async (req, res) => {
  try {
    const { role, permissions } = req.body;

    if (!role || !permissions) {
      return res.status(400).json({ message: "Role and permissions are required." });
    }

    const updatedPermission = await Permissions.update(
      { permissions },
      { where: { role } }
    );

    if (updatedPermission[0] === 0) {
      return res.status(404).json({ message: "Permission entry not found." });
    }

    return res.status(200).json({
      message: "Permission entry updated successfully",
    });

  } catch (error) {
    console.error("Error updating permission entry:", error);
    return res.status(500).json({
      message: "An error occurred while updating the permission entry",
      error: error.message,
    });
  }
};

const getPermissions = async (req, res) => {
  try {
    const permissions = await Permissions.findAll({
      attributes: ['role', 'permissions']
    });

    if (!permissions || permissions.length === 0) {
      return res.status(404).json({ message: "No permissions found." });
    }

    res.status(200).json(permissions);
  } catch (err) {
    console.error("Error fetching permissions:", err);
    res.status(500).json({ message: "An error occurred while fetching permissions." });
  }
};

const addToWatchList = async (req, res) => {
  const { companyId } = req.body;  // Get companyId from request body
  const userId = req.query.id;     // Get userId from query parameter

  try {
    // Find the user by ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const Company = await company.findByPk(companyId);
    if (!Company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Parse watchlist as an array or set it as an empty array if it doesn't exist
    let currentWatchlist = Array.isArray(user.watchlist) ? user.watchlist : JSON.parse(user.watchlist || '[]');

    // Check if companyId is already in the watchlist
    if (currentWatchlist.includes(companyId)) {
      return res.status(200).json({ message: 'Company is already in the watchlist' });
    }

    // Add companyId to the watchlist
    currentWatchlist.push(companyId);
    user.watchlist = currentWatchlist;

    let currentFollowers = Array.isArray(Company.followers) ? Company.followers : JSON.parse(Company.followers || '[]');
    if (!currentFollowers.includes(userId)) {
      currentFollowers.push(userId);
      Company.followers = currentFollowers;
      await Company.save();
    }


    await user.save();

    return res.status(200).json({ message: 'Company added to watchlist and user added to company followers' });
  } catch (error) {
    console.error('Error updating watchlist:', error);
    return res.status(500).json({ message: 'Error updating watchlist', error: error.message });
  }
};

const removeFromWatchList = async (req, res) => {
  const companyId = req.query.companyId;  // Get companyId from query parameter
  const userId = req.query.id;            // Get userId from query parameter

  try {
    // Find the user by ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const Company = await company.findByPk(companyId);
    if (!Company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Parse watchlist as an array or set it as an empty array if it doesn't exist
    let currentWatchlist = Array.isArray(user.watchlist) ? user.watchlist : JSON.parse(user.watchlist || '[]');

    // Check if companyId is in the watchlist
    if (!currentWatchlist.includes(companyId)) {
      return res.status(200).json({ message: 'Company is not in the watchlist' });
    }

    // Remove companyId from the watchlist
    currentWatchlist = currentWatchlist.filter(id => id !== companyId);
    user.watchlist = currentWatchlist;

    let currentFollowers = Array.isArray(Company.followers) ? Company.followers : JSON.parse(Company.followers || '[]');
    if (currentFollowers.includes(userId)) {
      currentFollowers = currentFollowers.filter(id => id !== userId); // Remove userId from followers
      Company.followers = currentFollowers;
      await Company.save();
    }

    await user.save();

    return res.status(200).json({ message: 'Company removed from watchlist and user removed from company followers' });
  } catch (error) {
    console.error('Error updating watchlist:', error);
    return res.status(500).json({ message: 'Error updating watchlist', error: error.message });
  }
};

const addToFollow = async (req, res) => {
  const { targetUserId } = req.body;  // The ID of the user being followed
  const currentUserId = req.query.id; // The ID of the current (logged-in) user

  try {
    // Find the current user
    const currentUser = await User.findByPk(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ message: 'Current user not found' });
    }

    // Find the target user to be followed
    const targetUser = await User.findByPk(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    // Parse 'following' for currentUser and 'followers' for targetUser as arrays, or set them to empty arrays if they don't exist
    let currentUserFollowing = Array.isArray(currentUser.following) ? currentUser.following : JSON.parse(currentUser.following || '[]');
    let targetUserFollowers = Array.isArray(targetUser.followers) ? targetUser.followers : JSON.parse(targetUser.followers || '[]');

    // Check if the target user is already followed by the current user
    if (currentUserFollowing.includes(targetUserId)) {
      return res.status(200).json({ message: 'You are already following this user' });
    }

    // Add targetUserId to currentUser's following list
    currentUserFollowing.push(targetUserId);
    currentUser.following = currentUserFollowing;

    // Add currentUserId to targetUser's followers list
    targetUserFollowers.push(currentUserId);
    targetUser.followers = targetUserFollowers;

    // Save both users
    await currentUser.save();
    await targetUser.save();

    return res.status(200).json({ message: 'User followed successfully' });
  } catch (error) {
    console.error('Error updating follow lists:', error);
    return res.status(500).json({ message: 'Error updating follow lists', error: error.message });
  }
};


const removeFromFollowing = async (req, res) => {
  // Destructure targetUserId from request body and currentUserId from query parameters
  const { targetUserId } = req.body; // The ID of the user being unfollowed
  const currentUserId = req.query.id;  // The ID of the current (logged-in) user

  try {
    // Find the current user
    const currentUser = await User.findByPk(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ message: 'Current user not found' });
    }

    // Find the target user to be unfollowed
    const targetUser = await User.findByPk(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    // Parse 'following' for currentUser and 'followers' for targetUser as arrays, or set them to empty arrays if they don't exist
    let currentUserFollowing = Array.isArray(currentUser.following) ? currentUser.following : JSON.parse(currentUser.following || '[]');
    let targetUserFollowers = Array.isArray(targetUser.followers) ? targetUser.followers : JSON.parse(targetUser.followers || '[]');

    // Check if the target user is in the current user's following list
    if (!currentUserFollowing.includes(targetUserId)) {
      return res.status(200).json({ message: 'User is not in your following list' });
    }

    // Remove targetUserId from currentUser's following list
    currentUserFollowing = currentUserFollowing.filter(id => id !== targetUserId);
    currentUser.following = currentUserFollowing;

    // Remove currentUserId from targetUser's followers list
    targetUserFollowers = targetUserFollowers.filter(id => id !== currentUserId);
    targetUser.followers = targetUserFollowers;

    // Save both users' updated data
    await currentUser.save();
    await targetUser.save();

    return res.status(200).json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error('Error updating follow lists:', error);
    return res.status(500).json({ message: 'Error updating follow lists', error: error.message });
  }
};

const addToShortlist = async (req, res) => {
  try {
    const { userId } = req.params;  // userId of the profile being visited
    const currentUserId = req.user.id;  // Assuming req.user contains the current logged-in user's details

    // Check if the entry already exists
    const existingEntry = await shortlist.findOne({
      where: {
        employerId: currentUserId,
        candidateId: userId,
      },
    });

    if (existingEntry) {
      return res.status(400).json({ message: "User is already shortlisted." });
    }

    // Create a new entry in the Shortlist
    await shortlist.create({
      employerId: currentUserId,
      candidateId: userId,
    });

    res.status(201).json({ message: "User added to shortlist successfully." });
  } catch (error) {
    console.error("Error adding to shortlist:", error);
    res.status(500).json({ message: "Failed to add user to shortlist.", error });
  }
};

// Remove from Shortlist
const removeFromShortlist = async (req, res) => {
  try {
    const { userId } = req.params;  // userId of the profile being visited
    const currentUserId = req.user.id;  // Assuming req.user contains the current logged-in user's details

    // Delete the entry from the Shortlist
    const result = await shortlist.destroy({
      where: {
        employerId: currentUserId,
        candidateId: userId,
      },
    });

    if (result) {
      res.status(200).json({ message: "User removed from shortlist successfully." });
    } else {
      res.status(404).json({ message: "Shortlist entry not found." });
    }
  } catch (error) {
    console.error("Error removing from shortlist:", error);
    res.status(500).json({ message: "Failed to remove user from shortlist.", error });
  }
};


module.exports = {
  getCurrentUser,
  addOrUpdateProfile,
  addExperience,
  addEducation,
  addProject,
  updateProject,
  updateExperience,
  updateEducation,
  searchUsers,
  searchUsersFilters,
  getUserDetails,
  getAllUsers,
  deleteUserById,
  grantUserPermissions,
  getPermissions,
  updateUserPermissions,
  addToWatchList,
  removeFromWatchList,
  addToFollow,
  removeFromFollowing,
  addToShortlist,
  removeFromShortlist,
};
