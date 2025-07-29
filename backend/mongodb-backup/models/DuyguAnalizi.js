import mongoose from 'mongoose';

const DuyguAnaliziSchema = new mongoose.Schema({
  kullaniciId: { type: String, required: true },
  kullaniciTipi: { type: String, enum: ['child', 'parent'], required: true },
  mesaj: { type: String, required: true },
  duyguSkoru: { type: Number, required: true }, // -1 ile 1 arası
  duyguKategori: { 
    type: String, 
    enum: ['çok_negatif', 'negatif', 'nötr', 'pozitif', 'çok_pozitif'], 
    required: true 
  },
  anaDuygular: [{ type: String }], // ['mutlu', 'üzgün', 'kızgın', 'endişeli', 'heyecanlı']
  tonAnalizi: {
    resmiyet: { type: Number, min: 0, max: 1 }, // 0: samimi, 1: resmi
    enerji: { type: Number, min: 0, max: 1 }, // 0: düşük, 1: yüksek
    aciliyet: { type: Number, min: 0, max: 1 }, // 0: normal, 1: acil
  },
  dil: { type: String, default: 'tr' },
  tarih: { type: Date, default: Date.now },
  yanitToni: { type: String, enum: ['destekleyici', 'motivasyonel', 'eğitici', 'samimi', 'profesyonel'] },
  yanitAyarlandi: { type: Boolean, default: false }
}, { timestamps: true });

// Duygu skoruna göre kategori belirleme
DuyguAnaliziSchema.pre('save', function(next) {
  if (this.duyguSkoru <= -0.6) {
    this.duyguKategori = 'çok_negatif';
  } else if (this.duyguSkoru <= -0.2) {
    this.duyguKategori = 'negatif';
  } else if (this.duyguSkoru <= 0.2) {
    this.duyguKategori = 'nötr';
  } else if (this.duyguSkoru <= 0.6) {
    this.duyguKategori = 'pozitif';
  } else {
    this.duyguKategori = 'çok_pozitif';
  }
  next();
});

export default mongoose.model('DuyguAnalizi', DuyguAnaliziSchema); 