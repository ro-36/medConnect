import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['available', 'busy'], 
    default: 'available' 
  },
  assignedCases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EmergencyRequest' }]
}, { timestamps: true });

export default mongoose.model('Volunteer', volunteerSchema);