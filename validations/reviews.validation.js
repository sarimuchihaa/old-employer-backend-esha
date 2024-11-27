const Joi = require("joi");

const addReview = {
  body: Joi.object().keys({
    emp_status: Joi.string().required(),
    emp_thougts: Joi.string().allow(null).optional(),
    hide_emp_info: Joi.boolean().default(false),
    compensation: Joi.number().required(),
    work_balance: Joi.number().required(),
    career_opportunities: Joi.number().required(),
    cutlers: Joi.number().required(),
    recommendation: Joi.boolean().default(false),
    suggestions: Joi.string().allow(null).optional(),
    best_worst: Joi.string().allow(null).optional(),
    environment: Joi.string().required(),
    employment: Joi.string().required(),
    insurance: Joi.boolean().required().default(false),
    residence: Joi.boolean().required().default(false),
    benovland_fund: Joi.boolean().required().default(false),
    medical: Joi.boolean().required().default(false),
    other_benefit: Joi.string().allow(null).optional(),
    salary_range: Joi.string().required(),
    pay_on_time: Joi.boolean().required().default(false),
    bonus: Joi.string().required(),
    increment: Joi.string().required(),
    increment_duration: Joi.string().required(),
    monthly_leaves: Joi.string().required(),
    annually_leaves: Joi.string().required(),
    public_review: Joi.string().allow(null).optional(),
    companyId: Joi.number().required(),
  }),
};

const verifyReview = {
  query: Joi.object().keys({
    // id: Joi.number().required(),
    id: Joi.string().guid({ version: ["uuidv4"] }).required(),
  }),
  body: Joi.object().keys({
    verification_doc: Joi.object({
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
    }).required(),
    is_verified: Joi.boolean().optional(),
  })
};

const getReviewByCompany = {
  query: Joi.object().keys({
    companyId: Joi.number().required(),
  }),
};

const getReviewByUser = {
  query: Joi.object().keys({
    id: Joi.number().required(),
  }),
};

const getEndowsByCompany = {
  query: Joi.object().keys({
    companyId: Joi.number().required(),
  }),
};

const endowsReview = {
  body: Joi.object().keys({
    emp_thougts: Joi.string().required(),
    companyId: Joi.number().required(),
  }),
};

module.exports = {
  addReview,
  verifyReview,
  getReviewByCompany,
  getReviewByUser,
  endowsReview,
  getEndowsByCompany,
};
