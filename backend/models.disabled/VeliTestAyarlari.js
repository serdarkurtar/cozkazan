import mongoose from 'mongoose';

const veliTestAyarlariSchema = new mongoose.Schema({
  parentId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  testler: [{
    _id: String,
    testAdi: String,
    sinif: String,
    ders: String,
    konu: String,
    xpPuan: { type: Number, default: 10 }, // Her test için XP puanı
    sorular: [{
      soru: String,
      secenekler: [String],
      cevap: String
    }]
  }],
  guncellemeTarihi: {
    type: Date,
    default: Date.now
  },
  olusturmaTarihi: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index'ler
veliTestAyarlariSchema.index({ parentId: 1 });
veliTestAyarlariSchema.index({ guncellemeTarihi: -1 });

const VeliTestAyarlari = mongoose.model('VeliTestAyarlari', veliTestAyarlariSchema);

export default VeliTestAyarlari; 