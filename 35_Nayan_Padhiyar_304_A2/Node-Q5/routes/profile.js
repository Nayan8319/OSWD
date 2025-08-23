const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const auth = require('../middlewares/auth');

router.get('/', auth, async (req, res) => {
  const user = await Employee.findById(req.user.id).lean();
  res.json(user);  // front-end will render profile using JS/jQuery
});

module.exports = router;
