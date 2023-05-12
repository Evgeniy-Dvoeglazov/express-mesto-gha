const http2 = require('node:http2');
const mongoose = require('mongoose');
const User = require('../models/user');

const {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = http2.constants;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user !== null) {
        return res.send({ data: user });
      }
      return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(HTTP_STATUS_CREATED).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

function updateUserInfo(req, res, handleError) {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      handleError(err, res);
    });
}

function handleUserProfileError(err, res) {
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
  }
  return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
}

function handleAvatarError(res) {
  res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
}

module.exports.changeProfileInfo = (req, res) => {
  updateUserInfo(req, res, handleUserProfileError);
};

module.exports.changeAvatar = (req, res) => {
  updateUserInfo(req, res, handleAvatarError);
};
