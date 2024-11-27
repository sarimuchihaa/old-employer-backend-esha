const router = require("express").Router();
const auth = require("../middlewares/auth");

const { visitorController } = require("../controllers");

router
  .route("/visitor/")
  .get(auth(), visitorController.visitorList)
  .post(auth(), visitorController.addVisitor);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Visitor
 */

/**
 * @swagger
 * /visitor/:
 *   get:
 *     summary: Get visitor list
 *     tags: [Visitor]
 *     responses:
 *       "200":
 *         description: List of visitors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   visitorId:
 *                     type: integer
 *                   profileId:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       "500":
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *             example:
 *               message: Error message
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /visitor/:
 *   post:
 *     summary: Add a visitor
 *     tags: [Visitor]
 *     parameters:
 *       - in: query
 *         name: profileId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the profile being visited
 *     responses:
 *       "200":
 *         description: Visitor added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: visitor added successfully
 *       "500":
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *             example:
 *               message: Error message
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
