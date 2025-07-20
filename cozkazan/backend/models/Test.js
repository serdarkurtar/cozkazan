import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
  testAdi: { type: String, required: false },
  aciklama: { type: String, required: true },
  sinif: { type: mongoose.Schema.Types.ObjectId, ref: 'Sinif', required: true },
  ders: { type: mongoose.Schema.Types.ObjectId, ref: 'Ders', required: true },
  konu: { type: mongoose.Schema.Types.ObjectId, ref: 'Konu', required: true },
  konuAdi: { type: String },
  sorular: [{
    soru: { type: String, required: true },
    secenekler: [{ type: String, required: true }], // A, B, C, D şıkları
    dogruCevap: { type: Number, required: true }, // 0, 1, 2, 3 (A=0, B=1, C=2, D=3)
    aciklama: { type: String }
  }],
  puan: { type: Number, default: 10 }, // Sabit 10 XP
  aktif: { type: Boolean, default: true },
  olusturmaTarihi: { type: Date, default: Date.now }
}, { timestamps: true });

const Test = mongoose.model('Test', testSchema);

export default Test; 