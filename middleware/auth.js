const { userModel } = require('../models/userModel');
const jwt = require('jsonwebtoken');

const isLoggedIn = async (req, res, next) => {
  // const token = req.header('Authorization')?.replace('Bearer', '');

  // try {
  //   const decodedToken = jwt.verify(token, process.env.JWT);
  //   const user = await User.findById(decodedToken?._id);

  //   req.user = user;
  //   next();

  const token =
    req.cookies?.accessToken ||
    req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new Error(401, 'Unauthorized request');
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT);
    const user = await userModel
      .findById(decodedToken?._id)
      .select('-password -refreshToken');
    if (!user) {
      res.json('Invalid access token');
    }
    req.user = user;
    next();
  } catch (error) {
    throw new Error(401, error.message || 'Invalid access token');
  }
};

module.exports = { isLoggedIn };
