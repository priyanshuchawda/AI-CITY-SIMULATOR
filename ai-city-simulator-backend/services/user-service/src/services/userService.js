import { getAsync, setAsync, client } from '../config/redisClient';
import { User } from '../models/User'; // Assume this is your User model
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createError from 'http-errors'; // To create HTTP errors

const CACHE_TTL = process.env.CACHE_TTL || 3600;

// In-memory user database (for demo purposes, replace with actual database in production)
const users = [
  { id: '1', username: 'john_doe', email: 'john@example.com' },
  { id: '2', username: 'jane_smith', email: 'jane@example.com' }
];

const getUserById = async (id) => {
  const cacheKey = `user:${id}`;

  // Try to get user from cache
  const cachedUser = await getAsync(cacheKey);
  if (cachedUser) {
    return JSON.parse(cachedUser);
  }

  // If not in cache, try to get from in-memory database
  let user = users.find(u => u.id === id);

  // If not found in in-memory database, get from real database
  if (!user) {
    user = await User.findById(id);
  }

  if (user) {
    // Store in cache for future requests
    await setAsync(cacheKey, JSON.stringify(user), 'EX', CACHE_TTL);
  } else {
    throw createError(404, 'User not found');
  }

  return user;
};

const createUser = async (newUser) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: newUser.email });
  if (existingUser) {
    throw createError(400, 'User already exists');
  }

  // Hash password before saving
  newUser.password = await bcrypt.hash(newUser.password, 10);

  // Save to real database
  const user = await User.create(newUser);

  // Cache the new user
  await setAsync(`user:${user._id}`, JSON.stringify(user), 'EX', CACHE_TTL);

  return user;
};

const updateUser = async (id, userData) => {
  // Update in-memory database (for demo purposes)
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...userData };
  }

  // Update in real database
  const user = await User.findByIdAndUpdate(id, userData, { new: true });
  
  if (user) {
    // Update cache
    const cacheKey = `user:${id}`;
    await setAsync(cacheKey, JSON.stringify(user), 'EX', CACHE_TTL);
  } else {
    throw createError(404, 'User not found');
  }

  return user;
};

const deleteUser = async (id) => {
  // Delete from in-memory database (for demo purposes)
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
  }

  // Delete from real database
  const result = await User.findByIdAndDelete(id);
  
  if (result) {
    // Remove from cache
    const cacheKey = `user:${id}`;
    await client.del(cacheKey);
  } else {
    throw createError(404, 'User not found');
  }

  return { message: 'User deleted successfully' };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(401, 'Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createError(401, 'Invalid credentials');
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  return { token, user: { id: user._id, email: user.email, username: user.username } };
};

const closeRedisConnection = async () => {
  await client.quit();
};

export {
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  closeRedisConnection
};
