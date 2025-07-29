import mongoose from 'mongoose';

const AiStatsSchema = new mongoose.Schema({
  kullaniciId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  konuId: { type: mongoose.Schema.Types.ObjectId, ref: 'Konu', required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  soruId: { type: mongoose.Schema.Types.ObjectId, ref: 'Soru', required: true },
  cozulmeSayisi: { type: Number, default: 0 },
  basariliCozulmeSayisi: { type: Number, default: 0 },
  ortalamaSure: { type: Number, default: 0 }, // saniye cinsinden
  zorlukSkoru: { type: Number, default: 50, min: 0, max: 100 }, // 0-100 arası
  basariOrani: { type: Number, default: 0, min: 0, max: 100 }, // yüzde
  sonCozulmeTarihi: { type: Date, default: Date.now },
  enKolayCozulen: { type: Boolean, default: false },
  enZorCozulen: { type: Boolean, default: false },
  ogrenmeDurumu: { type: String, enum: ['yeni', 'ogreniliyor', 'ogrenildi', 'ustalik'], default: 'yeni' }
}, { timestamps: true });

export default mongoose.model('AiStats', AiStatsSchema); 