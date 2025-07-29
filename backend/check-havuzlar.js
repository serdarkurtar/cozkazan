import mongoose from 'mongoose';
import { MONGO_URL } from './env.js';
import Test from './models/Test.js';
import TestHavuzu from './models/TestHavuzu.js';
import Sinif from './models/Sinif.js';
import Ders from './models/Ders.js';
import Konu from './models/Konu.js';

async function checkHavuzlar() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('✅ Veritabanı bağlantısı başarılı.\n');

        // Testleri getir
        const testler = await Test.find().populate('sinif ders konu');
        console.log(`📊 TOPLAM ${testler.length} TEST:`);
        
        testler.forEach((test, index) => {
            console.log(`${index + 1}. ${test.testAdi || 'İsimsiz'} | ${test.sinif?.ad || 'Sınıf Yok'} | ${test.ders?.ad || 'Ders Yok'} | ${test.konu?.ad || 'Konu Yok'}`);
        });

        // Havuzları getir
        const havuzlar = await TestHavuzu.find().populate('sinif ders konu');
        console.log(`\n🏊 TOPLAM ${havuzlar.length} HAVUZ:`);
        
        havuzlar.forEach((havuz, index) => {
            console.log(`${index + 1}. ${havuz.sinif?.ad || 'Sınıf Yok'} | ${havuz.ders?.ad || 'Ders Yok'} | ${havuz.konu?.ad || 'Konu Yok'} | ${havuz.testSayisi} test`);
        });

        // Benzersiz kombinasyonları say
        const kombinasyonlar = new Set();
        testler.forEach(test => {
            if (test.sinif && test.ders && test.konu) {
                kombinasyonlar.add(`${test.sinif.ad}-${test.ders.ad}-${test.konu.ad}`);
            }
        });

        console.log(`\n🎯 BENZERSİZ KOMBİNASYONLAR: ${kombinasyonlar.size}`);
        kombinasyonlar.forEach(komb => console.log(`- ${komb}`));

        process.exit(0);
    } catch (error) {
        console.error('❌ Hata:', error);
        process.exit(1);
    }
}

checkHavuzlar(); 