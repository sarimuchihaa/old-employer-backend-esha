const router = require("express").Router();

const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");

const { companyValidation } = require("../validations");
const { companyController } = require("../controllers");

router
  .route("/company/")
  .post(
    auth(),
    validate(companyValidation.createCompany),
    companyController.createCompany
  )
  .patch(
    auth(),
    validate(companyValidation.updateCompany),
    companyController.updateCompany
  );

router.route("/company/delete").get(auth(), companyController.deleteCompanyById);

router.route("/company/search")
  .get(
    auth(),
    validate(companyValidation.searchCompany),
    companyController.searchCompany
  );

router.route("/company/notFound")
  .post(
    auth(),
    // validate(companyValidation.saveNotFoundCompany),
    companyController.saveNotFoundCompany
  );
router
  .route("/company/filters")
  .get(
    auth(),
    validate(companyValidation.searchCompanyFilters),
    companyController.searchCompanyFilters
  );

router
  .route("/company/suggestions")
  .get(
    auth(),
    validate(companyValidation.NameSuggestions),
    companyController.NameSuggestions
  );

router
  .route("/company/verify")
  .put(
    auth(),
    validate(companyValidation.companyVerify),
    companyController.companyVerify
  );

router.get('/company/verify-email', companyController.verifyEmail);

router
  .route("/company/single")
  .get(
    auth(),
    validate(companyValidation.getSingleCompany),
    companyController.getSingleCompany
  );


router
  .route("/company/singleid")
  .get(
    auth(),
    validate(companyValidation.getCompanyId),
    companyController.getCompanyId
  );

router
  .route("/company/all-companies")
  .get(
    auth("superadmin"),
    // validate(companyValidation.getAllCompanies),
    companyController.getAllCompanies
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Company
 *   description: Company management
 */

/**
 * @swagger
 * /company/:
 *   post:
 *     summary: Create a new company
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *             example:
 *               name: Fake Company
 *     responses:
 *       200:
 *         description: Company created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *       500:
 *         description: Internal server error
 *   patch:
 *     summary: Update an existing company
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Company ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               logo:
 *                 type: object
 *                 properties:
 *                   originalname:
 *                     type: string
 *                   mimetype:
 *                     type: string
 *                   size:
 *                     type: integer
 *               web_url:
 *                 type: string
 *               email:
 *                 type: string
 *               industry:
 *                 type: string
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               phone:
 *                 type: string
 *               is_verified:
 *                 type: boolean
 *                 default: false
 *               ownerId:
 *                 type: integer
 *               verificaton_doc:
 *                 type: object
 *                 properties:
 *                   originalname:
 *                     type: string
 *                   mimetype:
 *                     type: string
 *                   size:
 *                     type: integer
 *     responses:
 *       200:
 *         description: Company updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *       500:
 *         description: Internal server error
 *   get:
 *     summary: Search for companies
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Company name
 *       - in: query
 *         name: industry
 *         schema:
 *           type: string
 *         description: Industry
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Country
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: City
 *       - in: query
 *         name: searchText
 *         schema:
 *           type: string
 *         description: Search text
 *     responses:
 *       200:
 *         description: List of companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   industry:
 *                     type: string
 *                   country:
 *                     type: string
 *                   city:
 *                     type: string
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Verify a company
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Company ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - company_email
 *             properties:
 *               company_email:
 *                 type: string
 *                 format: email
 *             example:
 *               company_email: info@fakecompany.com
 *     responses:
 *       200:
 *         description: Company verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Your company has been verified successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /company/single:
 *   get:
 *     summary: Get a single company by ID
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 industry:
 *                   type: string
 *                 country:
 *                   type: string
 *                 city:
 *                   type: string
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
