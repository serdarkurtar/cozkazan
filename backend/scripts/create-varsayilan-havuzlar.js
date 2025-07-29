import mongoose from 'mongoose';
import { MONGO_URL } from '../env.js';
import Konu from '../models/Konu.js';
import TestHavuzu from '../models/TestHavuzu.js';
import Sinif from '../models/Sinif.js';
import Ders from '../models/Ders.js';
import { getOrCreateVarsayilanHavuz } from '../utils/havuzYoneticisi.js';

async function createVarsayilanHavuzlar() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('✅ Veritabanı bağlantısı başarılı.');

        // Tüm konuları getir
        const konular = await Konu.find().populate('sinif ders');
        console.log(`📚 Toplam ${konular.length} konu bulundu.`);

        let olusturulanHavuz = 0;
        let mevcutHavuz = 0;

        for (const konu of konular) {
            try {
                console.log(`\n🔍 Konu kontrol ediliyor: ${konu.sinif?.ad} - ${konu.ders?.ad} - ${konu.ad}`);
                
                // Varsayılan havuz oluştur veya getir
                const havuz = await getOrCreateVarsayilanHavuz(
                    konu.sinif._id, 
                    konu.ders._id, 
                    konu._id
                );

                if (havuz.havuzTipi === 'varsayilan' && havuz.testler.length === 0) {
                    olusturulanHavuz++;
                    console.log(`✅ Yeni varsayılan havuz oluşturuldu: ${havuz.havuzAdi}`);
                } else {
                    mevcutHavuz++;
                    console.log(`🔄 Mevcut havuz bulundu: ${havuz.havuzAdi} (${havuz.testSayisi} test)`);
                }

            } catch (error) {
                console.error(`❌ Konu hatası (${konu.ad}):`, error.message);
            }
        }

        console.log('\n🎉 Varsayılan havuz oluşturma tamamlandı!');
        console.log(`✅ Yeni oluşturulan: ${olusturulanHavuz}`);
        console.log(`🔄 Mevcut olan: ${mevcutHavuz}`);
        console.log(`📊 Toplam: ${olusturulanHavuz + mevcutHavuz}`);

        // İstatistikler
        const toplamHavuz = await TestHavuzu.countDocuments();
        const varsayilanHavuzlar = await TestHavuzu.countDocuments({ havuzTipi: 'varsayilan' });
        const ekHavuzlar = await TestHavuzu.countDocuments({ havuzTipi: 'ek' });

        console.log('\n📈 Havuz İstatistikleri:');
        console.log(`🏊 Toplam havuz: ${toplamHavuz}`);
        console.log(`📚 Varsayılan havuzlar: ${varsayilanHavuzlar}`);
        console.log(`➕ Ek havuzlar: ${ekHavuzlar}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Genel hata:', error);
        process.exit(1);
    }
}

// Scripti çalıştır
createVarsayilanHavuzlar(); 