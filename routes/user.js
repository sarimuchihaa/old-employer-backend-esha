const { Router } = require("express");
const auth = require("../middlewares/auth");
const router = Router();
// Import Controllers, validators and middlewares
const { userController } = require("../controllers");
const { userValidation } = require("../validations");
const validate = require("../middlewares/validate");
const upload = require("../config/multer");

router
  .route("/user/")
  .get(auth(), userController.getCurrentUser)
  .patch(auth(), validate(userValidation.updateProfileDetails),
    upload.single("avatar"),
    userController.addOrUpdateProfile,
  );

// Experience Crud operations
router
  .route("/user/experience")
  .post(
    auth(),
    validate(userValidation.addExperience),
    userController.addExperience
  )
  .patch(
    auth(),
    validate(userValidation.updateExperience),
    userController.updateExperience
  );

// Education crud operations
router
  .route("/user/education")
  .post(
    auth(),
    validate(userValidation.addEducation),
    userController.addEducation
  )
  .patch(
    auth(),
    validate(userValidation.updateEducation),
    userController.updateEducation
  );

// project crud operations
router
  .route("/user/project")
  .post(
    auth(),
    validate(userValidation.addProject),
    upload.single("media"),
    userController.addProject
  )
  .patch(
    auth(),
    validate(userValidation.updateProject),
    upload.single("media"),
    userController.updateProject
  );

router.route("/user/all-users").get(auth(), userController.getAllUsers);
router.route("/user/search").get(auth(), userController.searchUsers);
router.route("/user/filters").get(auth(), userController.searchUsersFilters);
router.route("/user/user-details").get(auth(), userController.getUserDetails);
router.route("/user/delete").get(auth(), userController.deleteUserById);
router.route("/user/watchlist").post(auth(), userController.addToWatchList);
router.route("/user/followers").delete(auth(), userController.removeFromWatchList);
// router
//   .route("/shorlist/")
//   .post(
//     auth(),
//     // validate(shortlistValidation.shortlist),
//     userController.addToShortlist
//   )
//   .patch(
//     auth(),
//     // validate(shortlistValidation.updateShorlist),
//     // userController.updateShorlist
//   );

router.route("/user/follow").post(auth(), userController.addToFollow);
router.route("/user/following").delete(auth(), userController.removeFromFollowing);

router.route("/user/permissions")
  .post(auth(), userController.grantUserPermissions)
  .put(auth(), userController.updateUserPermissions);

router.route("/user/getpermissions").get(auth(), userController.getPermissions);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: User
 */

/**
 * @swagger
 * /user/:
 *   get:
 *     summary: Get logged in user's information including profile, experience, education and projects
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 role:
 *                   type: string
 *                 gender:
 *                   type: string
 *                 is_verified:
 *                   type: boolean
 *                 Profile:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     dateOfBirth:
 *                       type: string
 *                       format: date
 *                     country:
 *                       type: string
 *                     city:
 *                       type: string
 *                     industry:
 *                       type: string
 *                     languages:
 *                       type: string
 *                     skills:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                 Experiences:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       company:
 *                         type: string
 *                       designation:
 *                         type: string
 *                       fromDate:
 *                         type: string
 *                         format: date
 *                       toDate:
 *                         type: string
 *                         format: date
 *                       current:
 *                         type: boolean
 *                 Education:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       institute:
 *                         type: string
 *                       degree:
 *                         type: string
 *                       fromDate:
 *                         type: string
 *                         format: date
 *                       toDate:
 *                         type: string
 *                         format: date
 *                       current:
 *                         type: boolean
 *                 Projects:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       startDate:
 *                         type: string
 *                         format: date-time
 *                       endDate:
 *                         type: string
 *                         format: date-time
 *                       current:
 *                         type: boolean
 *                       media:
 *                         type: string
 *                       completionType:
 *                         type: string
 *                       associateWith:
 *                         type: string
 *             example:
 *               id: 1
 *               phone: 923000000000
 *               email: fake@example.com
 *               name: fake name
 *               gender: male
 *               role: user
 *               is_verified: false
 *               Profile:
 *                 id: 5
 *                 dateOfBirth: "2024-07-15T14:39:35.000Z"
 *                 country: Pakistan
 *                 city: Faisalabad
 *                 industry: Information Technology
 *                 languages: English, urdu
 *                 skills: Web-development, mobile development, desktop application
 *                 avatar: /public/uploads/avatar-1721304477887-405963959-pexels-moose-photos-170195-1036623.jpg
 *               Experiences:
 *                 - id: 1
 *                   company: Andropplelabs
 *                   designation: Software Engineer
 *                   fromDate: "2022-01-01T00:00:00.000Z"
 *                   toDate: "2022-01-01T00:00:00.000Z"
 *                   current: false
 *               Education:
 *                 - id: 1
 *                   institute: Riphah international university
 *                   degree: BS Software Engineer
 *                   fromDate: "2022-01-01T00:00:00.000Z"
 *                   toDate: "2022-01-01T00:00:00.000Z"
 *                   current: false
 *               Projects:
 *                 - id: 3
 *                   title: Old Emp
 *                   description: test project
 *                   startDate: "2024-10-11T19:00:00.000Z"
 *                   endDate: "2024-10-11T19:00:00.000Z"
 *                   current: false
 *                   media: /public/uploads/media-1721312096786-639694354-Booking Management.docx
 *                   completionType: solo
 *                   associateWith: Andropplelabs
 *       "404":
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: User not found
 *       "500":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 message:
 *                   type: string
 *             example:
 *               code: 500
 *               message: Please authenticate
 */

/**
 * @swagger
 * /user/:
 *   post:
 *     summary: Add new profile of logged in user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dateOfBirth:
 *                 type: date
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               industry:
 *                 type: string
 *               languages:
 *                 type: string
 *               skills:
 *                 type: string
 *               avatar:
 *                 type: string
 *             example:
 *               dateOfBirth: "2022-01-01T00:00:00.000Z"
 *               country: fake country
 *               city: fake city
 *               industry: fake industry
 *               languages: lang1,lang2
 *               skills: skill1,skill2,skill3
 *               avatar: https://server-domain-name/public/uploads/avatar-1982398725-pic.png
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               message: string
 *             example:
 *               message: Profile created successfully
 *       "500":
 *         description: Unauthorized
 *         content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          code: number
 *                          message: string
 *                  example:
 *                      code: 500
 *                      message: Please authenticate
 *       "400":
 *         description: Bad request
 *         content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          code: number
 *                          message: string
 *                  example:
 *                      code: 400
 *                      message: Profile already exist
 */

/**
 * @swagger
 * /user/education:
 *   post:
 *     summary: Add new Education of logged in user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               institute:
 *                 type: string
 *               degree:
 *                 type: string
 *               fromDate:
 *                 type: date
 *               toDate:
 *                 type: date
 *               current:
 *                 type: boolean
 *             example:
 *               institute: fake institute
 *               degree: BSSE
 *               fromDate: "2022-01-01T00:00:00.000Z"
 *               toDate: "2022-01-01T00:00:00.000Z"
 *               current: false
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               message: string
 *             example:
 *               message: Education added successfully
 *       "400":
 *         description: Bad request
 *         content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          code: number
 *                          message: string
 *                  example:
 *                      code: 400
 *                      message: Bad request
 *       "500":
 *         description: Unauthorized
 *         content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          code: number
 *                          message: string
 *                  example:
 *                      code: 500
 *                      message: Please authenticate
 */

/**
 * @swagger
 * /user/experience:
 *   post:
 *     summary: Add new Experience of logged in user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company:
 *                 type: string
 *               designation:
 *                 type: string
 *               fromDate:
 *                 type: date
 *               toDate:
 *                 type: date
 *               current:
 *                 type: boolean
 *             example:
 *               company: fake company
 *               designation: fake designation
 *               fromDate: "2022-01-01T00:00:00.000Z"
 *               toDate: "2022-01-01T00:00:00.000Z"
 *               current: false
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               message: string
 *             example:
 *               message: Experience added successfully
 *       "400":
 *         description: Bad request
 *         content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          code: number
 *                          message: string
 *                  example:
 *                      code: 400
 *                      message: Bad request
 *       "500":
 *         description: Unauthorized
 *         content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          code: number
 *                          message: string
 *                  example:
 *                      code: 500
 *                      message: Please authenticate
 */

/**
 * @swagger
 * /user/project:
 *   post:
 *     summary: Add new Projects of logged in user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: date
 *               endDate:
 *                 type: date
 *               current:
 *                 type: boolean
 *               media:
 *                 type: string
 *               completionType:
 *                 type: string
 *               associateWith:
 *                 type: string
 *             example:
 *               title: fake title
 *               description: fake description
 *               fromDate: "2022-01-01T00:00:00.000Z"
 *               toDate: "2022-01-01T00:00:00.000Z"
 *               current: false
 *               media: http://server-domain-name/public/uploads/media-987986856576-filename.pdf
 *               completionType: solo
 *               associateWith: company name
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               message: string
 *             example:
 *               message: Project added successfully
 *       "400":
 *         description: Bad request
 *         content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          code: number
 *                          message: string
 *                  example:
 *                      code: 400
 *                      message: Bad request
 *       "500":
 *         description: Unauthorized
 *         content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          code: number
 *                          message: string
 *                  example:
 *                      code: 500
 *                      message: Please authenticate
 */

/**
 * @swagger
 * /user/project:
 *   patch:
 *     summary: Update Project details of logged in user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the project to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               current:
 *                 type: boolean
 *               media:
 *                 type: string
 *               completionType:
 *                 type: string
 *               associateWith:
 *                 type: string
 *             example:
 *               title: updated title
 *               description: updated description
 *               startDate: "2022-01-01T00:00:00.000Z"
 *               endDate: "2022-12-31T23:59:59.999Z"
 *               current: true
 *               media: http://server-domain-name/public/uploads/media-987986856576-updated-filename.pdf
 *               completionType: team
 *               associateWith: updated company name
 *     responses:
 *       "200":
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: Project updated successfully
 *       "400":
 *         description: Bad request
 *         content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          code: number
 *                          message: string
 *                  example:
 *                      code: 400
 *                      message: Bad request
 *       "500":
 *         description: Internal server error
 *         content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          code: number
 *                          message: string
 *                  example:
 *                      code: 500
 *                      message: Internal server error
 */

/**
 * @swagger
 * /user/experience:
 *   patch:
 *     summary: Update Experience of logged in user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the experience to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company:
 *                 type: string
 *               designation:
 *                 type: string
 *               fromDate:
 *                 type: date
 *               toDate:
 *                 type: date
 *               current:
 *                 type: boolean
 *             example:
 *               company: fake company
 *               designation: fake designation
 *               fromDate: "2022-01-01T00:00:00.000Z"
 *               toDate: "2022-01-01T00:00:00.000Z"
 *               current: false
 *     responses:
 *       "200":
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: Experience updated successfully
 *       "400":
 *         description: Bad request
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
 *               message: Bad request
 *       "500":
 *         description: Internal server error
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
 *               code: 500
 *               message: Internal server error
 */

/**
 * @swagger
 * /user/education:
 *   patch:
 *     summary: Update Education of logged in user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the education to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               institute:
 *                 type: string
 *               degree:
 *                 type: string
 *               fromDate:
 *                 type: date
 *               toDate:
 *                 type: date
 *               current:
 *                 type: boolean
 *             example:
 *               institute: fake institute
 *               degree: BSSE
 *               fromDate: "2022-01-01T00:00:00.000Z"
 *               toDate: "2022-01-01T00:00:00.000Z"
 *               current: false
 *     responses:
 *       "200":
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: Education updated successfully
 *       "400":
 *         description: Bad request
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
 *               message: Bad request
 *       "500":
 *         description: Internal server error
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
 *               code: 500
 *               message: Internal server error
 */

/**
 * @swagger
 * /user/:
 *   patch:
 *     summary: Update profile of logged in user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user profile to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dateOfBirth:
 *                 type: date
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               industry:
 *                 type: string
 *               languages:
 *                 type: string
 *               skills:
 *                 type: string
 *               avatar:
 *                 type: string
 *             example:
 *               dateOfBirth: "2022-01-01T00:00:00.000Z"
 *               country: fake country
 *               city: fake city
 *               industry: fake industry
 *               languages: lang1,lang2
 *               skills: skill1,skill2,skill3
 *               avatar: https://server-domain-name/public/uploads/avatar-1982398725-pic.png
 *     responses:
 *       "200":
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: Profile updated successfully
 *       "500":
 *         description: Internal server error
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
 *               code: 500
 *               message: Internal server error
 *       "400":
 *         description: Bad request
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
 *               message: Profile already exists or Bad request
 */
