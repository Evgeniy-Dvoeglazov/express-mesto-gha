const http2 = require("node:http2");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR
} = http2.constants;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: "Произошла ошибка" }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user !== null) {
        return res.send({ data: user });
      }
      return res.status(HTTP_STATUS_NOT_FOUND).send({ message: "Запрашиваемый пользователь не найден" });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: "Переданы некорректные данные" });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: "Произошла ошибка" });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash
    }))
    .then((user) => res.status(HTTP_STATUS_CREATED).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: "Переданы некорректные данные" });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: "Произошла ошибка" });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, "some-secret-key", { expiresIn: "7d" });
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

function updateUserInfo(req, res, handleError, getData) {
  User.findByIdAndUpdate(req.user._id, getData(req, res), { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      handleError(err, res);
    });
}

function getUserInfoData(req) {
  const { name, about } = req.body;
  return { name, about };
}

function getUserAvatarData(req) {
  const { avatar } = req.body;
  return { avatar };
}

function handleUserProfileError(err, res) {
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: "Переданы некорректные данные" });
  }
  return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: "Произошла ошибка" });
}

function handleAvatarError(res) {
  res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: "Произошла ошибка" });
}

module.exports.changeProfileInfo = (req, res) => {
  updateUserInfo(req, res, handleUserProfileError, getUserInfoData);
};

module.exports.changeAvatar = (req, res) => {
  updateUserInfo(req, res, handleAvatarError, getUserAvatarData);
};
