const { celebrate, Joi } = require("celebrate");

module.exports.createUserValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(\d{3}\.)?[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,3}(\/\S*)?/),
    about: Joi.string().min(2).max(30)
  })
});

module.exports.loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8)
  })
});

module.exports.userIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24)
  })
});

module.exports.profileValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30)
  })
});

module.exports.profileAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/https?:\/\/(\d{3}\.)?[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,3}(\/\S*)?/)
  })
});
