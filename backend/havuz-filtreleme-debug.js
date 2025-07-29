import mongoose from 'mongoose';

async function havuzFiltrelemeDebug() {
    try {
        await mongoose.connect('mongodb://localhost:27017/cozkazan');
        console.log('✅ MongoDB bağlantısı başarılı');

        const Test = (await import('./models/Test.js')).default;
        const TestHavuzu = (await import('./models/TestHavuzu.js')).default;

        // Tüm havuzları kontrol et
        console.log('\n🔍 TÜM HAVUZLAR:');
        const tumHavuzlar = await TestHavuzu.find().populate('testler');
        
        tumHavuzlar.forEach((havuz, index) => {
            console.log(`\n${index + 1}. HAVUZ: ${havuz.sinif} - ${havuz.ders} - ${havuz.konu}`);
            console.log(`   Havuz ID: ${havuz._id}`);
            console.log(`   Test sayısı: ${havuz.testler.length}`);
            
            if (havuz.testler.length > 0) {
                console.log('   Testler:');
                havuz.testler.forEach((test, testIndex) => {
                    console.log(`     ${testIndex + 1}. ${test.testAdi}`);
                    console.log(`        Konu: ${test.konu}`);
                    console.log(`        HavuzId: ${test.havuzId}`);
                });
            }
        });

        // API simülasyonu - Güzel Davranışlarımız
        console.log('\n🔍 API SİMÜLASYONU - GÜZEL DAVRANIŞLARIMIZ:');
        const sinif = '1. Sınıf';
        const ders = 'Türkçe';
        const konu = 'Güzel Davranışlarımız';
        
        // Havuzu bul
        const havuz = await TestHavuzu.findOne({ sinif, ders, konu });
        console.log(`Havuz bulundu: ${havuz ? 'EVET' : 'HAYIR'}`);
        
        if (havuz) {
            console.log(`Havuz ID: ${havuz._id}`);
            console.log(`Havuzdaki test sayısı: ${havuz.testler.length}`);
            
            // Havuzdaki testleri getir
            const tests = await Test.find({ 
                _id: { $in: havuz.testler }
            });
            
            console.log(`API'den dönen test sayısı: ${tests.length}`);
            tests.forEach((test, index) => {
                console.log(`  ${index + 1}. ${test.testAdi} (Konu: ${test.konu})`);
            });
        }

        // Tüm testleri kontrol et
        console.log('\n🔍 TÜM TESTLER:');
        const tumTestler = await Test.find();
        
        tumTestler.forEach((test, index) => {
            console.log(`${index + 1}. ${test.testAdi}`);
            console.log(`   Konu: ${test.konu}`);
            console.log(`   HavuzId: ${test.havuzId}`);
            console.log(`   Test ID: ${test._id}`);
            console.log('   ---');
        });

    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        await mongoose.disconnect();
        console.log('✅ MongoDB bağlantısı kapatıldı');
    }
}

havuzFiltrelemeDebug(); 