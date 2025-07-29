import mongoose from 'mongoose';

const AiFeedbackSchema = new mongoose.Schema({
  kullaniciId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  soruId: { type: mongoose.Schema.Types.ObjectId, ref: 'Soru', required: true },
  dogruCevap: { type: Boolean, required: true },
  harcananSure: { type: Number, default: 0 }, // saniye cinsinden
  denemeSayisi: { type: Number, default: 1 },
  zorlukSeviyesi: { type: String, enum: ['kolay', 'orta', 'zor'], default: 'orta' },
  ogrenmeDurumu: { type: String, enum: ['yeni', 'ogreniliyor', 'ogrenildi', 'ustalik'], default: 'yeni' },
  tarih: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('AiFeedback', AiFeedbackSchema); 