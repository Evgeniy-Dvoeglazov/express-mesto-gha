const http2 = require("node:http2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const NotFoundError = require("../errors/not-found-error");

const { HTTP_STATUS_CREATED } = http2.constants;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user !== null) {
        return res.send({ data: user });
      }
      throw new NotFoundError("Запрашиваемый пользователь не найден");
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash
    }))
    // .then((user) => User.findById(user._id))
    .then((user) => res.status(HTTP_STATUS_CREATED).send({ data: user }))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, "some-secret-key", { expiresIn: "7d" });
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 3600000 * 24 * 7
      }).send({ token });
    })
    .catch(next);
};

function updateProfile(req, res, body, next) {
  User.findByIdAndUpdate(req.user._id, body, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch(next);
}

module.exports.changeProfileInfo = (req, res, next) => {
  const profileBody = { name: req.body.name, about: req.body.about };
  updateProfile(req, res, profileBody, next);
};

module.exports.changeAvatar = (req, res, next) => {
  const avatarBody = { avatar: req.body.avatar };
  updateProfile(req, res, avatarBody, next);
};
