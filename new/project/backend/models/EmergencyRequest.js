import mongoose from 'mongoose';

const emergencyRequestSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'completed'], 
    default: 'pending' 
  },
  userId: { type: String, required: true },
  volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' },
  description: String
}, { timestamps: true });

export default mongoose.model('EmergencyRequest', emergencyRequestSchema);