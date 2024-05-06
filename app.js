require("dotenv").config();
const express = require("express");
const monoose = require("mongoose");
const session = require("express-session");
const color = require("colors");

const app = express();
const port = process.env.PORT || 5000;

// Middlewares

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: "my secrete key",
    saveUninitialized: true,
    resave: false,
  })
);
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

//templete engine
app.set("view engine", "ejs");

//routes
app.use("", require("./routes/routes.js"));

app.use(express.static("./uploads"));

app.listen(port, () => {
  console.log(`server runing on http://localhost:${port}`);
});

monoose
  .connect(process.env.URL)
  .then(() => {
    console.log(`Database connected...`.bgBlue);
  })
  .catch(() => {
    console.log(`connetion failed..`);
  });
