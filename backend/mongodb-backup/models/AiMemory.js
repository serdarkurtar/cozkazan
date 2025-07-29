import mongoose from 'mongoose';

const AiMemorySchema = new mongoose.Schema({
  kullaniciId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  konuId: { type: mongoose.Schema.Types.ObjectId, ref: 'Konu', required: true },
  ogrenmeSeviyesi: { type: Number, default: 0, min: 0, max: 100 }, // 0-100 arası
  cozulenTestSayisi: { type: Number, default: 0 },
  basariliTestSayisi: { type: Number, default: 0 },
  toplamSure: { type: Number, default: 0 }, // dakika cinsinden
  sonCalismaTarihi: { type: Date, default: Date.now },
  zorlukSeviyesi: { type: String, enum: ['kolay', 'orta', 'zor'], default: 'orta' },
  ogrenmeHizi: { type: Number, default: 1.0 }, // öğrenme hızı çarpanı
  unutmaHizi: { type: Number, default: 0.1 }, // unutma hızı (günlük)
  sonGuncelleme: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('AiMemory', AiMemorySchema); 