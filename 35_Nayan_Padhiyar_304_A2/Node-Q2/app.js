const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Middleware
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

// Session setup (file store)
app.use(
  session({
    store: new FileStore({}),
    secret: "supersecretkey", // change for production
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 } // 1 min
  })
);

// Fake user for demo
const USER = { username: "user", password: "user" };

// Routes
app.get("/", (req, res) => {
  if (req.session.user) {
    return res.redirect("/dashboard");
  }
  res.render("login", { error: null });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    req.session.user = username;
    return res.redirect("/dashboard");
  }
  res.render("login", { error: "Invalid username or password" });
});

// Protected route middleware
function authMiddleware(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/");
  }
}

app.get("/dashboard", authMiddleware, (req, res) => {
  res.render("dashboard", { user: req.session.user });
});

app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.send("Error logging out");
    res.redirect("/");
  });
});

// Start server
app.listen(3000, () => console.log("Server running at http://localhost:3000"));
