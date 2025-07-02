const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Route for SIGNUP
const Signup = async (req, res) => {
  let { username, email, password, role, location } = req.body;
  email = email.trim().toLowerCase();

  try {

    // Checking for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: 'User already exists' });

    // Gmail check
    if (!email.endsWith('@gmail.com')) {
      return res.status(400).json({ msg: 'Only Gmail addresses are allowed' });
    }

 
    if (role && !['Donor', 'Receiver'].includes(role)) {
      return res.status(400).json({ msg: 'Role must be Donor or Receiver' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || null,
      location: location || ''
    });

    res.status(201).json({ newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


//Route for SIGNIN
const Signin = async (req, res) => {
  let { email, password } = req.body;
  email = email.trim().toLowerCase();

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '2d'
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        location: user.location
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


//Route for UPDATING ROLE OR LOCATION
const UpdateUserDetails = async (req, res) => {
  const { userId } = req.params;
  const { newRole, newLocation } = req.body;

  const updateData = {};

  // Validate and include role if present
  if (newRole) {
    if (!['Donor', 'Receiver'].includes(newRole)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    updateData.role = newRole;
  }

  // Include location if present
  if (newLocation) {
    updateData.location = newLocation;
  }

  try {
    await User.findByIdAndUpdate(userId, updateData);
    res.json({ message: 'User details updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user details' });
  }
};


module.exports = {
  Signup,
  Signin,
  UpdateUserDetails
};
