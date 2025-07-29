import mongoose from 'mongoose';

async function debugHavuzSorunuDetayli() {
    try {
        await mongoose.connect('mongodb://localhost:27017/cozkazan');
        console.log('✅ MongoDB bağlantısı başarılı');

        const Test = (await import('./models/Test.js')).default;
        const TestHavuzu = (await import('./models/TestHavuzu.js')).default;

        // Güzel Davranışlarımız havuzunu kontrol et
        console.log('\n🔍 GÜZEL DAVRANIŞLARIMIZ HAVUZU:');
        const guzelDavranislarHavuz = await TestHavuzu.findOne({ 
            sinif: '1. Sınıf', 
            ders: 'Türkçe', 
            konu: 'Güzel Davranışlarımız' 
        }).populate('testler');
        
        if (guzelDavranislarHavuz) {
            console.log(`Havuz ID: ${guzelDavranislarHavuz._id}`);
            console.log(`Test Sayısı: ${guzelDavranislarHavuz.testler.length}`);
            
            if (guzelDavranislarHavuz.testler.length > 0) {
                console.log('Testler:');
                guzelDavranislarHavuz.testler.forEach((test, index) => {
                    console.log(`  ${index + 1}. ${test.testAdi}`);
                    console.log(`     Konu: ${test.konu}`);
                    console.log(`     HavuzId: ${test.havuzId}`);
                    console.log(`     Test ID: ${test._id}`);
                });
            }
        }

        // Mustafa Kemal'den Atatürk'e testini bul
        console.log('\n🔍 MUSTAFA KEMAL\'DEN ATATÜRK\'E TESTİ:');
        const mustafaKemalTest = await Test.findOne({ 
            testAdi: { $regex: 'Mustafa Kemal' } 
        });
        
        if (mustafaKemalTest) {
            console.log(`Test ID: ${mustafaKemalTest._id}`);
            console.log(`Test Adı: ${mustafaKemalTest.testAdi}`);
            console.log(`Konu: ${mustafaKemalTest.konu}`);
            console.log(`HavuzId: ${mustafaKemalTest.havuzId}`);
            
            // Bu testin hangi havuzda olduğunu kontrol et
            const havuz = await TestHavuzu.findOne({ 
                _id: mustafaKemalTest.havuzId 
            });
            
            if (havuz) {
                console.log(`Havuz: ${havuz.sinif} - ${havuz.ders} - ${havuz.konu}`);
            }
        }

        // API'de gönderilen parametreleri simüle et
        console.log('\n🔍 API SİMÜLASYONU:');
        const sinif = '1. Sınıf';
        const ders = 'Türkçe';
        const konu = 'Güzel Davranışlarımız';
        
        console.log(`Parametreler: sinif=${sinif}, ders=${ders}, konu=${konu}`);
        
        // Havuzu bul
        const havuz = await TestHavuzu.findOne({ sinif, ders, konu });
        console.log(`Bulunan havuz ID: ${havuz?._id}`);
        console.log(`Havuzdaki test sayısı: ${havuz?.testler.length}`);
        
        if (havuz && havuz.testler.length > 0) {
            // Havuzdaki testleri getir
            const tests = await Test.find({ 
                _id: { $in: havuz.testler }
            });
            
            console.log(`API'den dönen test sayısı: ${tests.length}`);
            tests.forEach((test, index) => {
                console.log(`  ${index + 1}. ${test.testAdi} (Konu: ${test.konu})`);
            });
        }

    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        await mongoose.disconnect();
        console.log('✅ MongoDB bağlantısı kapatıldı');
    }
}

debugHavuzSorunuDetayli(); 