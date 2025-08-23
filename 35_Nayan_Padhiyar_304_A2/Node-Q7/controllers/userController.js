const Product = require("../models/product");
const User = require("../models/user");

// Home page
exports.home = async (req, res) => {
  const products = await Product.find().populate("category");
  res.render("user/index", { products });
};

// Product details
exports.productDetails = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");
  res.render("user/productDetails", { product });
};

// Add to cart
exports.addToCart = async (req, res) => {
  const productId = req.params.id;

  let user = await User.findOne(); // Replace with real logged-in user
  if (!user) {
    user = new User({ name: "Guest", email: "guest@example.com", cart: [] });
  }

  const itemIndex = user.cart.findIndex(item => item.product == productId);
  if (itemIndex > -1) {
    user.cart[itemIndex].quantity += 1;
  } else {
    user.cart.push({ product: productId, quantity: 1 });
  }

  await user.save();
  res.redirect("/cart");
};

// Show cart
exports.cart = async (req, res) => {
  let user = await User.findOne().populate("cart.product");
  if (!user) user = { cart: [] };
  res.render("user/cart", { cart: user.cart });
};
