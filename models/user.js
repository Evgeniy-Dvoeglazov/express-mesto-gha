const mongoose = require("mongoose");
const isEmail = require("validator/lib/isEmail");
const bcrypt = require("bcryptjs");
const UnauthorizedError = require("../errors/unauthorized-error");

const userSchema = new mongoose.Schema({
  name: {
    default: "Жак-Ив Кусто",
    type: String,
    minlength: 2,
    maxlength: 30
  },
  about: {
    default: "Исследователь",
    type: String,
    minlength: 2,
    maxlength: 30
  },
  avatar: {
    default: "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    type: String,
    validate: {
      validator: (v) => /https?:\/\/(\d{3}\.)?[a-zA-Z0-9\-._~:?#[\]@!$&'()*+,;=]+#?\.[a-zA-Z]{2,3}(\/\S*)?/.test(v),
      message: "Неправильно указана ссылка"
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: "Неправильный формат почты"
    }
  },
  password: {
    type: String,
    required: true,
    select: false
  }
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select("+password") // this — это модель User
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError("Неправильные почта или пароль");
      }
      // сравниваем переданный пароль и хеш из базы
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError("Неправильные почта или пароль");
          }
          return user;
        });
    });
};

module.exports = mongoose.model("user", userSchema);
