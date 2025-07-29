import mongoose from 'mongoose';

async function apiDebug() {
    try {
        await mongoose.connect('mongodb://localhost:27017/cozkazan');
        console.log('✅ MongoDB bağlantısı başarılı');

        const Test = (await import('./models/Test.js')).default;
        const TestHavuzu = (await import('./models/TestHavuzu.js')).default;

        // API'deki mantığı simüle et
        const sinif = '1. Sınıf';
        const ders = 'Türkçe';
        const konu = 'Güzel Davranışlarımız';

        console.log(`\n🔍 API DEBUG: ${sinif} - ${ders} - ${konu}`);

        // 1. Havuzu bul
        const havuz = await TestHavuzu.findOne({ sinif, ders, konu });
        console.log(`1. Havuz bulundu: ${havuz ? 'EVET' : 'HAYIR'}`);
        
        if (havuz) {
            console.log(`   Havuz ID: ${havuz._id}`);
            console.log(`   Havuzdaki test sayısı: ${havuz.testler.length}`);
            console.log(`   Test ID'leri: ${havuz.testler.map(id => id.toString())}`);
        }

        // 2. Havuzdaki testleri getir
        if (havuz && havuz.testler.length > 0) {
            const tests = await Test.find({ 
                _id: { $in: havuz.testler }
            }).sort({ createdAt: -1 });

            console.log(`2. API'den dönen test sayısı: ${tests.length}`);
            
            tests.forEach((test, index) => {
                console.log(`   ${index + 1}. ${test.testAdi}`);
                console.log(`      Konu: ${test.konu}`);
                console.log(`      HavuzId: ${test.havuzId}`);
                console.log(`      Test ID: ${test._id}`);
            });
        }

        // 3. Tüm testleri kontrol et
        console.log('\n🔍 TÜM TESTLER:');
        const tumTestler = await Test.find({ 
            sinif: sinif, 
            ders: ders 
        });

        console.log(`${sinif} ${ders} dersinde toplam ${tumTestler.length} test var:`);
        tumTestler.forEach((test, index) => {
            console.log(`   ${index + 1}. ${test.testAdi} (Konu: ${test.konu})`);
        });

        // 4. Mustafa Kemal testini özel kontrol et
        console.log('\n🔍 MUSTAFA KEMAL TESTİ KONTROLÜ:');
        const mustafaKemalTest = await Test.findOne({ 
            testAdi: { $regex: 'Mustafa Kemal' } 
        });

        if (mustafaKemalTest) {
            console.log(`Test: ${mustafaKemalTest.testAdi}`);
            console.log(`Konu: ${mustafaKemalTest.konu}`);
            console.log(`HavuzId: ${mustafaKemalTest.havuzId}`);
            
            // Bu test hangi havuzda?
            const mustafaKemalHavuz = await TestHavuzu.findOne({ 
                _id: mustafaKemalTest.havuzId 
            });
            
            if (mustafaKemalHavuz) {
                console.log(`Havuz: ${mustafaKemalHavuz.sinif} - ${mustafaKemalHavuz.ders} - ${mustafaKemalHavuz.konu}`);
            }
        }

    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        await mongoose.disconnect();
        console.log('✅ MongoDB bağlantısı kapatıldı');
    }
}

apiDebug(); 