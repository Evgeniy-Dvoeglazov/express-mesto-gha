const Card = require("../models/card");

// Подключаем кастомные классы ошибок
const NotFoundError = require("../errors/not-found-error");
const ForbiddenError = require("../errors/forbidden-error");

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card === null) {
        throw new NotFoundError("Карточка не найдена");
      } else if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError("Нет доступа");
      } else {
        Card.findByIdAndRemove(req.params.cardId)
          .then(() => res.send({ message: "Карточка удалена" }))
          .catch(next);
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card !== null) {
        return res.send({ data: card });
      }
      throw new NotFoundError("Карточка не найдена");
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card !== null) {
        return res.send({ data: card });
      }
      throw new NotFoundError("Карточка не найдена");
    })
    .catch(next);
};
