import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bodogol_secret_key_2024');
    req.user = await User.findById(decoded.id);
    if (!req.user || !req.user.isActive) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Token invalid or expired' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ success: false, error: 'Admin access required' });
};
