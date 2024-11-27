const Joi = require("joi");

const createCompany = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    createdBy: Joi.number().allow(""),
  }),
};

const NameSuggestions = {
  query: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const updateCompany = {
  query: Joi.object().keys({
    id: Joi.number().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().allow(""),
    logo: Joi.object({
      originalname: Joi.string().required(),
      mimetype: Joi.string().valid("image/jpeg", "image/png", "image/jpg").required(),
      size: Joi.number()
        .max(1024 * 1024 * 5)
        .required(),
    })
      .allow(null),
    web_url: Joi.string().allow(""),
    email: Joi.string().allow(""),
    industry: Joi.string().allow(""),
    country: Joi.string().allow(""),
    city: Joi.string().allow(""),
    size: Joi.string().allow(""),
    followers: Joi.array().items(Joi.string()).allow(null).optional(),
    claim_by: Joi.string().allow(""),
    designation: Joi.string().allow(""),
    phone: Joi.string().allow(""),
    updatedBy: Joi.number().allow(""),
  }),
};

const searchCompany = {
  query: Joi.object().keys({
    name: Joi.string().allow(""),
    industry: Joi.string().allow(""),
    country: Joi.string().allow(""),
    city: Joi.string().allow(""),
    searchText: Joi.string().allow(""),
  }),
};

const searchCompanyFilters = {
  query: Joi.object().keys({
    name: Joi.string().allow(""),
    industry: Joi.string().allow(""),
    country: Joi.string().allow(""),
    city: Joi.string().allow(""),
    searchText: Joi.string().allow(""),
    overallRating: Joi.number().integer().min(0).max(5).allow(null),
    size: Joi.string().allow(""),
  }),
};

const getSingleCompany = {
  query: Joi.object().keys({
    id: Joi.number().required(),
  }),
};

const getCompanyId = {
  query: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const companyVerify = {
  query: Joi.object().keys({
    id: Joi.number().required(),
  }),
  body: Joi.object().keys({
    company_email: Joi.string().email().required(),
    phone: Joi.string().allow(""),
    ownerId: Joi.number().allow(""),
    claim_by: Joi.string().allow(""),
    designation: Joi.string().allow(""),
    is_verified: Joi.boolean().default(false),
    verification_doc: Joi.object({
      originalname: Joi.string().allow(""),
      mimetype: Joi.string().allow("")
        .valid(
          "image/jpeg",
          "image/png",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        )
        .allow(),
      size: Joi.number()
        .max(1024 * 1024 * 5)
        .allow(null),
    })
      .allow(null)
  }),
};

module.exports = {
  createCompany,
  updateCompany,
  searchCompany,
  searchCompanyFilters,
  getSingleCompany,
  getCompanyId,
  companyVerify,
  NameSuggestions
};
