const router = require("express").Router();
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");

const { reviewsValidation } = require("../validations");
const { reviewsController } = require("../controllers");

router
  .route("/review/")
  .post(
    auth(),
    validate(reviewsValidation.addReview),
    reviewsController.addReview
  )
  .patch(
    auth(),
    validate(reviewsValidation.verifyReview),
    reviewsController.verifyReview
  )
  .get(
    auth(),
    validate(reviewsValidation.getReviewByCompany),
    reviewsController.getReviewByCompany
  );

router.route("/reviewbyuser/")
  .get(
    auth(),
    validate(reviewsValidation.getReviewByUser),
    reviewsController.getReviewByUser
  );

router
  .route("/endows/")
  .post(
    auth(),
    validate(reviewsValidation.endowsReview),
    reviewsController.endowsReview
  )
  .get(
    auth(),
    validate(reviewsValidation.getEndowsByCompany),
    reviewsController.getEndowsByCompany
  );

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - emp_status
 *         - emp_thougts
 *         - hide_emp_info
 *         - compensation
 *         - work_balance
 *         - career_opportunities
 *         - cutlers
 *         - recommendation
 *         - suggestions
 *         - best_worst
 *         - environment
 *         - employment
 *         - insurance
 *         - residence
 *         - benovland_fund
 *         - medical
 *         - salary_range
 *         - pay_on_time
 *         - bonus
 *         - increment
 *         - increment_duration
 *         - monthly_leaves
 *         - annually_leaves
 *         - public_review
 *         - companyId
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the review
 *         emp_status:
 *           type: string
 *           description: Employment status of the reviewer
 *         emp_thougts:
 *           type: string
 *           description: Thoughts of the employee
 *         hide_emp_info:
 *           type: boolean
 *           description: Whether to hide employee information
 *           default: false
 *         compensation:
 *           type: integer
 *           description: Compensation rating
 *         work_balance:
 *           type: integer
 *           description: Work-life balance rating
 *         career_opportunities:
 *           type: integer
 *           description: Career opportunities rating
 *         cutlers:
 *           type: integer
 *           description: Company culture rating
 *         recommendation:
 *           type: boolean
 *           description: Recommendation to work at the company
 *           default: false
 *         suggestions:
 *           type: string
 *           description: Suggestions from the reviewer
 *         best_worst:
 *           type: string
 *           description: Best and worst aspects of the company
 *         environment:
 *           type: string
 *           description: Work environment description
 *         employment:
 *           type: string
 *           description: Employment type
 *         insurance:
 *           type: string
 *           description: Insurance benefits description
 *         residence:
 *           type: string
 *           description: Residence description
 *         benovland_fund:
 *           type: string
 *           description: Benevolent fund description
 *         medical:
 *           type: string
 *           description: Medical benefits description
 *         other_benefit:
 *           type: string
 *           description: Other benefits description
 *         salary_range:
 *           type: string
 *           description: Salary range description
 *         pay_on_time:
 *           type: string
 *           description: Timeliness of payment description
 *         bonus:
 *           type: string
 *           description: Bonus description
 *         increment:
 *           type: string
 *           description: Increment description
 *         increment_duration:
 *           type: string
 *           description: Increment duration description
 *         monthly_leaves:
 *           type: string
 *           description: Monthly leaves description
 *         annually_leaves:
 *           type: string
 *           description: Annually leaves description
 *         public_review:
 *           type: string
 *           description: Public review description
 *         verificaton_doc:
 *           type: string
 *           description: Verification document
 *         review_by:
 *           type: integer
 *           description: The id of the user who reviewed
 *         companyId:
 *           type: integer
 *           description: The id of the company being reviewed
 *       example:
 *         emp_status: "Full-time"
 *         emp_thougts: "Great place to work"
 *         hide_emp_info: true
 *         compensation: 4
 *         work_balance: 5
 *         career_opportunities: 4
 *         cutlers: 5
 *         recommendation: true
 *         suggestions: "Improve work-life balance"
 *         best_worst: "Best: Colleagues, Worst: Long hours"
 *         environment: "Friendly"
 *         employment: "Permanent"
 *         insurance: "Health insurance"
 *         residence: "Near office"
 *         benovland_fund: "Available"
 *         medical: "Covered"
 *         other_benefit: "Gym membership"
 *         salary_range: "50k-60k"
 *         pay_on_time: "Always"
 *         bonus: "Quarterly"
 *         increment: "Annually"
 *         increment_duration: "1 year"
 *         monthly_leaves: "2"
 *         annually_leaves: "24"
 *         public_review: "Visible"
 *         verificaton_doc: "path/to/doc"
 *         review_by: 1
 *         companyId: 1
 */

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: API to manage company reviews
 */

/**
 * @swagger
 * /review:
 *   post:
 *     summary: Add a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: The review was successfully added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /review:
 *   patch:
 *     summary: Verify a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The id of the review to verify
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
 *         description: The verification document was successfully received
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /review:
 *   get:
 *     summary: Get reviews by company
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The id of the company
 *     responses:
 *       200:
 *         description: The list of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       500:
 *         description: Some server error
 */
