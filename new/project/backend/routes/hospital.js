import express from 'express';
import Hospital from '../models/Hospital.js';

const router = express.Router();

// Get hospitals within radius
router.get('/nearby', async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.query;
    
    const hospitals = await Hospital.find({
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseFloat(radius) * 1000 // Convert km to meters
        }
      }
    });
    
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new hospital (admin only)
router.post('/', async (req, res) => {
  try {
    const hospital = new Hospital(req.body);
    const savedHospital = await hospital.save();
    res.status(201).json(savedHospital);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;