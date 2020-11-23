const express = require("express");
const expressLayout = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");

const app = express();

// EJS
app.use(expressLayout);
app.set("view engine", "ejs");

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

// Database
const DB = require("./config/keys").mongoURL;

mongoose
  .connect(DB, { useNewUrlParser: true })
  .then(() => console.log("Mongo Connected"))
  .catch((err) => console.log(err));

// routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/user"));

const port = process.env.PORT || 5000;

app.listen(port, console.log(`Server started on ${port}`));
