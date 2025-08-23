const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// User home
router.get("/", userController.home);
router.get("/product/:id", userController.productDetails);
router.post("/cart/add/:id", userController.addToCart);
router.get("/cart", userController.cart);

module.exports = router;
