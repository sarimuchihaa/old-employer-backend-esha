const Joi = require("joi");

const Shortlist = {
  body: Joi.object().keys({
    candidateId: Joi.number().required(),
    category: Joi.string().required(),
  }),
};

const updateShortlist = {
  query: Joi.object().keys({
    id: Joi.number().required(),
    category: Joi.string().required(),
  }),
};

const removeCandidatesByCategory = {
  query: Joi.object().keys({
    category: Joi.string().required(),
  }),
};

const viewShortlistByCategory = {
  query: Joi.object().keys({
    category: Joi.string().required(),
  }),
}
module.exports = {
  Shortlist,
  updateShortlist,
  removeCandidatesByCategory,
  viewShortlistByCategory
};
