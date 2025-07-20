import mongoose from 'mongoose';
import TestHavuzu from '../models/TestHavuzu.js';
import Test from '../models/Test.js';
import Sinif from '../models/Sinif.js';
import Ders from '../models/Ders.js';
import Konu from '../models/Konu.js';
import { MONGO_URL } from '../env.js';

async function connectDB() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('✅ MongoDB bağlantısı başarılı.');
    } catch (error) {
        console.error('❌ MongoDB bağlantı hatası:', error);
        process.exit(1);
    }
}

async function createTestHavuzlari() {
    try {
        await connectDB();
        console.log('✅ Veritabanı bağlantısı başarılı.');

        // Tüm testleri getir
        const testler = await Test.find().populate('sinif ders konu');
        console.log(`📊 Toplam ${testler.length} test bulundu.`);

        // Testleri sınıf-ders-konu gruplarına ayır
        const testGruplari = {};
        
        testler.forEach(test => {
            if (test.sinif && test.ders && test.konu) {
                const key = `${test.sinif._id}-${test.ders._id}-${test.konu._id}`;
                if (!testGruplari[key]) {
                    testGruplari[key] = {
                        sinif: test.sinif._id,
                        ders: test.ders._id,
                        konu: test.konu._id,
                        testler: []
                    };
                }
                testGruplari[key].testler.push(test._id);
            }
        });

        console.log(`🏊 ${Object.keys(testGruplari).length} farklı sınıf-ders-konu kombinasyonu bulundu.`);

        // Her grup için test havuzu oluştur
        let olusturulanHavuz = 0;
        let guncellenenHavuz = 0;

        for (const [key, grup] of Object.entries(testGruplari)) {
            try {
                // Mevcut havuzu kontrol et
                let havuz = await TestHavuzu.findOne({
                    sinif: grup.sinif,
                    ders: grup.ders,
                    konu: grup.konu
                });

                if (havuz) {
                    // Mevcut havuzu güncelle
                    havuz.testler = grup.testler;
                    await havuz.save();
                    guncellenenHavuz++;
                    console.log(`🔄 Havuz güncellendi: ${havuz._id} (${grup.testler.length} test)`);
                } else {
                    // Yeni havuz oluştur
                    havuz = new TestHavuzu({
                        sinif: grup.sinif,
                        ders: grup.ders,
                        konu: grup.konu,
                        testler: grup.testler
                    });
                    await havuz.save();
                    olusturulanHavuz++;
                    console.log(`✅ Yeni havuz oluşturuldu: ${havuz._id} (${grup.testler.length} test)`);
                }
            } catch (error) {
                console.error(`❌ Havuz oluşturma hatası (${key}):`, error.message);
            }
        }

        console.log('\n🎉 Test havuzu oluşturma tamamlandı!');
        console.log(`✅ Oluşturulan havuz: ${olusturulanHavuz}`);
        console.log(`🔄 Güncellenen havuz: ${guncellenenHavuz}`);
        console.log(`📊 Toplam havuz: ${olusturulanHavuz + guncellenenHavuz}`);

        // İstatistikler
        const toplamHavuz = await TestHavuzu.countDocuments();
        const toplamTest = await TestHavuzu.aggregate([
            { $group: { _id: null, toplamTest: { $sum: '$testSayisi' } } }
        ]);

        console.log('\n📈 İstatistikler:');
        console.log(`🏊 Toplam havuz sayısı: ${toplamHavuz}`);
        console.log(`📝 Toplam test sayısı: ${toplamTest[0]?.toplamTest || 0}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Genel hata:', error);
        process.exit(1);
    }
}

// Scripti çalıştır
createTestHavuzlari(); 