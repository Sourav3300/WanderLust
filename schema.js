const joi = require("joi");

module.exports.ListingSchema = joi.object({
  listing: joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    location: joi.string().required(),
    country: joi.string().required(),
    price: joi.number().required().min(0)
  }).required()
});

module.exports.ReviewSchema = joi.object({
  review: joi.object({
    rating: joi.number().required().min(1).max(5),
    comment: joi.string().required()
  }).required()
});