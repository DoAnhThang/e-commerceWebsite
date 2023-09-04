const express = require("express");
const { body } = require("express-validator");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const isAdmin = require("../middleware/is-admin");
const isClient = require("../middleware/is-client");

const router = express.Router();

router.get("/dashboard", isAuth, isAdmin, adminController.getDashboard);

router.get("/products", isAuth, isAdmin, adminController.getProducts);

router.get("/search", isAuth, isAdmin, adminController.getSearchedProducts);

router.post(
  "/product",
  isAuth,
  isAdmin,
  [
    body("name", "Name must consist of at least 5 characters")
      .trim()
      .isLength({ min: 5 }),
    body("category", "Category must consist of at least 3 characters")
      .trim()
      .isLength({ min: 3 }),
    body("price", "Price must be a positive number")
      .isNumeric()
      .isInt({ min: 0 }),
    body("remain", "Available Quantity must be a positive number")
      .isNumeric()
      .isInt({ min: 0 }),
    body(
      "short_desc",
      "Short Description must consist of at least 5 characters"
    )
      .trim()
      .isLength({ min: 5 }),
    body("long_desc", "Long Description must consist of at least 5 characters")
      .trim()
      .isLength({ min: 5 }),
  ],
  adminController.postAddProduct
);

router.get(
  "/product/:productId",
  isAuth,
  isAdmin,
  adminController.getEditProduct
);

router.put(
  "/product/:productId",
  isAuth,
  isAdmin,
  [
    body("name", "Name must consist of at least 5 characters")
      .trim()
      .isLength({ min: 5 }),
    body("category", "Category must consist of at least 3 characters")
      .trim()
      .isLength({ min: 3 }),
    body("price", "Price must be a positive number")
      .isNumeric()
      .isInt({ min: 0 }),
    body("remain", "Available Quantity must be a positive number")
      .isNumeric()
      .isInt({ min: 0 }),
    body(
      "short_desc",
      "Short Description must consist of at least 5 characters"
    )
      .trim()
      .isLength({ min: 5 }),
    body("long_desc", "Long Description must consist of at least 5 characters")
      .trim()
      .isLength({ min: 5 }),
  ],
  adminController.putEditProduct
);

router.delete(
  "/product/:productId",
  isAuth,
  isAdmin,
  adminController.deleteProduct
);

router.get("/rooms", isAuth, isClient, adminController.getRooms);

router.get("/messages/:roomId", isAuth, isClient, adminController.getMessages);

router.put("/message", isAuth, isClient, adminController.putMessage);

module.exports = router;
