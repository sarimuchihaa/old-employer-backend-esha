const { Op } = require("sequelize");
const { sequelize, company, Reviews, Search } = require("../db");
const verifyDomain = require("../config/verfiyDomain");
const { sendVerificationEmail } = require("../services/email.service");
const jwt = require("jsonwebtoken");
const { parse } = require('url');
const axios = require('axios'); // Import axios or another HTTP client

const createCompany = async (req, res) => {
  try {
    const {
      body: { name, createdBy },
    } = req;

    if (!name) {
      return res.status(400).send({ message: "Company name is required." });
    }

    // Use findOrCreate to avoid duplicates based on the name
    const [companyData, created] = await company.findOrCreate({
      where: { name },
      defaults: { name, createdBy }  // Add createdBy if passed
    });

    if (created) {
      return res.status(201).send({
        id: companyData.id,
        message: "Company created successfully.",
        existed: false
      });
    } else {
      return res.status(200).send({
        id: companyData.id,
        message: "Company already exists.",
        existed: true,
        companyData
      });
    }
  } catch (err) {
    console.error("Error processing the company:", err);
    res.status(500).send({ message: "Internal server error", error: err.message });
  }
};


const updateCompany = async (req, res) => {
  try {
    const {
      body,
      files,
      query: { id }
    } = req;

    const findCompany = await company.findByPk(id);
    if (!findCompany) throw new Error("Company does not exist");

    // Handle logo file if it exists
    if (files && files.logo) {
      body.logo = `/public/uploads/${files.logo.filename}`;
    }

    // Update the company record with the new data
    await company.update(body, { where: { id } });
    const updatedCompany = await company.findByPk(id);
    res.status(200).json(updatedCompany);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const searchCompany = async (req, res) => {
  try {
    const {
      query: { city, country, industry, searchText, name },
    } = req;

    const companies = await company.findAll({
      where: {
        [Op.or]: [
          { city, country, industry, name },
          sequelize.literal(
            `MATCH (name) AGAINST (${sequelize.escape(
              searchText
            )} IN NATURAL LANGUAGE MODE)`
          ),
        ],
      },
    });

    res.status(200).send(companies);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const searchCompanyFilters = async (req, res) => {
  try {
    const {
      query: { city, country, industry, searchText, overallRating, size },
    } = req;

    console.log("Request received:", req.query);

    const conditions = [];

    // Add conditions based on provided filters
    if (country) conditions.push({ country });
    if (city) conditions.push({ city });

    // Handle multiple selections for industry and size (split by commas)
    if (industry) {
      const industriesArray = industry.split(',');
      conditions.push({ industry: { [Op.in]: industriesArray } });
    }

    if (size) {
      const sizesArray = size.split(',');
      conditions.push({ size: { [Op.in]: sizesArray } });
    }

    // Search text filtering on name and industry
    if (searchText) {
      conditions.push({
        [Op.or]: [
          { name: { [Op.like]: `%${searchText}%` } },
          { industry: { [Op.like]: `%${searchText}%` } },
        ],
      });
    }

    // Define the range for overallRating
    if (overallRating) {
      const minRating = parseFloat(overallRating); // Minimum rating is 2
      const maxRating = minRating + 1; // Maximum rating is 3

      conditions.push(
        sequelize.where(
          sequelize.literal(`(
            SELECT COALESCE(AVG((compensation + work_balance + career_opportunities + cutlers) / 4), 0)
            FROM Reviews
            WHERE Reviews.companyId = company.id
          )`),
          {
            [Op.gte]: minRating, // Greater than or equal to 2
            [Op.lt]: maxRating,  // Less than 3
          }
        )
      );
    }


    console.log("Generated Conditions: ", conditions);

    // Prepare the main query for fetching companies
    const companies = await company.findAll({
      include: [
        {
          model: Reviews,
          attributes: [],
        },
      ],
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT 
                COALESCE(AVG((compensation + work_balance + career_opportunities + cutlers) / 4), 0) 
              FROM Reviews 
              WHERE Reviews.companyId = company.id
            )`),
            'calculatedOverallRating',
          ],
          [
            sequelize.fn('SUM', sequelize.literal("CASE WHEN emp_thougts = 'good' THEN 1 ELSE 0 END")),
            'goodCount'
          ],
          [
            sequelize.fn('SUM', sequelize.literal("CASE WHEN emp_thougts = 'not-good' THEN 1 ELSE 0 END")),
            'notGoodCount'
          ]
        ],
      },
      where: {
        [Op.or]: conditions.length > 0 ? conditions : [{ id: { [Op.ne]: null } }],
      },
      group: ['Company.id'],
    });

    // Log the retrieved companies and calculated ratings
    console.log("Retrieved Companies:", companies);

    // Format the response to include calculatedOverallRating and emp_thoughts
    const formattedCompanies = companies.map(company => ({
      id: company.id,
      name: company.name,
      logo: company.logo,
      web_url: company.web_url,
      industry: company.industry,
      email: company.email,
      country: company.country,
      city: company.city,
      size: company.size,
      phone: company.phone,
      is_verified: company.is_verified,
      ownerId: company.ownerId,
      verification_doc: company.verification_doc,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
      calculatedOverallRating: parseFloat(company.get('calculatedOverallRating')),
      goodCount: parseInt(company.getDataValue('goodCount'), 10) || 0,
      notGoodCount: parseInt(company.getDataValue('notGoodCount'), 10) || 0,
    }));

    res.status(200).send(formattedCompanies);
  } catch (err) {
    console.error('Error in searchCompanyFilters:', err.message);
    res.status(500).send(err.message);
  }
};

const saveNotFoundCompany = async (req, res) => {
  try {
    const { searchTerm } = req.body;
    if (!searchTerm) {
      return res.status(400).send({ message: 'Company name is required.' });
    }
    await Search.create({ searchTerm });

    res.status(200).send({ message: 'Company name saved successfully.' });
  } catch (error) {
    console.error('Error saving company name:', error);
    res.status(500).send(error.message);
  }
};

const getSingleCompany = async (req, res) => {
  try {
    const {
      query: { id },
    } = req;

    const getCompany = await company.findByPk(id);

    if (!getCompany) throw new Error("Company not found");

    res.status(200).send(getCompany);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getCompanyId = async (req, res, next) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: "Company name is required." });
    }

    const getCompany = await company.findOne({ name: name });
    if (!getCompany) {
      return res.status(404).json({ message: "Company not found." });
    }

    res.status(200).json({ id: getCompany.id });
  } catch (error) {
    console.error("Error fetching company ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// const getDomainFromUrl = (url) => {
//   const parsedUrl = parse(url);
//   return parsedUrl.hostname; // Return only the domain part (e.g., 'example.com')
// };

// const isValidEmailDomain = (email, companyUrl) => {
//   const emailDomain = email.split('@')[1]; // Get the domain from the email (e.g., 'example.com')
//   const companyDomain = getDomainFromUrl(companyUrl); // Get the domain from the URL
//   return emailDomain === companyDomain; // Check if both domains match
// };

// Helper function to validate email domain against web_url domain
const isValidEmailDomain = (email, webUrl) => {
  const emailDomain = email.split('@')[1];
  const urlDomain = new URL(webUrl).hostname;
  return emailDomain === urlDomain || emailDomain.endsWith(`.${urlDomain}`);
};

// Helper function to verify the URL is reachable
const isUrlReachable = async (url) => {
  try {
    const response = await axios.get(url, { timeout: 5000 }); // Timeout in ms
    return response.status === 200; // Only return true if the response is OK
  } catch (error) {
    return false; // Return false if request fails
  }
};

const companyVerify = async (req, res) => {
  try {
    const {
      body: { company_email, claim_by, designation, phone, verification_doc },
      user: { id: ownerId },
    } = req;

    // Retrieve the stored web_url from the database
    const companyRecord = await company.findOne({ where: { id: req.query.id } });
    if (!companyRecord || !companyRecord.web_url) {
      throw new Error("Company web URL not found in records.");
    }

    const { web_url: companyUrl } = companyRecord;

    // Step 1: Check if email domain matches company URL domain
    if (!isValidEmailDomain(company_email, companyUrl)) {
      throw new Error("Email domain does not match the company URL domain.");
    }

    // Step 2: Check if the company URL is reachable
    const isReachable = await isUrlReachable(companyUrl);
    if (!isReachable) {
      throw new Error("Provided company URL is not reachable or invalid.");
    }

    // Update the company record and set it as unverified initially
    const updatedCompany = await company.update(
      {
        is_verified: false, // Set to false initially
        ownerId,
        verification_doc: verification_doc || null,
        email: company_email,
        claim_by: claim_by,
        phone: phone,
        designation: designation
      },
      { where: { id: req.query.id } } // Ensure you have company ID in query
    );

    if (!updatedCompany[0]) { // updatedCompany[0] should reflect the number of rows affected
      throw new Error("Failed to update company information.");
    }

    // Generate a verification token for the email
    const token = jwt.sign({ email: company_email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Send verification email
    await sendVerificationEmail(company_email, token);

    res.status(200).send({ message: "A verification email has been sent." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// const companyVerify = async (req, res) => {
//   try {
//     const {
//       body: { company_email, claim_by, designation, phone, verification_doc },
//       user: { id: ownerId },
//     } = req;

//     // Verify if the email domain is valid
//     const verify = await verifyDomain(company_email);
//     if (!verify) {
//       throw new Error("Email is not associated with a valid domain.");
//     }

//     // Update the company record and set it as unverified for now
//     const updatedCompany = await company.update(
//       {
//         is_verified: false, // Set to false initially
//         ownerId,
//         verification_doc: verification_doc || null,
//         email: company_email,
//         claim_by: claim_by,
//         phone: phone,
//         designation: designation
//       },
//       { where: { id: req.query.id } } // Ensure you have company ID in query
//     );

//     if (!updatedCompany[0]) { // updatedCompany[0] should reflect the number of rows affected
//       throw new Error("Failed to update company information.");
//     }

//     // Generate a verification token for the email
//     const token = jwt.sign({ email: company_email }, process.env.JWT_SECRET, { expiresIn: "1h" });

//     // Send verification email
//     await sendVerificationEmail(company_email, token);

//     res.status(200).send({ message: "A verification email has been sent." });
//   } catch (err) {
//     res.status(500).send({ message: err.message });
//   }
// };

// const companyVerify = async (req, res) => {
//   try {
//     const {
//       body: { company_email, claim_by, designation, phone, verification_doc },
//       user: { id: ownerId },
//     } = req;

//     // Fetch the company from the database to get the web_url
//     const companyRecord = await company.findOne({ where: { id: req.query.id } });

//     if (!companyRecord) {
//       throw new Error("Company not found.");
//     }

//     const companyUrl = companyRecord.web_url; // Get the web_url from the database

//     // Verify if the email domain matches the company URL domain
//     if (!isValidEmailDomain(company_email, companyUrl)) {
//       throw new Error("Email domain does not match the company URL domain.");
//     }

//     // Verify if the email domain is valid (additional domain verification logic, if needed)
//     const verify = await verifyDomain(company_email);
//     if (!verify) {
//       throw new Error("Email is not associated with a valid domain.");
//     }

//     // Update the company record and set it as unverified for now
//     const updatedCompany = await company.update(
//       {
//         is_verified: false, // Set to false initially
//         ownerId,
//         verification_doc: verification_doc || null,
//         email: company_email,
//         claim_by: claim_by,
//         phone: phone,
//         designation: designation
//       },
//       { where: { id: req.query.id } } // Ensure you have company ID in query
//     );

//     if (!updatedCompany[0]) { // updatedCompany[0] should reflect the number of rows affected
//       throw new Error("Failed to update company information.");
//     }

//     // Generate a verification token for the email
//     const token = jwt.sign({ email: company_email }, process.env.JWT_SECRET, { expiresIn: "1h" });

//     // Send verification email
//     await sendVerificationEmail(company_email, token);

//     res.status(200).send({ message: "A verification email has been sent." });
//   } catch (err) {
//     res.status(500).send({ message: err.message });
//   }
// };

const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    const user = await company.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Company not found." });
    }
    user.is_verified = true;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

const getAllCompanies = async (req, res) => {
  try {
    const companies = await company.findAll();

    if (!companies || companies.length === 0) {
      return res.status(404).send({ message: "No companies found." });
    }
    res.status(200).json(companies);
  } catch (err) {
    console.error("Error fetching companies:", err);
    res.status(500).send({ message: "An error occurred while fetching companies." });
  }
};

const deleteCompanyById = async (req, res) => {
  const { query: { id } } = req;

  try {
    if (!id) {
      return res.status(400).json({ message: 'Invalid company ID' });
    }

    const deletedCount = await company.destroy({
      where: { id }
    });
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const NameSuggestions = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: "Company name is required." });
  }

  try {
    // Query the database for company names that match the input
    const companies = await company.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%` // Case-insensitive search
        }
      },
      limit: 10 // Limit the number of suggestions
    });

    const companyNames = companies.map((company) => company.name); // Extract company names
    res.json(companyNames); // Return the names as an array
  } catch (error) {
    console.error("Error fetching company suggestions:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  createCompany,
  updateCompany,
  searchCompany,
  searchCompanyFilters,
  getSingleCompany,
  getCompanyId,
  companyVerify,
  getAllCompanies,
  NameSuggestions,
  deleteCompanyById,
  verifyEmail,
  saveNotFoundCompany
};
