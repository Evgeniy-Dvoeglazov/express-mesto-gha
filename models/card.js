const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30
  },
  link: {
    required: true,
    type: String,
    validate: {
      validator: (v) => /https?:\/\/(\d{3}\.)?[a-zA-Z0-9\-._~:?#[\]@!$&'()*+,;=]+#?\.[a-zA-Z]{2,3}(\/\S*)?/.test(v),
      message: "Неправильно указана ссылка"
    }
  },
  owner: {
    ref: "user",
    required: true,
    type: mongoose.Schema.Types.ObjectId
  },

  likes: {
    ref: "user",
    type: [mongoose.Schema.Types.ObjectId],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { versionKey: false });

module.exports = mongoose.model("card", cardSchema);
