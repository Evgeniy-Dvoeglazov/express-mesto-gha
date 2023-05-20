const { celebrate, Joi } = require("celebrate");

module.exports.createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().pattern(/https?:\/\/(\d{3}\.)?[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,3}(\/\S*)?/)
  })
});

module.exports.cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24)
  })
});