import mongoose from 'mongoose';

const GercekZamanliSohbetSchema = new mongoose.Schema({
  kullaniciId: { type: String, required: true },
  kullaniciTipi: { 
    type: String, 
    enum: ['child', 'parent'], 
    required: true 
  },
  sohbetOturumu: { type: String, required: true }, // Benzersiz oturum ID'si
  mesajlar: [{
    gonderen: { 
      type: String, 
      enum: ['user', 'assistant'], 
      required: true 
    },
    mesaj: { type: String, required: true },
    zaman: { type: Date, default: Date.now },
    mesajTipi: { 
      type: String, 
      enum: ['text', 'task', 'suggestion', 'motivation', 'question'], 
      default: 'text' 
    },
    metadata: {
      duyguSkoru: { type: Number }, // -1 ile 1 arası
      konuKategorisi: { type: String }, // development, behavior, motivation, health
      oncelik: { type: String, enum: ['düşük', 'orta', 'yüksek'] },
      gorevId: { type: String }, // Eğer görev verilmişse
      oneriId: { type: String } // Eğer öneri verilmişse
    }
  }],
  
  // Kullanıcı Profili ve Bağlam
  kullaniciProfili: {
    yas: { type: Number },
    sinif: { type: String },
    ogrenmeStili: { type: String, enum: ['görsel', 'işitsel', 'kinestetik', 'okuma-yazma'] },
    ilgiAlanlari: [String],
    zorlukAlanlari: [String],
    hedefler: [String],
    duygusalDurum: { type: String, enum: ['mutlu', 'nötr', 'üzgün', 'stresli', 'heyecanlı'] }
  },
  
  // Oturum Durumu
  oturumDurumu: {
    baslangicZamani: { type: Date, default: Date.now },
    sonAktiviteZamani: { type: Date, default: Date.now },
    aktif: { type: Boolean, default: true },
    toplamMesaj: { type: Number, default: 0 },
    ortalamaDuyguSkoru: { type: Number, default: 0 },
    konuKategorileri: [String] // Hangi konularda konuşuldu
  },
  
  // Günlük Görevler ve Öneriler
  gunlukGorevler: [{
    gorevId: { type: String, required: true },
    baslik: { type: String, required: true },
    aciklama: { type: String, required: true },
    kategori: { 
      type: String, 
      enum: ['akademik', 'sosyal', 'duygusal', 'fiziksel', 'yaratıcı'], 
      required: true 
    },
    zorlukSeviyesi: { 
      type: String, 
      enum: ['kolay', 'orta', 'zor'], 
      required: true 
    },
    sure: { type: Number }, // dakika cinsinden
    tamamlandi: { type: Boolean, default: false },
    tamamlanmaZamani: { type: Date },
    puan: { type: Number, default: 10 },
    oncelik: { type: String, enum: ['düşük', 'orta', 'yüksek'], default: 'orta' }
  }],
  
  // Kişiselleştirilmiş Öneriler
  oneriler: [{
    oneriId: { type: String, required: true },
    kategori: { 
      type: String, 
      enum: ['development', 'behavior', 'motivation', 'health', 'academic', 'social'], 
      required: true 
    },
    baslik: { type: String, required: true },
    aciklama: { type: String, required: true },
    oncelik: { type: String, enum: ['düşük', 'orta', 'yüksek'], default: 'orta' },
    uygulandi: { type: Boolean, default: false },
    uygulamaZamani: { type: Date },
    etkinlikSkoru: { type: Number, default: 0 } // 0-10 arası
  }],
  
  // Motivasyon ve Takip
  motivasyonDurumu: {
    genelMotivasyonSkoru: { type: Number, default: 5 }, // 0-10 arası
    gunlukHedefler: [String],
    basarilanHedefler: [String],
    zorluklar: [String],
    pozitifAnilar: [String]
  },
  
  // Gelişim Takibi
  gelisimTakibi: {
    baslangicTarihi: { type: Date, default: Date.now },
    gunlukAktiviteSayisi: { type: Number, default: 0 },
    haftalikBasarimOrani: { type: Number, default: 0 },
    aylikGelisimSkoru: { type: Number, default: 0 },
    enIyiKategori: { type: String },
    gelistirilmesiGerekenKategori: { type: String }
  },
  
  // Sistem Ayarları
  sistemAyarlari: {
    bildirimlerAktif: { type: Boolean, default: true },
    gunlukHatirlatma: { type: Boolean, default: true },
    haftalikOzet: { type: Boolean, default: true },
    dil: { type: String, default: 'tr' },
    tema: { type: String, default: 'light' }
  }
  
}, { timestamps: true });

// İndeksler
GercekZamanliSohbetSchema.index({ kullaniciId: 1, kullaniciTipi: 1 });
GercekZamanliSohbetSchema.index({ sohbetOturumu: 1 });
GercekZamanliSohbetSchema.index({ 'oturumDurumu.aktif': 1 });
GercekZamanliSohbetSchema.index({ 'oturumDurumu.sonAktiviteZamani': -1 });

// Sanal alanlar
GercekZamanliSohbetSchema.virtual('oturumSuresi').get(function() {
  return Math.floor((Date.now() - this.oturumDurumu.baslangicZamani) / (1000 * 60)); // dakika
});

GercekZamanliSohbetSchema.virtual('tamamlananGorevSayisi').get(function() {
  return this.gunlukGorevler.filter(gorev => gorev.tamamlandi).length;
});

GercekZamanliSohbetSchema.virtual('toplamGorevSayisi').get(function() {
  return this.gunlukGorevler.length;
});

GercekZamanliSohbetSchema.virtual('gorevTamamlamaOrani').get(function() {
  if (this.toplamGorevSayisi === 0) return 0;
  return (this.tamamlananGorevSayisi / this.toplamGorevSayisi) * 100;
});

GercekZamanliSohbetSchema.virtual('uygulananOneriSayisi').get(function() {
  return this.oneriler.filter(oneri => oneri.uygulandi).length;
});

// JSON'a çevirirken sanal alanları dahil et
GercekZamanliSohbetSchema.set('toJSON', { virtuals: true });
GercekZamanliSohbetSchema.set('toObject', { virtuals: true });

export default mongoose.model('GercekZamanliSohbet', GercekZamanliSohbetSchema); 