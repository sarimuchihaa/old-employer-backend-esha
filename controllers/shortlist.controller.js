const { Op } = require("sequelize");
const { shortlist } = require("../db");

const Shortlist = async (req, res) => {
  try {
    const {
      body: { candidateId, category },
      user: { id },
    } = req;
    const isShortListed = await shortlist.findOne({
      where: { [Op.and]: [{ employerId: id }, { candidateId }, { category }] },
    });

    if (isShortListed) throw new Error("Candidate already shortlisted");

    await shortlist.create({
      employerId: id,
      candidateId,
      category
    });

    res.status(201).send({ message: "Candidate added to shortlist" });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// const updateShorlist = async (req, res) => {
//   try {
//     const {
//       query: { id },
//     } = req;
//     const candidate = await shortlist.findByPk(id);

//     if (candidate) throw new Error("Candidate not found");
//     await shortlist.destroy({ where: { id: id } });

//     res.status(200).send({ message: "Candidate removed from list" });
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// };

const updateShortlist = async (req, res) => {
  try {
    const {
      query: { id, category },
    } = req;

    // Ensure both 'id' and 'category' are provided
    if (!id || !category) {
      return res.status(400).send({ message: "User ID and category are required." });
    }

    // Find the shortlist record by the provided 'id' and 'category'
    const candidate = await shortlist.findOne({
      where: {
        candidateId: id,
        category: category, // Check if the category is shortlisted for this user
      },
    });

    if (!candidate) {
      return res.status(404).send({ message: "Candidate not found in this category." });
    }

    // If the candidate is found in the shortlist for the given category, remove them
    await shortlist.destroy({
      where: {
        candidateId: id,
        category: category, // Match both user ID and category
      },
    });

    res.status(200).send({ message: "Candidate removed from shortlist in the specified category." });
  } catch (err) {
    console.error("Error removing candidate from shortlist:", err);
    res.status(500).send({ message: "Internal server error." });
  }
};

// In your backend controller
const removeCandidatesByCategory = async (req, res) => {
  const { query: { category } } = req; // Extract category from query parameters

  try {
    // Remove all shortlisted candidates for the specified category
    const result = await shortlist.destroy({
      where: { category }
    });

    if (result > 0) {
      return res.status(200).json({ message: `All candidates in category ${category} removed from shortlist.` });
    } else {
      return res.status(404).json({ message: "No candidates found for this category." });
    }
  } catch (error) {
    console.error("Error removing candidates by category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const viewShorlist = async (req, res) => {
  try {
    // Retrieve all shortlisted candidates along with their categories
    const shortlistedCandidates = await shortlist.findAll({
      attributes: ['id', 'employerId', 'candidateId', 'category'],
    });

    res.status(200).send(shortlistedCandidates);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const viewShortlistByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    // Check if a category is specified
    const filterOptions = category ? { where: { category } } : {};

    // Retrieve shortlisted candidates filtered by category if provided
    const shortlistedCandidates = await shortlist.findAll({
      attributes: ['id', 'employerId', 'candidateId', 'category'],
      ...filterOptions,
    });

    res.status(200).send(shortlistedCandidates);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  Shortlist,
  updateShortlist,
  viewShorlist,
  viewShortlistByCategory,
  removeCandidatesByCategory
};
