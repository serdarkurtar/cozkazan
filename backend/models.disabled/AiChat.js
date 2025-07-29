import mongoose from 'mongoose';

const AiChatSchema = new mongoose.Schema({
  kullaniciId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  konuId: { type: mongoose.Schema.Types.ObjectId, ref: 'Konu', required: true },
  soru: { type: String, required: true },
  cevap: { type: String, required: true },
  tarih: { type: Date, default: Date.now },
  basarili: { type: Boolean, default: true },
  zorlukSeviyesi: { type: String, enum: ['kolay', 'orta', 'zor'], default: 'orta' }
}, { timestamps: true });

export default mongoose.model('AiChat', AiChatSchema); 