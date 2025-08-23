// models/Employee.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const EmployeeSchema = new mongoose.Schema(
  {
    empId: { type: String, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    department: { type: String },
    role: { type: String, default: 'Employee' },

    // Salary components
    basic: { type: Number, default: 0 },
    hra: { type: Number, default: 0 },
    da: { type: Number, default: 0 },
    allowance: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },

    // Auth
    passwordHash: { type: String, required: true }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },  // Include virtuals in JSON
    toObject: { virtuals: true } // Include virtuals in toObject
  }
);

// Virtual calculated salary
EmployeeSchema.virtual('netSalary').get(function () {
  const gross = (this.basic || 0) + (this.hra || 0) + (this.da || 0) + (this.allowance || 0);
  return Math.max(0, gross - (this.deductions || 0));
});

// Pre-save hook to hash password if modified
EmployeeSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method to verify password
EmployeeSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

module.exports = mongoose.model('Employee', EmployeeSchema);
