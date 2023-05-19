const http2 = require("node:http2");
const mongoose = require("mongoose");
const Card = require("../models/card");

const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_FORBIDDEN
} = http2.constants;

console.log(http2.constants);

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: "Произошла ошибка" }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: "Переданы некорректные данные" });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: "Произошла ошибка" });
    });
};

module.exports.deleteCard = (req, res) => {
  if (req.user._id) {
    Card.findByIdAndRemove(req.params.cardId)
      .then((card) => {
        if (card !== null) {
          return res.send({ data: card });
        }
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: "Карточка не найдена" });
      })
      .catch((err) => {
        if (err instanceof mongoose.Error.CastError) {
          return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: "Карточка не найдена" });
        }
        return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: "Произошла ошибка" });
      });
  }
  return res.status(HTTP_STATUS_FORBIDDEN).send({ message: "Нет доступа" });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card !== null) {
        return res.send({ data: card });
      }
      return res.status(HTTP_STATUS_NOT_FOUND).send({ message: "Карточка не найдена" });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: "Переданы некорректные данные" });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: "Произошла ошибка" });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card !== null) {
        return res.send({ data: card });
      }
      return res.status(HTTP_STATUS_NOT_FOUND).send({ message: "Карточка не найдена" });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: "Переданы некорректные данные" });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: "Произошла ошибка" });
    });
};
