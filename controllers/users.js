const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(err => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Пользователи не найдены' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
}

module.exports.getUser = (req, res) => {
  User.findById(req.params._id)
    .then(user => {
      console.log(user);
      if (user !== null) {
        res.send({ data: user })
      }
      res.status(400 || 404).send({ message: 'Запрашиваемый пользователь не найден' });
    })
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(err => {
      console.log(err.name);
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
}

module.exports.changeProfileInfo = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
}

module.exports.changeAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true })
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.name === 'SomeErrorName') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
}