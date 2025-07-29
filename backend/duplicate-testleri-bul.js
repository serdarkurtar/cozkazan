import mongoose from 'mongoose';

async function duplicateTestleriBul() {
    try {
        await mongoose.connect('mongodb://localhost:27017/cozkazan');
        console.log('✅ MongoDB bağlantısı başarılı');

        const Test = (await import('./models/Test.js')).default;
        const TestHavuzu = (await import('./models/TestHavuzu.js')).default;

        // Tüm testleri al
        const tumTestler = await Test.find();
        console.log(`📝 Toplam test: ${tumTestler.length}`);

        // Test ID'lerini kontrol et
        const testIds = tumTestler.map(test => test._id.toString());
        console.log('\n🔍 TEST ID\'LERİ:');
        testIds.forEach((id, index) => {
            console.log(`${index + 1}. ${id}`);
        });

        // Duplicate ID'leri bul
        const duplicateIds = testIds.filter((id, index) => testIds.indexOf(id) !== index);
        console.log('\n🚨 DUPLICATE ID\'LER:');
        if (duplicateIds.length > 0) {
            duplicateIds.forEach(id => {
                console.log(`   ${id}`);
            });
        } else {
            console.log('   Duplicate ID bulunamadı');
        }

        // Test detaylarını göster
        console.log('\n📋 TEST DETAYLARI:');
        tumTestler.forEach((test, index) => {
            console.log(`\n${index + 1}. ${test.testAdi}`);
            console.log(`   ID: ${test._id}`);
            console.log(`   Konu: ${test.konu}`);
            console.log(`   HavuzId: ${test.havuzId}`);
            console.log(`   Oluşturulma: ${test.createdAt}`);
        });

        // Havuzları kontrol et
        console.log('\n📦 HAVUZ DETAYLARI:');
        const tumHavuzlar = await TestHavuzu.find();
        
        tumHavuzlar.forEach((havuz, index) => {
            console.log(`\n${index + 1}. ${havuz.sinif} - ${havuz.ders} - ${havuz.konu}`);
            console.log(`   Havuz ID: ${havuz._id}`);
            console.log(`   Test sayısı: ${havuz.testler.length}`);
            console.log(`   Test ID'leri: ${havuz.testler.map(id => id.toString())}`);
        });

    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        await mongoose.disconnect();
        console.log('✅ MongoDB bağlantısı kapatıldı');
    }
}

duplicateTestleriBul(); 