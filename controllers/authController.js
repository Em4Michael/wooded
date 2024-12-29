const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signup = async (req, res) => {
  const { name, email, password, phoneNumber, role, serviceInterests } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
      serviceInterests: serviceInterests || [],
    });

    await user.save();

    res.status(201).json({ message: 'Registration successful, proceed to the next step' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      role: user.role,
      userId: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateUserRole = async (req, res) => {
  const { userId, role } = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Role updated successfully', user });
  } catch (err) {
    console.error('Error updating role:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const addPropertyListing = async (req, res) => {
  const { userId, location, propertyType, listingPurpose } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const propertyListing = {
      location,
      propertyType,
      listingPurpose,
    };

    if (!user.propertyListings) user.propertyListings = [];

    user.propertyListings.push(propertyListing);
    await user.save();

    res.status(201).json({ message: 'Property listing added successfully', user });
  } catch (err) {
    console.error('Error adding property listing:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { signup, login, updateUserRole, addPropertyListing };
