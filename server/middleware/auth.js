import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from './errorHandler.js';

const DEFAULT_USER_ID = 1;

export const protect = async (req, res, next) => {
  try {
    let user = null;
    const token = req.cookies?.token;

    if (token && process.env.JWT_SECRET) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        user = await User.findByPk(decoded.id, {
          attributes: ['id', 'name', 'email', 'phone'],
        });
      } catch (err) {
        user = null;
      }
    }

    if (!user) {
      user = await User.findByPk(DEFAULT_USER_ID, {
        attributes: ['id', 'name', 'email', 'phone'],
      });
    }

    if (!user) {
      throw new AppError(
        'Default user not found. Please run your seed file so user id 1 exists.',
        500
      );
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};