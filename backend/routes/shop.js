const express = require("express");
const { body } = require("express-validator");

const isAuth = require("../middleware/is-auth");
const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/products", shopController.getProducts);

router.get("/detail/:productId", shopController.getProduct);

router.get("/cart", isAuth, shopController.getCart);

router.post("/cart", isAuth, shopController.postCart);

router.put("/cart/:productId", isAuth, shopController.removeFromCart);

router.delete("/cart/:productId", isAuth, shopController.deleteFromCart);

router.post(
  "/order",
  isAuth,
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),
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
    body("address", "Please provide the correct and complete address")
      .not()
      .isEmpty()
      .trim()
      .isLength({ min: 6 }),
  ],
  shopController.postOrder
);

router.get("/orders", isAuth, shopController.getOrders);

router.get("/messages/:roomId", shopController.getMessages);

router.put("/message", shopController.putMessage);

router.delete("/messages/:roomId", shopController.deleteChatSession);

module.exports = router;
