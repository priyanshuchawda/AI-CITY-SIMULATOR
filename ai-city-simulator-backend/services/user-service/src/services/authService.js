import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Web3 from 'web3';

// Environment variables (ensure these are defined in your .env file)
const { JWT_SECRET, WEB3_PROVIDER } = process.env;

// Initialize Web3
const web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER));

// JWT Token Generation
const generateToken = (userId) => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
};

// JWT Token Verification
const verifyToken = (token) => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
};

// Password Hashing
const hashPassword = async (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

// Password Verification
const verifyPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

// Blockchain Transaction Example
const sendTransaction = async (fromAddress, toAddress, amount, privateKey) => {
  try {
    const transaction = {
      from: fromAddress,
      to: toAddress,
      value: web3.utils.toWei(amount, 'ether'),
      gas: 21000,
    };

    const signedTransaction = await web3.eth.accounts.signTransaction(transaction, privateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
    
    return receipt;
  } catch (error) {
    console.error('Blockchain transaction error:', error);
    throw error;
  }
};

export { generateToken, verifyToken, hashPassword, verifyPassword, sendTransaction };
