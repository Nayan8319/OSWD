const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Admin dashboard
router.get("/", adminController.dashboard);

// Categories
router.get("/categories", adminController.categories);
router.get("/categories/add", adminController.addCategoryForm);
router.post("/categories/add", adminController.addCategory);

// Products
router.get("/products", adminController.products);
router.get("/products/add", adminController.addProductForm);
router.post("/products/add", adminController.addProduct);

module.exports = router;
