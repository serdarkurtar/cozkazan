import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
  testAdi: { type: String, required: true }, // required: true yapıldı
  ad: { type: String, required: true }, // AdminJS uyumluluğu için eklendi
  aciklama: { type: String, required: true },
  sinif: { type: String, required: true },
  ders: { type: String, required: true },
  konu: { type: String, required: true },
  sinifAdi: { type: String }, // Sınıf adı için ek alan (zorunlu değil)
  dersAdi: { type: String }, // Ders adı için ek alan (zorunlu değil)
  konuAdi: { type: String, required: true }, // required: true yapıldı
  havuzId: { type: mongoose.Schema.Types.ObjectId, ref: 'TestHavuzu' },
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