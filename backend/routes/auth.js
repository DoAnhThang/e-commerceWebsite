const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login-status", authController.getLoginStatus);

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "Email exists already, please pick a different one."
            );
          }
        });
      }),
    body(
      "password",
      "Password only consist of text or number and at least 8 characters"
    )
      .trim()
      .isAlphanumeric()
      .isLength({ min: 8 }),
    body("fullName", "Full name must consist of at least 3 characters")
      .not()
      .isEmpty()
      .trim()
      .isLength({ min: 3 }),
    body("phoneNumber", "Phone number must consist of at least 10 characters")
      .not()
      .isEmpty()
      .trim()
      .isLength({ min: 10 }),
    body("role", "Please select a role").not().isEmpty(),
  ],
  authController.putSignup
);

router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

module.exports = router;
