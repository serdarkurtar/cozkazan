import mongoose from 'mongoose';

const dersSchema = new mongoose.Schema({
  ad: { type: String, required: true },
  sinif: { type: mongoose.Schema.Types.ObjectId, ref: 'Sinif', required: true },
  aktif: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Ders', dersSchema); 