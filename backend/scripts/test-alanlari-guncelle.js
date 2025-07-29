import mongoose from 'mongoose';
import Sinif from '../models/Sinif.js';
import Ders from '../models/Ders.js';
import Konu from '../models/Konu.js';
import Test from '../models/Test.js';
import PERMANENT_SETTINGS from '../config/permanent-settings.js';

// MongoDB bağlantısı
mongoose.connect(PERMANENT_SETTINGS.DATABASE.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB bağlantı hatası:'));
db.once('open', async () => {
  console.log('✅ MongoDB bağlantısı başarılı');
  
  try {
    // Tüm testleri al
    const testler = await Test.find();
    console.log(`📚 Toplam ${testler.length} test bulundu`);
    
    let guncellenen = 0;
    
    for (const test of testler) {
      let guncellemeGerekli = false;
      const guncelleme = {};
      
      // sinifAdi eksikse doldur
      if (!test.sinifAdi && test.sinif) {
        try {
          const sinif = await Sinif.findById(test.sinif);
          if (sinif) {
            guncelleme.sinifAdi = sinif.ad;
            guncellemeGerekli = true;
            console.log(`✅ Test ${test.testAdi} için sinifAdi: ${sinif.ad}`);
          }
        } catch (err) {
          console.log(`❌ Test ${test.testAdi} için sinif bulunamadı: ${test.sinif}`);
        }
      }
      
      // dersAdi eksikse doldur
      if (!test.dersAdi && test.ders) {
        try {
          const ders = await Ders.findById(test.ders);
          if (ders) {
            guncelleme.dersAdi = ders.ad;
            guncellemeGerekli = true;
            console.log(`✅ Test ${test.testAdi} için dersAdi: ${ders.ad}`);
          }
        } catch (err) {
          console.log(`❌ Test ${test.testAdi} için ders bulunamadı: ${test.ders}`);
        }
      }
      
      // konuAdi eksikse doldur
      if (!test.konuAdi && test.konu) {
        try {
          const konu = await Konu.findById(test.konu);
          if (konu) {
            guncelleme.konuAdi = konu.ad;
            guncellemeGerekli = true;
            console.log(`✅ Test ${test.testAdi} için konuAdi: ${konu.ad}`);
          }
        } catch (err) {
          console.log(`❌ Test ${test.testAdi} için konu bulunamadı: ${test.konu}`);
        }
      }
      
      // Güncelleme yap
      if (guncellemeGerekli) {
        await Test.findByIdAndUpdate(test._id, guncelleme);
        guncellenen++;
      }
    }
    
    console.log(`🎉 ${guncellenen} test güncellendi!`);
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}); 