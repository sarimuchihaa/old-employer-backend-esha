const { Router } = require("express");
const router = Router();
const auth = require("../middlewares/auth");

const validate = require("../middlewares/validate");
const { shortlistValidation } = require("../validations");
const { shortlistController } = require("../controllers");

router
  .route("/shortlist/")
  .post(
    auth(),
    validate(shortlistValidation.Shortlist),
    shortlistController.Shortlist
  )
  .patch(
    auth(),
    validate(shortlistValidation.updateShortlist),
    shortlistController.updateShortlist
  )
  .get(
    auth(),
    shortlistController.viewShorlist
  )
  .delete(auth(),
    validate(shortlistController.removeCandidatesByCategory),
    shortlistController.removeCandidatesByCategory);

router
  .route("/candidates/").get(
    auth(),
    validate(shortlistController.viewShortlistByCategory),
    shortlistController.viewShortlistByCategory
  )
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Shortlist
 */

/**
 * @swagger
 * /shorlist/:
 *   post:
 *     summary: Add candidate to shortlist
 *     tags: [Shortlist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - candidateId
 *             properties:
 *               candidateId:
 *                 type: integer
 *             example:
 *               candidateId: 123
 *     responses:
 *       "201":
 *         description: Candidate added to shortlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: Candidate added to shortlist
 *       "500":
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *             example:
 *               message: Candidate already shortlisted
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /shorlist/:
 *   patch:
 *     summary: Remove candidate from shortlist
 *     tags: [Shortlist]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the shortlisted candidate
 *     responses:
 *       "200":
 *         description: Candidate removed from shortlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: Candidate removed from list
 *       "500":
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *             example:
 *               message: Candidate not found
 *     security:
 *       - bearerAuth: []
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
