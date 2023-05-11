const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Пользователи не найдены' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
}

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      if (user !== null) {
        return res.send({ data: user })
      }
      return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
}

module.exports.changeProfileInfo = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
}

module.exports.changeAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true })
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
}