import mongoose from 'mongoose';

const konuSchema = new mongoose.Schema({
  ad: { type: String, required: true },
  sira: { type: Number, default: 0 },
  ders: { type: mongoose.Schema.Types.ObjectId, ref: 'Ders', required: true },
  sinif: { type: mongoose.Schema.Types.ObjectId, ref: 'Sinif', required: true },
  dersAdi: { type: String, required: true }, // Ders adı için ek alan
  sinifAdi: { type: String, required: true }, // Sınıf adı için ek alan
  aktif: { type: Boolean, default: true },
  varsayilanHavuzId: { type: mongoose.Schema.Types.ObjectId, ref: 'TestHavuzu' },
  havuzSayisi: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Konu', konuSchema); 