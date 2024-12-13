import express from 'express';
import Volunteer from '../models/Volunteer.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import auth from '../middleware/auth.js';

const router = express.Router();

// Volunteer registration (admin only)
router.post('/register', auth, async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const volunteer = new Volunteer({
      name,
      email,
      password: hashedPassword,
      phone
    });
    
    await volunteer.save();
    res.status(201).json({ message: 'Volunteer registered successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Volunteer login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const volunteer = await Volunteer.findOne({ email });
    
    if (!volunteer) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isValidPassword = await bcrypt.compare(password, volunteer.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: volunteer._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;