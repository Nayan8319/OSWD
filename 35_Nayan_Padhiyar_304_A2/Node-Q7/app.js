const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const db = require("./database");

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");

const app = express();

// Middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "secret-key", resave: false, saveUninitialized: true }));

// Routes
app.use("/admin", adminRoutes);
app.use("/", userRoutes);

// Server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
