import mongoose from 'mongoose';

async function apiDebugDetayli() {
    try {
        await mongoose.connect('mongodb://localhost:27017/cozkazan');
        console.log('✅ MongoDB bağlantısı başarılı');

        const Test = (await import('./models/Test.js')).default;
        const TestHavuzu = (await import('./models/TestHavuzu.js')).default;

        // API endpoint simülasyonu
        console.log('\n🔍 API ENDPOINT SİMÜLASYONU:');
        const sinif = '1. Sınıf';
        const ders = 'Türkçe';
        const konu = 'Güzel Davranışlarımız';
        
        console.log('Parametreler:', { sinif, ders, konu });
        
        // 1. Havuzu bul
        const havuz = await TestHavuzu.findOne({ sinif, ders, konu });
        console.log('\n1️⃣ HAVUZ BULUNDU:', havuz ? 'EVET' : 'HAYIR');
        
        if (havuz) {
            console.log('Havuz ID:', havuz._id);
            console.log('Havuzdaki test sayısı:', havuz.testler.length);
            console.log('Havuzdaki test ID\'leri:', havuz.testler);
        }
        
        // 2. Havuzdaki testleri getir
        if (havuz && havuz.testler.length > 0) {
            const tests = await Test.find({ 
                _id: { $in: havuz.testler }
            }).sort({ createdAt: -1 });
            
            console.log('\n2️⃣ HAVUZDAKİ TESTLER:');
            console.log('Test sayısı:', tests.length);
            
            tests.forEach((test, index) => {
                console.log(`  ${index + 1}. ${test.testAdi}`);
                console.log(`     Konu: ${test.konu}`);
                console.log(`     HavuzId: ${test.havuzId}`);
                console.log(`     Test ID: ${test._id}`);
                console.log('     ---');
            });
        }
        
        // 3. Tüm testleri kontrol et
        console.log('\n3️⃣ TÜM TESTLER:');
        const tumTestler = await Test.find();
        console.log('Toplam test sayısı:', tumTestler.length);
        
        tumTestler.forEach((test, index) => {
            console.log(`  ${index + 1}. ${test.testAdi}`);
            console.log(`     Konu: ${test.konu}`);
            console.log(`     HavuzId: ${test.havuzId}`);
            console.log(`     Test ID: ${test._id}`);
            console.log('     ---');
        });
        
        // 4. Havuzları kontrol et
        console.log('\n4️⃣ TÜM HAVUZLAR:');
        const tumHavuzlar = await TestHavuzu.find();
        console.log('Toplam havuz sayısı:', tumHavuzlar.length);
        
        tumHavuzlar.forEach((havuz, index) => {
            console.log(`  ${index + 1}. ${havuz.sinif} - ${havuz.ders} - ${havuz.konu}`);
            console.log(`     Havuz ID: ${havuz._id}`);
            console.log(`     Test sayısı: ${havuz.testler.length}`);
            console.log(`     Test ID'leri: ${havuz.testler}`);
            console.log('     ---');
        });

    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        await mongoose.disconnect();
        console.log('✅ MongoDB bağlantısı kapatıldı');
    }
}

apiDebugDetayli(); 