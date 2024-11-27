const Joi = require("joi");
const { projectCompletionType, genderEnum } = require("../enums");

const addExperience = {
  body: Joi.object().keys({
    logo: Joi.object({
      originalname: Joi.string().required(),
      mimetype: Joi.string()
        .valid(
          "image/jpeg", "image/png", "image/jpg"
        )
        .required(),
      size: Joi.number()
        .max(1024 * 1024 * 5)
        .required(),
    }).allow(null || ""),
    company: Joi.string().allow(""),
    designation: Joi.string().allow(""),
    type: Joi.string().allow(""),
    fromDate: Joi.date().allow(""),
    toDate: Joi.date().allow(""),
    current: Joi.boolean().allow(""),
    location: Joi.string().allow(""),
  }),
};

const addEducation = {
  body: Joi.object().keys({
    logo: Joi.object({
      originalname: Joi.string().required(),
      mimetype: Joi.string()
        .valid(
          "image/jpeg", "image/png", "image/jpg"
        )
        .required(),
      size: Joi.number()
        .max(1024 * 1024 * 5)
        .required(),
    }).allow(null || ""),
    institute: Joi.string().allow(""),
    degree: Joi.string().allow(""),
    fromDate: Joi.date().allow(""),
    toDate: Joi.date().allow(""),
    current: Joi.boolean().allow(""),
    grade: Joi.string().allow(""),
  }),
};

const addProject = {
  body: Joi.object().keys({
    title: Joi.string().allow(""),
    description: Joi.string().allow(""),
    startDate: Joi.date().allow(""),
    endDate: Joi.date().allow(""),
    current: Joi.boolean().allow(""),
    media: Joi.object({
      originalname: Joi.string().required(),
      mimetype: Joi.string()
        .valid(
          "image/jpeg",
          "image/png",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        )
        .required(),
      size: Joi.number()
        .max(1024 * 1024 * 5)
        .required(),
    }).allow(null || ""),
    completionType: Joi.string()
      .valid(...projectCompletionType)
      .default("solo"),
    associatWith: Joi.string().allow(""),
  }),
};

const updateProject = {
  query: Joi.object().keys({
    id: Joi.number().required(),
  }),
  body: Joi.object().keys({
    title: Joi.string().allow(""),
    description: Joi.string().allow(""),
    startDate: Joi.date().allow(""),
    endDate: Joi.date().allow(""),
    current: Joi.boolean().allow(""),
    media: Joi.object({
      originalname: Joi.string().required(),
      mimetype: Joi.string()
        .valid(
          "image/jpeg",
          "image/png",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        )
        .required(),
      size: Joi.number()
        .max(1024 * 1024 * 5)
        .required(),
    }).allow(null || ""),
    completionType: Joi.string()
      .valid(...projectCompletionType)
      .default("solo"),
    associatWith: Joi.string().allow(""),
  }),
};

const updateExperience = {
  query: Joi.object().keys({
    id: Joi.number().required(),
  }),
  body: Joi.object().keys({
    logo: Joi.object({
      originalname: Joi.string().required(),
      mimetype: Joi.string()
        .valid(
          "image/jpeg",
          "image/png",
          "application/pdf",
        )
        .required(),
      size: Joi.number()
        .max(1024 * 1024 * 5)
        .required(),
    }).allow(null || ""),
    company: Joi.string().allow(""),
    designation: Joi.string().allow(""),
    fromDate: Joi.date().allow(""),
    toDate: Joi.date().allow(""),
    current: Joi.boolean().allow(""),
    location: Joi.string().allow(""),
  }),
};

const updateEducation = {
  query: Joi.object().keys({
    id: Joi.number().required(),
  }),
  body: Joi.object().keys({
    logo: Joi.object({
      originalname: Joi.string().required(),
      mimetype: Joi.string()
        .valid(
          "image/jpeg",
          "image/png",
          "application/pdf",
        )
        .required(),
      size: Joi.number()
        .max(1024 * 1024 * 5)
        .required(),
    }).allow(null || ""),
    institute: Joi.string().allow(""),
    degree: Joi.string().allow(""),
    fromDate: Joi.date().allow(""),
    toDate: Joi.date().allow(""),
    current: Joi.boolean().allow(""),
    grade: Joi.string().allow("")
  }),
};

const updateProfileDetails = {
  query: Joi.object().keys({
    id: Joi.number().allow(""),
  }),
  body: Joi.object().keys({
    dateOfBirth: Joi.date().allow(""),
    languages: Joi.string().allow(""),
    skills: Joi.string().allow(""),
    tags: Joi.string().allow(""),
    avatar: Joi.object({
      originalname: Joi.string().required(),
      mimetype: Joi.string().valid("image/jpeg", "image/png", "image/jpg").required(),
      size: Joi.number()
        .max(1024 * 1024 * 5)
        .required(),
    }).allow(null || ""),
    about: Joi.string().allow(""),
    gender: Joi.string()
      .valid(...genderEnum)
      .default("male"),
    resume: Joi.object({
      originalname: Joi.string().required(),
      mimetype: Joi.string().valid(
        "image/jpeg",
        "image/png",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ).required(),
      size: Joi.number()
        .max(1024 * 1024 * 5)
        .required(),
    }).allow(null || ""),
  }),
};


module.exports = {
  addExperience,
  addEducation,
  addProject,
  updateProject,
  updateExperience,
  updateEducation,
  updateProfileDetails,
};
