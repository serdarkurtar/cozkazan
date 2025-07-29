import mongoose from 'mongoose';

const sinifSchema = new mongoose.Schema({
  ad: { type: String, required: true, unique: true },
  aktif: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Sinif', sinifSchema); 