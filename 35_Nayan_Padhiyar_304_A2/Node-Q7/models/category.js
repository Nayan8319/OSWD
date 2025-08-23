const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null } // for 2-level categories
});

module.exports = mongoose.model("Category", categorySchema);
