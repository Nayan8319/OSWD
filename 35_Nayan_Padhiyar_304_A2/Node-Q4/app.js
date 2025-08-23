require('dotenv').config();

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const Employee = require('./models/Employee');
const Counter = require('./models/Counter');

const app = express();

// ----- DB -----
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('Mongo error:', err);
});

// ----- View / static -----
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-mate')); // for layout() helper
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// ----- Core middleware -----
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// ----- Session (Mongo store) -----
app.use(session({
  secret: 'super-secret-session-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));

// Put user in locals for layout
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// ----- Auth helpers -----
const requireAdmin = (req, res, next) => {
  if (req.session && req.session.user === process.env.ADMIN_USER) return next();
  return res.redirect('/login');
};

// ----- Nodemailer transporter -----
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE || 'false') === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// ----- Utils -----
async function getNextEmpId() {
  const doc = await Counter.findByIdAndUpdate(
    { _id: 'empid' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const n = doc.seq;
  // e.g., EMP0001, EMP0002
  return 'EMP' + String(n).padStart(4, '0');
}

function generateTempPassword(length = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

app.get('/', (req, res) => res.redirect('/employees'));

// Login
app.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/employees');
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const u = process.env.ADMIN_USER;
  const p = process.env.ADMIN_PASS;
  if (username === u && password === p) {
    req.session.user = u;
    return res.redirect('/employees');
  }
  return res.status(401).render('login', { error: 'Invalid credentials' });
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

// Employees: Index
app.get('/employees', requireAdmin, async (req, res) => {
   const employees = await Employee.find({}).lean({ virtuals: true });
  res.render('employees/index', { employees });
});

// Employees: New
app.get('/employees/new', requireAdmin, (req, res) => {
  res.render('employees/new');
});

// Employees: Create (generate empId + password; hash; email)
app.post('/employees', requireAdmin, async (req, res, next) => {
  try {
    const empId = await getNextEmpId();
    const tempPassword = generateTempPassword();

    const {
      name, email, department, role,
      basic = 0, hra = 0, da = 0, allowance = 0, deductions = 0
    } = req.body;

    const passwordHash = await bcrypt.hash(tempPassword, 12);

    const employee = await Employee.create({
      empId, name, email, department, role,
      basic: Number(basic), hra: Number(hra), da: Number(da), allowance: Number(allowance), deductions: Number(deductions),
      passwordHash
    });

    // Send welcome email with credentials
    const mail = {
      from: process.env.MAIL_FROM,
      to: employee.email,
      subject: `Welcome to the company – Your Employee ID ${employee.empId}`,
      text:
`Hi ${employee.name},

Your employee account has been created.

Employee ID: ${employee.empId}
Temporary Password: ${tempPassword}

Please log in to the ERP portal and change your password immediately.

Regards,
HR`,
    };

    transporter.sendMail(mail).catch(err => {
      console.error('Email send error:', err.message);
    });

    res.redirect('/employees');
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).send('Duplicate email or empId.');
    }
    next(err);
  }
});

// Employees: Show
app.get('/employees/:id', requireAdmin, async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id).lean({ virtuals: true });
    if (!employee) return res.status(404).send('Not found');
    res.render('employees/show', { employee });
  } catch (e) { next(e); }
});

// Employees: Edit
app.get('/employees/:id/edit', requireAdmin, async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).send('Not found');
    res.render('employees/edit', { employee });
  } catch (e) { next(e); }
});

// Employees: Update (no password change here)
app.put('/employees/:id', requireAdmin, async (req, res, next) => {
  try {
    const { name, email, department, role, basic, hra, da, allowance, deductions } = req.body;
    await Employee.findByIdAndUpdate(req.params.id, {
      name, email, department, role,
      basic: Number(basic), hra: Number(hra), da: Number(da), allowance: Number(allowance), deductions: Number(deductions)
    }, { runValidators: true });
    res.redirect('/employees/' + req.params.id);
  } catch (e) { next(e); }
});

// Employees: Delete
app.delete('/employees/:id', requireAdmin, async (req, res, next) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.redirect('/employees');
  } catch (e) { next(e); }
});

// Generic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Server error');
});

// Start
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`ERP Admin running at http://localhost:${port}`));
