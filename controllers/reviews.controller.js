const { Reviews, company, User, Endows } = require("../db");

const addReview = async (req, res) => {
  try {
    const { user, body } = req;
    body.review_by = user.id; // Set the user ID as the reviewer

    // Check if a review by the same user for the same company already exists
    const existingReview = await Reviews.findOne({
      where: { review_by: user.id, companyId: body.companyId },
    });

    if (existingReview) {
      throw new Error("Review already exists, please edit");
    }

    // Check if an endows entry by the same user for the same company exists
    const existingEndows = await Endows.findOne({
      where: { endows_by: user.id, companyId: body.companyId },

    });

    console.log(existingEndows);
    if (existingEndows) {
      // Create the new review using data from the existing endows entry
      body.emp_thougts = existingEndows.emp_thougts;
      console.log(body.emp_thougts);
      const newReview = await Reviews.create(body); // Create and store the review
      await existingEndows.destroy(); // Delete the endows entry

      res.status(201).send({
        message: "Review added successfully, previous endows entry removed",
        review: newReview,
      });
    } else {
      // No previous endows entry, create a fresh review
      const newReview = await Reviews.create(body);
      res.status(201).send({
        message: "Review added successfully",
        review: newReview,
      });
    }
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};

const verifyReview = async (req, res) => {
  try {
    const { body, file, query: { id } } = req; // id is coming from the URL query string

    // Check if the id is a valid UUID format
    if (!validateUUID(id)) {
      return res.status(400).send({ status: "error", message: "Invalid ID format" });
    }

    if (file) {
      body.verification_doc = `/public/uploads/${file.filename}`;
    }
    body.is_verified = true;

    // Update the review by UUID
    const [updated] = await Reviews.update(body, { where: { id } });

    if (updated) {
      res.status(200).send({ message: "Verification document received successfully" });
    } else {
      throw new Error("Something went wrong while adding the document");
    }
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};

// Utility function to validate UUID format
function validateUUID(uuid) {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}

const getReviewByCompany = async (req, res) => {
  try {
    const {
      query: { companyId },
    } = req;

    const reviewsList = await Reviews.findAll({
      where: { companyId },
      include: [company, User],
    });

    res.status(200).send(reviewsList);
  } catch (err) {
    res.status(500).send(err.message);
  }
};


const getReviewByUser = async (req, res) => {
  try {
    const { id: review_by } = req.query; // Use `userId` instead of `id` for clarity

    const reviews = await Reviews.findAll({
      where: { review_by },
      include: [
        {
          model: company, // Reference the Company model directly
          as: 'Company', // Alias it if needed, based on your model associations
        },
      ],
    });

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ error: "No reviews found for this user" });
    }

    console.log("Fetched Reviews:", reviews); // Log the fetched reviews for debugging
    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ error: "Failed to fetch reviews" });
  }
};


const endowsReview = async (req, res) => {
  try {
    const { user, body } = req;
    body.endows_by = user.id; // Set the user ID as the reviewer

    // Check if a review by the same user for the same company already exists
    const existingReview = await Reviews.findOne({
      where: { review_by: user.id, companyId: body.companyId },
    });

    if (existingReview) {
      throw new Error("Complete review already exists, cannot add endows");
    }

    // Check if an endows entry by the same user for the same company already exists
    const existingEndows = await Endows.findOne({
      where: { endows_by: user.id, companyId: body.companyId },
    });

    if (existingEndows) {
      throw new Error("Endows already exists, please edit instead");
    }

    // Create the new endows entry
    const newEndows = await Endows.create(body);

    res.status(201).send({
      message: "Endows added successfully",
      endows: newEndows,
    });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};

const getEndowsByCompany = async (req, res) => {
  try {
    const {
      query: { companyId },
    } = req;

    const reviewsList = await Endows.findAll({
      where: { companyId },
      include: [company, User],
    });

    res.status(200).send(reviewsList);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  addReview,
  verifyReview,
  getReviewByCompany,
  getReviewByUser,
  endowsReview,
  getEndowsByCompany
};
