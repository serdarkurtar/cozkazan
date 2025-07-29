import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

async function cleanupSystem() {
    try {
        console.log('🧹 COZKAZAN SİSTEM TEMİZLİĞİ BAŞLIYOR...\n');
        
        // MongoDB bağlantısı
        await mongoose.connect('mongodb://localhost:27017/cozkazan');
        console.log('✅ MongoDB bağlantısı başarılı');

        const Test = (await import('./backend/models/Test.js')).default;
        const TestHavuzu = (await import('./backend/models/TestHavuzu.js')).default;

        // 1. Duplicate testleri bul ve temizle
        console.log('\n🔍 Duplicate testler kontrol ediliyor...');
        const tumTestler = await Test.find();
        const testIds = tumTestler.map(test => test._id.toString());
        const duplicateIds = testIds.filter((id, index) => testIds.indexOf(id) !== index);
        
        if (duplicateIds.length > 0) {
            console.log(`🚨 ${duplicateIds.length} duplicate test bulundu`);
            for (const id of duplicateIds) {
                await Test.findByIdAndDelete(id);
                console.log(`   ✅ ${id} silindi`);
            }
        } else {
            console.log('✅ Duplicate test bulunamadı');
        }

        // 2. Test field'larını düzelt
        console.log('\n🔧 Test field\'ları düzeltiliyor...');
        const guncellenecekTestler = await Test.find({
            $or: [
                { testAdi: { $exists: false } },
                { ad: { $exists: false } },
                { konuAdi: { $exists: false } }
            ]
        });

        for (const test of guncellenecekTestler) {
            const guncellemeler = {};
            
            if (!test.testAdi) {
                guncellemeler.testAdi = test.aciklama || 'Test';
            }
            
            if (!test.ad) {
                guncellemeler.ad = test.testAdi || test.aciklama || 'Test';
            }
            
            if (!test.konuAdi) {
                guncellemeler.konuAdi = test.konu || 'Konu';
            }

            if (Object.keys(guncellemeler).length > 0) {
                await Test.findByIdAndUpdate(test._id, guncellemeler);
                console.log(`   ✅ ${test._id} güncellendi`);
            }
        }

        // 3. Havuzları kontrol et
        console.log('\n📦 Test havuzları kontrol ediliyor...');
        const tumHavuzlar = await TestHavuzu.find();
        
        for (const havuz of tumHavuzlar) {
            // Havuzdaki testlerin gerçekten var olup olmadığını kontrol et
            const gecerliTestler = [];
            for (const testId of havuz.testler) {
                const test = await Test.findById(testId);
                if (test) {
                    gecerliTestler.push(testId);
                } else {
                    console.log(`   ⚠️ Havuz ${havuz._id} - Geçersiz test ID: ${testId}`);
                }
            }
            
            if (gecerliTestler.length !== havuz.testler.length) {
                await TestHavuzu.findByIdAndUpdate(havuz._id, {
                    testler: gecerliTestler,
                    testSayisi: gecerliTestler.length
                });
                console.log(`   ✅ Havuz ${havuz._id} temizlendi`);
            }
        }

        // 4. Debug dosyalarını listele
        console.log('\n📁 Debug dosyaları:');
        const backendPath = './backend';
        const files = fs.readdirSync(backendPath);
        
        const debugFiles = files.filter(file => 
            file.startsWith('debug-') || 
            file.startsWith('temizle-') || 
            file.startsWith('havuz-') ||
            file.includes('duplicate')
        );
        
        debugFiles.forEach(file => {
            console.log(`   📄 ${file}`);
        });

        console.log(`\n📊 ÖZET:`);
        console.log(`   • Toplam test: ${await Test.countDocuments()}`);
        console.log(`   • Toplam havuz: ${await TestHavuzu.countDocuments()}`);
        console.log(`   • Duplicate temizlendi: ${duplicateIds.length}`);
        console.log(`   • Debug dosyaları: ${debugFiles.length}`);

        console.log('\n✅ Sistem temizliği tamamlandı!');

    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        await mongoose.disconnect();
        console.log('✅ MongoDB bağlantısı kapatıldı');
    }
}

cleanupSystem(); 