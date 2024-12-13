import express from 'express';
import EmergencyRequest from '../models/EmergencyRequest.js';
import Volunteer from '../models/Volunteer.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create emergency request
router.post('/', async (req, res) => {
  try {
    const emergency = new EmergencyRequest(req.body);
    const savedEmergency = await emergency.save();
    res.status(201).json(savedEmergency);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Accept emergency request (volunteers only)
router.patch('/:id/accept', auth, async (req, res) => {
  try {
    const emergency = await EmergencyRequest.findById(req.params.id);
    if (!emergency) {
      return res.status(404).json({ message: 'Emergency request not found' });
    }
    
    if (emergency.status !== 'pending') {
      return res.status(400).json({ message: 'Emergency request already accepted' });
    }
    
    emergency.status = 'accepted';
    emergency.volunteerId = req.volunteer.id;
    await emergency.save();
    
    await Volunteer.findByIdAndUpdate(req.volunteer.id, {
      $push: { assignedCases: emergency._id },
      status: 'busy'
    });
    
    res.json(emergency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;