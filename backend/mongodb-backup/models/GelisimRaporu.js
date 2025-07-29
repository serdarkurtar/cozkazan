import mongoose from 'mongoose';

const GelisimRaporuSchema = new mongoose.Schema({
  childId: { type: String, required: true },
  parentId: { type: String, required: true },
  raporTipi: { 
    type: String, 
    enum: ['daily', 'weekly', 'monthly'], 
    required: true 
  },
  baslangicTarihi: { type: Date, required: true },
  bitisTarihi: { type: Date, required: true },
  olusturmaTarihi: { type: Date, default: Date.now },
  
  // Genel İstatistikler
  toplamXp: { type: Number, default: 0 },
  toplamTest: { type: Number, default: 0 },
  toplamHikaye: { type: Number, default: 0 },
  toplamCalismaSuresi: { type: Number, default: 0 }, // dakika cinsinden
  
  // Günlük Ortalamalar
  gunlukOrtalamaXp: { type: Number, default: 0 },
  gunlukOrtalamaTest: { type: Number, default: 0 },
  gunlukOrtalamaHikaye: { type: Number, default: 0 },
  gunlukOrtalamaCalismaSuresi: { type: Number, default: 0 },
  
  // Başarı Oranları
  testBasariOrani: { type: Number, default: 0 }, // 0-100 arası
  hikayeTamamlamaOrani: { type: Number, default: 0 },
  hedefUlasmaOrani: { type: Number, default: 0 },
  
  // Duygu Analizi
  duyguAnalizi: {
    ortalamaDuyguSkoru: { type: Number, default: 0 },
    enCokGorulenDuygu: { type: String, default: 'nötr' },
    duyguKategorileri: { type: Map, of: Number, default: {} },
    pozitifGunSayisi: { type: Number, default: 0 },
    negatifGunSayisi: { type: Number, default: 0 },
  },
  
  // Sınıf-Ders Bazlı Performans
  sinifDersPerformans: [{
    sinif: { type: String, required: true },
    ders: { type: String, required: true },
    testSayisi: { type: Number, default: 0 },
    basariOrani: { type: Number, default: 0 },
    ortalamaPuan: { type: Number, default: 0 },
  }],
  
  // Hedefler ve Başarılar
  hedefler: [{
    hedefAdi: { type: String, required: true },
    hedefTipi: { type: String, enum: ['xp', 'test', 'hikaye', 'calisma'], required: true },
    hedefDegeri: { type: Number, required: true },
    ulasilanDeger: { type: Number, default: 0 },
    tamamlanmaOrani: { type: Number, default: 0 },
    tamamlandi: { type: Boolean, default: false },
  }],
  
  // Öneriler ve Tavsiyeler
  oneriler: [{
    kategori: { type: String, required: true },
    oneri: { type: String, required: true },
    oncelik: { type: String, enum: ['düşük', 'orta', 'yüksek'], default: 'orta' },
  }],
  
  // Motivasyon Mesajları
  motivasyonMesaji: { type: String, default: '' },
  gelisimOzeti: { type: String, default: '' },
  
  // Rapor Durumu
  gonderildi: { type: Boolean, default: false },
  gonderimTarihi: { type: Date },
  veliGoruntuledi: { type: Boolean, default: false },
  veliGoruntulemeTarihi: { type: Date },
  
  // Grafik Verileri
  grafikVerileri: {
    gunlukXp: { type: Map, of: Number, default: {} }, // { "2024-01-15": 50, "2024-01-16": 75 }
    gunlukTest: { type: Map, of: Number, default: {} },
    gunlukHikaye: { type: Map, of: Number, default: {} },
    duyguTrendi: { type: Map, of: Number, default: {} },
  },
  
  // Özel Notlar
  ozelNotlar: { type: String, default: '' },
  
}, { timestamps: true });

// İndeksler
GelisimRaporuSchema.index({ childId: 1, raporTipi: 1, baslangicTarihi: 1 });
GelisimRaporuSchema.index({ parentId: 1, gonderildi: 1 });
GelisimRaporuSchema.index({ olusturmaTarihi: -1 });

// Sanal alanlar
GelisimRaporuSchema.virtual('raporSuresi').get(function() {
  const gunFarki = Math.ceil((this.bitisTarihi - this.baslangicTarihi) / (1000 * 60 * 60 * 24));
  return gunFarki;
});

GelisimRaporuSchema.virtual('genelPerformansSkoru').get(function() {
  const xpSkoru = Math.min(this.toplamXp / 100, 1) * 25; // Max 25 puan
  const testSkoru = Math.min(this.testBasariOrani / 100, 1) * 25; // Max 25 puan
  const hikayeSkoru = Math.min(this.hikayeTamamlamaOrani / 100, 1) * 25; // Max 25 puan
  const hedefSkoru = Math.min(this.hedefUlasmaOrani / 100, 1) * 25; // Max 25 puan
  
  return Math.round(xpSkoru + testSkoru + hikayeSkoru + hedefSkoru);
});

GelisimRaporuSchema.virtual('performansSeviyesi').get(function() {
  const skor = this.genelPerformansSkoru;
  if (skor >= 80) return 'Mükemmel';
  if (skor >= 60) return 'İyi';
  if (skor >= 40) return 'Orta';
  if (skor >= 20) return 'Geliştirilmeli';
  return 'Dikkat Gerekli';
});

// JSON'a çevirirken sanal alanları dahil et
GelisimRaporuSchema.set('toJSON', { virtuals: true });
GelisimRaporuSchema.set('toObject', { virtuals: true });

export default mongoose.model('GelisimRaporu', GelisimRaporuSchema); 