import mongoose from 'mongoose';

const istatistikSchema = new mongoose.Schema({
  sinifId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sinif',
    required: true
  },
  dersId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ders'
  },
  konuId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Konu'
  },
  tarih: {
    type: Date,
    required: true,
    default: Date.now
  },
  // Test çözme istatistikleri
  cozulenTestSayisi: {
    type: Number,
    default: 0
  },
  basariliTestSayisi: {
    type: Number,
    default: 0
  },
  basarisizTestSayisi: {
    type: Number,
    default: 0
  },
  // Soru istatistikleri
  cozulenSoruSayisi: {
    type: Number,
    default: 0
  },
  dogruCevapSayisi: {
    type: Number,
    default: 0
  },
  yanlisCevapSayisi: {
    type: Number,
    default: 0
  },
  // Zaman istatistikleri
  toplamSure: {
    type: Number, // saniye cinsinden
    default: 0
  },
  ortalamaSure: {
    type: Number, // saniye cinsinden
    default: 0
  },
  // Başarı oranları
  testBasariOrani: {
    type: Number, // 0-100 arası
    default: 0
  },
  soruBasariOrani: {
    type: Number, // 0-100 arası
    default: 0
  },
  // XP ve ödüller
  kazanilanXP: {
    type: Number,
    default: 0
  },
  // Detaylı veriler
  testDetaylari: [{
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test'
    },
    basarili: Boolean,
    sure: Number,
    dogruCevapSayisi: Number,
    toplamSoruSayisi: Number,
    kazanilanXP: Number,
    cozulmeTarihi: {
      type: Date,
      default: Date.now
    }
  }],
  // Günlük/haftalık/aylık gruplama için
  periyot: {
    type: String,
    enum: ['gunluk', 'haftalik', 'aylik'],
    default: 'gunluk'
  }
}, {
  timestamps: true
});

// Tarih bazlı indeks
istatistikSchema.index({ sinifId: 1, tarih: 1 });
istatistikSchema.index({ sinifId: 1, dersId: 1, tarih: 1 });
istatistikSchema.index({ sinifId: 1, dersId: 1, konuId: 1, tarih: 1 });

export default mongoose.model('Istatistik', istatistikSchema); 