const express = require("express");
const path = require("path");
const multer = require("multer");
const { body, validationResult } = require("express-validator");
const fs = require("fs");

const app = express();

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only images allowed"));
    }
  }
});

// Routes
app.get("/", (req, res) => {
  res.render("form", { errors: [], old: {} });
});

app.post(
  "/register",
  upload.fields([{ name: "profilePic", maxCount: 1 }, { name: "otherPics", maxCount: 5 }]),
  [
    body("username").notEmpty().withMessage("Username required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) throw new Error("Passwords do not match");
      return true;
    }),
    body("gender").notEmpty().withMessage("Select gender"),
    body("hobbies").notEmpty().withMessage("Select at least one hobby"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("form", { errors: errors.array(), old: req.body });
    }

    const userData = {
      username: req.body.username,
      email: req.body.email,
      gender: req.body.gender,
      hobbies: Array.isArray(req.body.hobbies) ? req.body.hobbies : [req.body.hobbies],
      profilePic: req.files["profilePic"] ? req.files["profilePic"][0].filename : null,
      otherPics: req.files["otherPics"] ? req.files["otherPics"].map(f => f.filename) : []
    };

    // Save user data as JSON (for download later)
    fs.writeFileSync("public/uploads/userData.json", JSON.stringify(userData, null, 2));

    res.render("success", { user: userData });
  }
);

// File download route
app.get("/download", (req, res) => {
  const filePath = path.join(__dirname, "public/uploads/userData.json");
  res.download(filePath, "userData.json");
});

// Start server
app.listen(3000, () => console.log("Server running at http://localhost:3000"));
