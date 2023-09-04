const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.getLoginStatus = (req, res, next) => {
  if (req.session.user) {
    return res.json({
      isAuth: req.session.isAuthenticated,
      user: req.session.user,
    });
  } else {
    return res.json({
      isAuth: false,
      user: {},
    });
  }
};

exports.putSignup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorObj = errors.mapped();
    return res.status(422).json(errorObj);
  }

  const email = req.body.email;
  const password = req.body.password;
  const fullName = req.body.fullName
    .toLowerCase()
    .replace(/./, (str) => str.toUpperCase());
  const phoneNumber = req.body.phoneNumber;
  const role = req.body.role;

  try {
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPw,
      fullName: fullName,
      phoneNumber: phoneNumber,
      role: role,
    });
    const result = await user.save();
    res
      .status(201)
      .json({ isAuth: true, message: "User created!", userId: result._id });
  } catch (err) {
    next(err);
  }
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(401)
        .json({ email: { msg: "A user with this email could not be found." } });
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      return res
        .status(401)
        .json({ password: { msg: "Password is incorrect!" } });
    }

    req.session.isAuthenticated = true;
    req.session.user = {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      role: user.role,
    };

    return req.session.save((err) => {
      console.log("login err: ", err);
      res.status(200).json({
        isAuth: req.session.isAuthenticated,
        user: req.session.user,
      });
    });
  } catch (err) {
    next(err);
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log("logout err: ", err);
    res.status(204).json({ message: "Logged out!" });
  });
};
