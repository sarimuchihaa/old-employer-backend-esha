const Joi = require("joi");
const { password } = require("./custom.validation");
const { userRoles } = require("../enums");

const register = {
  body: Joi.object().keys({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    industry: Joi.string().required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    phone: Joi.string().allow(''),
    watchlist: Joi.array().items(Joi.string()).allow(null).optional(),
    followers: Joi.array().items(Joi.string()).allow(null).optional(),
    following: Joi.array().items(Joi.string()).allow(null).optional(),
    role: Joi.string()
      .valid(...userRoles)
      .default("user"),
  }),
  availability: Joi.boolean().required().default(false),
};

const SuperadminRegister = {
  body: Joi.object().keys({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    avatar: Joi.object({
      originalname: Joi.string().required(),
      mimetype: Joi.string().valid("image/jpeg", "image/png", "image/jpg").required(),
      size: Joi.number()
        .max(1024 * 1024 * 5)
        .required(),
    }).allow(null, ""),
    phone: Joi.string().allow(''),
    role: Joi.string()
      .valid(...userRoles)
      .default("superadmin"),
  }),
};

const SuperadminLogin = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  }),
};

const forgetPassword = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const googleLogin = {
  body: Joi.object().keys({
    idToken: Joi.string().required(),
  }),
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
