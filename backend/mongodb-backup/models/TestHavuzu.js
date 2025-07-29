import mongoose from 'mongoose';

const testHavuzuSchema = new mongoose.Schema({
  sinif: {
    type: String,
    required: true
  },
  ders: {
    type: String,
    required: true
  },
  konu: {
    type: String,
    required: true
  },
  havuzAdi: {
    type: String,
    default: 'Ana Havuz'
  },
  havuzTipi: {
    type: String,
    enum: ['varsayilan', 'ek'],
    default: 'varsayilan'
  },
  testler: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test'
  }],
  aktif: {
    type: Boolean,
    default: true
  },
  testSayisi: {
    type: Number,
    default: 0
  },
  toplamSoru: {
    type: Number,
    default: 0
  },
  aktifTest: {
    type: Number,
    default: 0
  },
  cozulmeSayisi: {
    type: Number,
    default: 0
  },
  basariOrani: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  ortalamaZorluk: {
    type: Number,
    default: 50,
    min: 0,
    max: 100
  },
  enKolayTest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test'
  },
  enZorTest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test'
  },
  olusturmaTarihi: {
    type: Date,
    default: Date.now
  },
  guncellemeTarihi: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Test sayısını otomatik güncelle
testHavuzuSchema.pre('save', function(next) {
  this.testSayisi = this.testler.length;
  this.guncellemeTarihi = new Date();
  next();
});

// Benzersiz kombinasyon kontrolü
testHavuzuSchema.index({ sinif: 1, ders: 1, konu: 1 }, { unique: true });

const TestHavuzu = mongoose.model('TestHavuzu', testHavuzuSchema);

export default TestHavuzu; 