require("dotenv").config();
// Load model
const { User, Superadmin } = require("../db");
const { Op } = require("sequelize");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isUserExist } = require("../services/user.service");
const {
  sendResetPasswordEmail,
  sendVerificationEmail,
} = require("../services/email.service");
const { OAuth2Client } = require("google-auth-library");


// SuperadminRegister
const SuperadminRegister = async (req, res) => {
  try {
    // check user exist with same email or not
    // const isUserExsits = await isUserExist(req.body.email);
    // if (isUserExsits) {
    //   throw new Error("User already exist with same email");
    // }

    // if user not exist then hash password of requested user
    const hashPassword = await bcrypt.hash(req.body.password, 8);
    const body = { ...req.body, password: hashPassword };

    // create user in database
    const superadmin = await Superadmin.create(body);
    // create email-verification token
    // const token = jwt.sign(
    //   { id: superadmin.id, iat: Date.now() },
    //   process.env.AUTH_SECRET,
    //   { expiresIn: Date.now() + 30 * 60 * 1000 }
    // );

    //send verification token through email
    // await sendVerificationEmail(superadmin.email, token);
    res.status(201).send({ message: "Superadmin is created!", data: superadmin });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

// Register
const register = async (req, res) => {
  try {
    // check user exist with same email or not
    const isUserExsits = await isUserExist(req.body.email);
    if (isUserExsits) {
      throw new Error("User already exist with same email");
    }

    // if user not exist then hash password of requested user
    const hashPassword = await bcrypt.hash(req.body.password, 8);
    const body = { ...req.body, password: hashPassword };

    // create user in database
    const user = await User.create(body);

    // create email-verification token
    const token = jwt.sign(
      { id: user.id, iat: Date.now() },
      process.env.AUTH_SECRET,
      { expiresIn: Date.now() + 30 * 60 * 1000 }
    );

    //send verification token through email
    await sendVerificationEmail(user.email, token);
    res.status(201).send({ message: "Verification email has been sent" });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

// SuperadminLogin
const SuperadminLogin = async (req, res) => {
  try {
    // check user exist or not
    const superadmin = await Superadmin.findOne({
      where: { email: req.body.email },
    });

    if (!superadmin) throw new Error("Invalid Credentials");

    // if user exist then compare hased password
    const checkPassword = await bcrypt.compare(
      req.body.password,
      superadmin.password
    );

    console.log(checkPassword);
    if (!checkPassword) throw new Error("Invalid Credentials");

    // if password is valid then generate auth token
    const token = jwt.sign(
      { id: superadmin.id, iat: Date.now() },
      process.env.AUTH_SECRET,
      { expiresIn: Date.now() + 30 * 60 * 1000 }
    );
    res.status(200).send({ token, expires: Date.now() + 30 * 60 * 1000 });
  } catch (err) {
    res.status(401).send(err.message);
  }
};

// Login
const login = async (req, res) => {
  try {
    // check user exist or not
    const user = await User.findOne({
      where: { email: req.body.email },
    });

    if (!user) throw new Error("Invalid Credentials");

    // if user exist then compare hased password
    const checkPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    console.log(checkPassword);
    if (!checkPassword) throw new Error("Invalid Credentials");

    // if password is valid then generate auth token
    const token = jwt.sign(
      { id: user.id, iat: Date.now() },
      process.env.AUTH_SECRET,
      { expiresIn: Date.now() + 30 * 60 * 1000 }
    );
    res.status(200).send({ token, expires: Date.now() + 30 * 60 * 1000 });
  } catch (err) {
    res.status(401).send(err.message);
  }
};

const googleLogin = async (req, res) => {
  try {
    const { idToken } = req;
    const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);

    const details = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
    });

    const { name, email, picture } = details.getPayload();
    console.log({ name, email, picture });
  } catch (err) {
    res.status(401).send(err.message);
  }
};

const forgetPassword = async (req, res) => {
  try {
    // check user exist or not
    const user = await User.findOne({
      where: { email: req.body.email },
    });
    if (!user) throw new Error("User not found with this email");

    // if user exist then generate reset password token
    const token = jwt.sign(
      { id: user.id, iat: Date.now() },
      process.env.AUTH_SECRET,
      { expiresIn: Date.now() + 30 * 60 * 1000 }
    );

    // send reset password token throw email
    await sendResetPasswordEmail(user.email, token);
    res
      .status(200)
      .send({ message: "reset password link has been sent to your email" });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const resetPassword = async (req, res) => {
  try {
    const {
      user,
      body: { password },
    } = req;

    // encrypt the new password
    const hashPassword = await bcrypt.hash(password, 8);

    // update new hashed password in db
    await User.update({ password: hashPassword }, { where: { id: user.id } });
    res.status(200).send({ message: "Password changed successfully" });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

module.exports = {
  register,
  SuperadminRegister,
  login,
  SuperadminLogin,
  forgetPassword,
  resetPassword,
  googleLogin
};
