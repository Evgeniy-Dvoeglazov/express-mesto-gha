const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { errors } = require("celebrate");
const customError = require("./middlewares/customError");
const defaultError = require("./middlewares/defaultError");

const { PORT = 3000 } = process.env;
const app = express();

// const auth = require("./middlewares/auth");
// const { createUser, login } = require("./controllers/users");

app.use(cors());
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  family: 4
});

app.use("/", require("./routes/index"));

app.use(errors());
app.use(customError);
app.use(defaultError);

app.listen(PORT);
