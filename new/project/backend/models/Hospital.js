import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  specialties: [{ type: String }],
  operatingHours: {
    open: { type: String, required: true },
    close: { type: String, required: true }
  },
  emergencyServices: [{ type: String }]
}, { timestamps: true });

// Index for geospatial queries
hospitalSchema.index({ coordinates: '2dsphere' });

export default mongoose.model('Hospital', hospitalSchema);