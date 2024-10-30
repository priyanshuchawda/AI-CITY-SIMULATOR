import express from 'express';
import asyncHandler from 'express-async-handler';
import Joi from 'joi';
import validate from '../middleware/validationMiddleware';
import sanitizeBody from '../middleware/sanitizationMiddleware';
import { createUser, updateUser, deleteUser } from '../services/userService';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import authMiddleware from '../middleware/authMiddleware';
import userController from '../controllers/userController';

const router = express.Router();

const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
});

// Route for getting a user by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const user = await userController.getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
}));

// Route for creating a new user
router.post('/', validate(userSchema), sanitizeBody, asyncHandler(async (req, res) => {
  const newUser = await createUser(req.body);
  res.status(201).json(newUser);
}));

// Route for updating a user by ID
router.put('/:id', validate(userSchema), sanitizeBody, asyncHandler(async (req, res) => {
  const updatedUser = await updateUser(req.params.id, req.body);
  res.json(updatedUser);
}));

// Route for deleting a user by ID
router.delete('/:id', asyncHandler(async (req, res) => {
  const result = await deleteUser(req.params.id);
  res.json(result);
}));

// Route for user login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
}));

// Protected route example
router.get('/profile', authMiddleware, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
}));

export default router;
