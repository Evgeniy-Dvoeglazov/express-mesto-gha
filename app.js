const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { PORT = 3000 } = process.env;
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  family: 4
});

app.use((req, res, next) => {
  req.user = {
    _id: "645ba5c2fd52191a1b045c88"
  };

  next();
});

app.use("/", require("./routes/index"));

app.all("*", (req, res) => res.status(404).send({ message: "Произошла ошибка" }));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
