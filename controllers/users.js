const http2 = require("node:http2");
const bcrypt = require("bcryptjs"); // Для хеширования пароля
const jwt = require("jsonwebtoken"); // Для создания токенов
const User = require("../models/user");

// Подключаем кастомный класс ошибок
const NotFoundError = require("../errors/not-found-error");
const ConflictError = require("../errors/conflict-error");

const { NODE_ENV, JWT_SECRET } = process.env;

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
  // хешируем пароль
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash // записываем хеш в базу
    }))
    .then((user) => User.findById(user._id))
    .then((user) => res.status(HTTP_STATUS_CREATED).send({ data: user }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError("Пользователь с таким email уже существует"));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      // Создаем токен
      const token = jwt.sign({ _id: user._id }, NODE_ENV === "production" ? JWT_SECRET : "dev-secret", { expiresIn: "7d" });
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 3600000 * 24 * 7
      }).send({ token });
    })
    .catch(next);
};

function updateProfile(req, res, bodyItems, next) {
  User.findByIdAndUpdate(req.user._id, bodyItems, { new: true, runValidators: true })
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
