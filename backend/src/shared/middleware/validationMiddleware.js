import { isValidObjectId } from 'mongoose';

// Regular expression for basic email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ message: 'Name is required and must be at least 2 characters.' });
  }

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: 'A valid email address is required.' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ message: 'Password is required and must be at least 6 characters.' });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: 'A valid email address is required.' });
  }

  if (!password) {
    return res.status(400).json({ message: 'Password is required.' });
  }

  next();
};

export const validateProduct = (req, res, next) => {
  const { name, price, description, category, countInStock } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ message: 'Product name is required.' });
  }

  const numericPrice = Number(price);
  if (isNaN(numericPrice) || numericPrice < 0) {
    return res.status(400).json({ message: 'Price must be a valid non-negative number.' });
  }

  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    return res.status(400).json({ message: 'Product description is required.' });
  }

  if (!category || (typeof category !== 'string' && !isValidObjectId(category))) {
    return res.status(400).json({ message: 'Product category is required.' });
  }

  const stock = Number(countInStock);
  if (isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
    return res.status(400).json({ message: 'Stock must be a valid non-negative integer.' });
  }

  next();
};
