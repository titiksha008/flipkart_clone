import User from '../models/User.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

const DEFAULT_USER_ID = 1;

const getDefaultUser = async () => {
  const user = await User.findByPk(DEFAULT_USER_ID, {
    attributes: ['id', 'name', 'email', 'phone'],
  });

  if (!user) {
    throw new AppError(
      'Default user not found. Please run your seed file so user id 1 exists.',
      500
    );
  }

  return user;
};

export const signup = asyncHandler(async (req, res) => {
  const user = await getDefaultUser();

  res.status(200).json({
    success: true,
    message: 'Signup is disabled in no-login mode. Using default user.',
    data: user,
  });
});

export const login = asyncHandler(async (req, res) => {
  const user = await getDefaultUser();

  res.status(200).json({
    success: true,
    message: 'Login is disabled in no-login mode. Using default user.',
    data: user,
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  res.json({
    success: true,
    message: 'Logged out',
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = req.user || (await getDefaultUser());

  res.json({
    success: true,
    data: user,
  });
});

export const updateMe = asyncHandler(async (req, res) => {
  const user = req.user || (await getDefaultUser());
  const { name, phone } = req.body;

  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;

  await user.save();

  res.json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });
});