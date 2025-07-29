const mongoose = require('mongoose');

// MongoDB bağlantısı
mongoose.connect('mongodb://localhost:27017/cozkazan', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function debugTestSorunu() {
    try {
        // ES module modellerini dinamik import ile yükle
        const Test = (await import('./models/Test.js')).default;
        const TestHavuzu = (await import('./models/TestHavuzu.js')).default;
        
        console.log('🔍 Test Sorunu Analizi Başlıyor...\n');
        
        // 1. Tüm testleri listele
        console.log('📋 TÜM TESTLER:');
        const tumTestler = await Test.find({});
        tumTestler.forEach((test, index) => {
            console.log(`${index + 1}. Test ID: ${test._id}`);
            console.log(`   Ad: ${test.ad || test.testAdi || 'Ad yok'}`);
            console.log(`   Sınıf: ${test.sinif}`);
            console.log(`   Ders: ${test.ders}`);
            console.log(`   Konu: ${test.konu}`);
            console.log(`   Havuz ID: ${test.havuzId}`);
            console.log('   ---');
        });
        
        // 2. Tüm test havuzlarını listele
        console.log('\n📚 TÜM TEST HAVUZLARI:');
        const tumHavuzlar = await TestHavuzu.find({});
        tumHavuzlar.forEach((havuz, index) => {
            console.log(`${index + 1}. Havuz ID: ${havuz._id}`);
            console.log(`   Sınıf: ${havuz.sinif}`);
            console.log(`   Ders: ${havuz.ders}`);
            console.log(`   Konu: ${havuz.konu}`);
            console.log(`   Test Sayısı: ${havuz.testler ? havuz.testler.length : 0}`);
            console.log('   ---');
        });
        
        // 3. Sorunlu testleri bul
        console.log('\n❌ SORUNLU TESTLER (Yanlış konularda):');
        const sorunluTestler = tumTestler.filter(test => {
            // Test havuzu ile eşleşmeyen testler
            const havuz = tumHavuzlar.find(h => h._id.toString() === test.havuzId?.toString());
            if (!havuz) return true;
            
            return test.sinif !== havuz.sinif || 
                   test.ders !== havuz.ders || 
                   test.konu !== havuz.konu;
        });
        
        sorunluTestler.forEach((test, index) => {
            console.log(`${index + 1}. Test: ${test.ad || test.testAdi}`);
            console.log(`   Test Bilgileri: ${test.sinif} > ${test.ders} > ${test.konu}`);
            const havuz = tumHavuzlar.find(h => h._id.toString() === test.havuzId?.toString());
            if (havuz) {
                console.log(`   Havuz Bilgileri: ${havuz.sinif} > ${havuz.ders} > ${havuz.konu}`);
            } else {
                console.log(`   Havuz Bulunamadı!`);
            }
            console.log('   ---');
        });
        
        console.log(`\n📊 ÖZET:`);
        console.log(`   Toplam Test: ${tumTestler.length}`);
        console.log(`   Toplam Havuz: ${tumHavuzlar.length}`);
        console.log(`   Sorunlu Test: ${sorunluTestler.length}`);
        
    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        mongoose.connection.close();
    }
}

debugTestSorunu(); 