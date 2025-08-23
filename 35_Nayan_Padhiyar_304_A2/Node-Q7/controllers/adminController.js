const Category = require("../models/category");
const Product = require("../models/product");

// Dashboard
exports.dashboard = (req, res) => {
  res.render("admin/dashboard");
};

// Categories
exports.categories = async (req, res) => {
  const categories = await Category.find().populate("parent");
  res.render("admin/categories", { categories });
};

exports.addCategoryForm = async (req, res) => {
  const categories = await Category.find({ parent: null });
  res.render("admin/addCategory", { categories });
};

exports.addCategory = async (req, res) => {
  const { name, parent } = req.body;
  const category = new Category({ name, parent: parent || null });
  await category.save();
  res.redirect("/admin/categories");
};

// Products
exports.products = async (req, res) => {
  const products = await Product.find().populate("category");
  res.render("admin/products", { products });
};

exports.addProductForm = async (req, res) => {
  const categories = await Category.find();
  res.render("admin/addProduct", { categories });
};

exports.addProduct = async (req, res) => {
  const { name, description, price, category } = req.body;
  const product = new Product({ name, description, price, category });
  await product.save();
  res.redirect("/admin/products");
};
