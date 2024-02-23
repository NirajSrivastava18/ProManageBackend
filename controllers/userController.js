const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  try {
    const { Name, email, Password } = req.body;
    if (!Name) {
      res.status(400).json({
        status: 'Failed',
        message: 'Name is required',
      });
    }
    if (!email) {
      res.status(400).json({
        status: 'Failed',
        message: 'Email is required',
      });
    }
    if (!Password) {
      res.status(400).json({
        status: 'Failed',
        message: 'Password is required',
      });
    }
    const encryption = await bcrypt.hash(Password, 10);
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const user = await User.create({
        Name,
        email,
        Password: encryption,
      });
      const jwttoken = jwt.sign(user.toJSON(), process.env.JWT, {
        expiresIn: 60 * 30,
      });

      res.status(201).json({
        status: 'success',
        message: 'User created successfully',
        jwttoken: jwttoken,
        Name: user.Name,
      });
    } else {
      res.status(409).json({
        status: 'Failed',
        message: 'User already exists',
      });
    }
  } catch (error) {
    res.status(404).json({
      status: 'Failed',
      message: 'something went wrong',
    });
    console.log(error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, Password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      let PasswordMatch = await bcrypt.compare(Password, user.Password);
      if (PasswordMatch) {
        const jwttoken = jwt.sign(user.toJSON(), process.env.JWT, {
          expiresIn: 60 * 30,
        });
        res.json({
          status: 'Success',
          message: 'User LoggedIn Successfully',
          jwttoken: jwttoken,
          Name: user.Name,
        });
      } else {
        res.json({
          status: 'Failed',
          message: 'Incorrect Password',
        });
      }
    } else {
      res.status(404).json({
        status: 'Failed',
        message: 'User Not Found',
      });
    }
  } catch (error) {
    res.json({
      status: 'Failed',
      message: 'Something went wrong!',
      error: error.message,
    });
  }
};
const UpdatePassword = async (req, res) => {
  const { Name, oldPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({ Name });
    const isMatch = await bcrypt.compare(oldPassword, user.Password);

    if (isMatch) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.findOneAndUpdate(
        { Name },
        { Password: hashedPassword },
        { new: true }
      );

      res.status(200).json({ message: 'Password updated successfully' });
    } else {
      res.status(400).json({ message: 'Old password is incorrect' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const logout = (req, res) => {
  res
    .status(200)
    .json({ status: 'Success', message: 'Logged out successfully' });
};

module.exports = { register, login, logout, UpdatePassword };
