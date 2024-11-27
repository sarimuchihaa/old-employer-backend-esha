const { Router } = require("express");
const auth = require("../middlewares/auth");
const router = Router();

// Import Controllers, validators and middlewares
const { authController } = require("../controllers");
const { authValidation } = require("../validations");
const validate = require("../middlewares/validate");

router
  .route("/superadmin/register")
  .post(validate(authValidation.SuperadminRegister), authController.SuperadminRegister);
router
  .route("/superadmin/login")
  .post(validate(authValidation.SuperadminLogin), authController.SuperadminLogin);

router
  .route("/auth/register")
  .post(validate(authValidation.register), authController.register);
router
  .route("/auth/google-login")
  .post(validate(authValidation.googleLogin), authController.googleLogin);
router
  .route("/auth/login")
  .post(validate(authValidation.login), authController.login);
router
  .route("/auth/forget-password")
  .post(validate(authValidation.forgetPassword), authController.forgetPassword);
router
  .route("/auth/reset-password")
  .post(
    auth(),
    validate(authValidation.resetPassword),
    authController.resetPassword
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Auth
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - phone
 *               - gender
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               gender:
 *                 type: string
 *               role:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               phone:
 *                 type: string
 *                 format: tel
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               password: password1
 *               role: user
 *               gender: male
 *               phone: +923000000000
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               message: string
 *             example:
 *               message: Verification email has been sent
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Token'
 *       "401":
 *         description: Invalid Credentials
 *         content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          code: number
 *                          message: string
 *                  example:
 *                      code: 401
 *                      message: Invalid Credentials
 */

/**
 * @swagger
 * /auth/forget-password:
 *   post:
 *     summary: Forget password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *             example:
 *               email: fake@example.com
 *     responses:
 *       "200":
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               message: string
 *             example:
 *               message: reset password link has been sent to your email
 *       "400":
 *         description: User not found with this email
 *         content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          code: number
 *                          message: string
 *                  example:
 *                      code: 400
 *                      message: User not found with this email
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               password: password1
 *     responses:
 *       "200":
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: Password changed successfully
 *       "400":
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                 message:
 *                   type: string
 *             example:
 *               code: 400
 *               message: User not found
 */
