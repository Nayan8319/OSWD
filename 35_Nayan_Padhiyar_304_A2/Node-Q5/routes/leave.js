const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');
const auth = require('../middlewares/auth');

router.get('/', auth, async (req, res) => {
  const leaves = await Leave.find({ employee: req.user.id }).sort({ date: -1 }).lean();
  res.json(leaves);
});

router.post('/', auth, async (req, res) => {
  const { date, reason } = req.body;
  const leave = new Leave({ employee: req.user.id, date, reason });
  await leave.save();
  res.json({ message: 'Leave applied', leave });
});

module.exports = router;
