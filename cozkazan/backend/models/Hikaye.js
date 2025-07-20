import mongoose from 'mongoose';

const HikayeSchema = new mongoose.Schema({
  baslik: { type: String, required: true },
  icerik: { type: String, required: true },
  yazar: { type: String, default: 'Sistem' },
  sinif: { type: String, required: true },
  ders: { type: String, required: true },
  konu: { type: String, required: true },
  altKonu: { type: String },
  zorlukSeviyesi: { 
    type: String, 
    enum: ['kolay', 'orta', 'zor'], 
    default: 'orta' 
  },
  sure: { type: Number, default: 5 }, // dakika cinsinden
  puan: { type: Number, default: 10 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// İndeksler
HikayeSchema.index({ sinif: 1, ders: 1, konu: 1 });
HikayeSchema.index({ isActive: 1 });
HikayeSchema.index({ createdAt: -1 });

export default mongoose.model('Hikaye', HikayeSchema); 