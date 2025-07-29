import mongoose from 'mongoose';
import Ders from '../models/Ders.js';
import Sinif from '../models/Sinif.js';
import Konu from '../models/Konu.js';

// MongoDB bağlantısı
mongoose.connect('mongodb://localhost:27017/cozkazan');

async function veriKontrol() {
  try {
    console.log('🔍 Veri kontrolü başlıyor...');
    
    // Sınıfları kontrol et
    const siniflar = await Sinif.find();
    console.log(`📊 Sınıflar (${siniflar.length}):`);
    siniflar.forEach(sinif => {
      console.log(`   - ${sinif.ad} (ID: ${sinif._id})`);
    });
    
    // Dersleri kontrol et
    const dersler = await Ders.find().populate('sinif');
    console.log(`📚 Dersler (${dersler.length}):`);
    dersler.forEach(ders => {
      console.log(`   - ${ders.ad} (Sınıf: ${ders.sinif.ad}, ID: ${ders._id})`);
    });
    
    // Konuları kontrol et
    const konular = await Konu.find().populate('ders').populate('sinif');
    console.log(`📝 Konular (${konular.length}):`);
    konular.forEach(konu => {
      console.log(`   - ${konu.ad} (Ders: ${konu.ders.ad}, Sınıf: ${konu.sinif.ad})`);
    });
    
  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    mongoose.connection.close();
  }
}

veriKontrol(); 