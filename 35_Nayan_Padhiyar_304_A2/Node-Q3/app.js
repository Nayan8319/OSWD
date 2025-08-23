const express = require("express");
const session = require("express-session");
// const RedisStore = require("connect-redis").default;
const RedisStore = require("connect-redis")(session);
const Redis = require("ioredis");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


const redisClient = new Redis({
  host: "127.0.0.1",
  port: 6379
});


app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 5 }
  })
);

// Fake user (demo)
const USER = { username: "admin", password: "12345" };

// Routes
app.get("/", (req, res) => {
  if (req.session.user) return res.redirect("/dashboard");
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

// Auth middleware
function authMiddleware(req, res, next) {
  if (req.session.user) next();
  else res.redirect("/");
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
app.listen(3000, () =>
  console.log(" Server running at http://localhost:3000")
);
