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
    // Mevcut verileri temizle
    await Test.deleteMany({});
    await Konu.deleteMany({});
    await Ders.deleteMany({});
    console.log('🗑️ Mevcut veriler temizlendi');
    
    // Sınıfları al
    const siniflar = await Sinif.find().sort('ad');
    console.log(`📚 Bulunan sınıflar: ${siniflar.map(s => s.ad).join(', ')}`);
    
    // Her sınıf için dersler oluştur
    for (const sinif of siniflar) {
      const dersler = [
        { ad: 'Türkçe', sinifAdi: sinif.ad },
        { ad: 'Matematik', sinifAdi: sinif.ad },
        { ad: 'Hayat Bilgisi', sinifAdi: sinif.ad },
        { ad: 'Fen Bilimleri', sinifAdi: sinif.ad }
      ];
      
      for (const dersData of dersler) {
        const ders = new Ders({
          ad: dersData.ad,
          sinif: sinif._id,
          sinifAdi: dersData.sinifAdi,
          aktif: true
        });
        await ders.save();
        console.log(`✅ Ders oluşturuldu: ${sinif.ad} - ${dersData.ad}`);
        
        // Her ders için konular oluştur
        const konular = [
          { ad: 'Okuma', sira: 1, dersAdi: dersData.ad },
          { ad: 'Yazma', sira: 2, dersAdi: dersData.ad },
          { ad: 'Dil Bilgisi', sira: 3, dersAdi: dersData.ad }
        ];
        
        for (const konuData of konular) {
          const konu = new Konu({
            ad: konuData.ad,
            sira: konuData.sira,
            ders: ders._id,
            sinif: sinif._id,
            dersAdi: konuData.dersAdi,
            sinifAdi: sinif.ad,
            aktif: true
          });
          await konu.save();
          console.log(`✅ Konu oluşturuldu: ${sinif.ad} - ${dersData.ad} - ${konuData.ad}`);
          
          // Her konu için örnek testler oluştur
          for (let i = 1; i <= 3; i++) {
            const test = new Test({
              testAdi: `${konuData.ad} Test ${i}`,
              ad: `${konuData.ad} Test ${i}`,
              aciklama: `${sinif.ad} ${dersData.ad} ${konuData.ad} konusu için örnek test ${i}`,
              sinif: sinif.ad,
              ders: dersData.ad,
              konu: konuData.ad,
              sinifAdi: sinif.ad,
              dersAdi: dersData.ad,
              konuAdi: konuData.ad,
              sorular: [
                {
                  soru: `${konuData.ad} ile ilgili örnek soru ${i}.1?`,
                  secenekler: ['A şıkkı', 'B şıkkı', 'C şıkkı', 'D şıkkı'],
                  dogruCevap: 0,
                  aciklama: 'Doğru cevap A şıkkıdır.'
                },
                {
                  soru: `${konuData.ad} ile ilgili örnek soru ${i}.2?`,
                  secenekler: ['Seçenek 1', 'Seçenek 2', 'Seçenek 3', 'Seçenek 4'],
                  dogruCevap: 1,
                  aciklama: 'Doğru cevap B şıkkıdır.'
                }
              ],
              puan: 10,
              aktif: true
            });
            await test.save();
            console.log(`✅ Test oluşturuldu: ${test.testAdi}`);
          }
        }
      }
    }
    
    console.log('🎉 Örnek veriler başarıyla oluşturuldu!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}); 