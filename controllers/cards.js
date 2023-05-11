const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Карточки не найдены' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then(card => res.send({ data: card }))
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
  .then(card => res.send({ data: card }))
  .catch(err => {
    if (err.name === 'SomeErrorName') {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }
    return res.status(500).send({ message: 'Произошла ошибка' });
  });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
  .then(card => {
      console.log(card);
      if (card !== null) {
        res.send({ data: card })
      }
      return res.status(404).send({ message: 'Карточка не найдена' });
    })
  .catch(err => {
    console.log(err.name);
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные' });
    }
    return res.status(500).send({ message: 'Произошла ошибка' });
  });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
  .then(card => {
    console.log(card);
    if (card !== null) {
      res.send({ data: card })
    }
    return res.status(404).send({ message: 'Карточка не найдена' });
  })
  .catch(err => {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные' });
    }
    return res.status(500).send({ message: 'Произошла ошибка' });
  });
};