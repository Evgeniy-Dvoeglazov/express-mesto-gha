const { celebrate, Joi } = require("celebrate");

module.exports.createUserValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(\d{3}\.)?[a-zA-Z0-9\-._~:?#[\]@!$&'()*+,;=]+#?\.[a-zA-Z]{2,3}(\/\S*)?/),
    about: Joi.string().min(2).max(30)
  })
});

module.exports.loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  })
});

module.exports.userIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24)
  })
});

module.exports.profileValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30)
  })
});

module.exports.avatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/https?:\/\/(\d{3}\.)?[a-zA-Z0-9\-._~:?#[\]@!$&'()*+,;=]+#?\.[a-zA-Z]{2,3}(\/\S*)?/)
  })
});
