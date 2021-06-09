const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const expressAsyncHandler = require("express-async-handler");
const env = require("dotenv");

const userRouter = express.Router();

userRouter.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    try {
      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      const email = req.body.email;
      const password = req.body.password;

      if (
        firstName === "" ||
        lastName === "" ||
        email === "" ||
        password == ""
      ) {
        return res.status(401).send({ message: "Please fill all the fields" });
      } else {
        const re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(email)) {
          return res
            .status(401)
            .send({ message: "Please enter a valid email" });
        } else {
          if (password.length < 8) {
            return res.status(401).send({
              message: "Please enter a password with length greater than 8",
            });
          } else {
            const user = await User.find({ email: email });
            if (user.length > 0) {
              return res
                .status(401)
                .send({ message: "User with that email already exists" });
            } else {
              const newUser = new User({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: bcrypt.hashSync(password, 8),
              });
              const createUser = await newUser.save();
              res.status(200).send({
                message: "Success",
                user: {
                  firstName: firstName,
                  lastName: lastName,
                  email: email,
                },
              });
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: "Internal server error!" });
    }
  })
);

userRouter.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;

      if (email === "" || password === "") {
        return res.status(401).send({ message: "Please fill all the fields" });
      } else {
        const user = await User.findOne({ email: email });
        if (user) {
          if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "28d",
            });
            return res.status(200).send({
              message: "Success",
              token: token,
              user: user,
            });
          } else {
            return res.status(401).send({ message: "Invalid Credentials" });
          }
        } else {
          return res.status(401).send({ message: "Invalid Credentials" });
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: "Internal server error!" });
    }
  })
);

module.exports = userRouter;
