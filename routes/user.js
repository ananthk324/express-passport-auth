const express = require("express");
const router = express.Router();

const User = require("../model/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

router.get("/login", (req, res) => res.render("login"));

router.get("/signup", (req, res) => res.render("signup"));

router.post("/signup", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];
  if (!name || !email || !password || !password2) {
    errors.push({ message: "Please fill all the fields" });
  }

  if (password !== password2) {
    errors.push({ message: "Password not matching" });
  }

  if (errors.length) {
    res.render("signup", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ message: "User already exists, please login" });
        res.render("signup", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const new_user = new User({
          name,
          email,
          password,
        });

        // Hashing
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(new_user.password, salt, (err, hash) => {
            if (err) throw err;
            new_user.password = hash;

            new_user
              .save()
              .then(() => {
                req.flash("success_msg", "You are now registered");
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

router.gett("/logout", (req, res) => {
  req.logout();
  req.flash("Success", "You have logged out");
  res.redirect("/login");
});

module.exports = router;
