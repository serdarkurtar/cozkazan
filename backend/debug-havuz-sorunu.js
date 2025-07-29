import mongoose from 'mongoose';

async function debugHavuzSorunu() {
    try {
        await mongoose.connect('mongodb://localhost:27017/cozkazan');
        console.log('✅ MongoDB bağlantısı başarılı');

        const Test = (await import('./models/Test.js')).default;
        const TestHavuzu = (await import('./models/TestHavuzu.js')).default;

        console.log('\n🔍 TÜM TESTLER:');
        const tumTestler = await Test.find();
        tumTestler.forEach((test, index) => {
            console.log(`${index + 1}. Test ID: ${test._id}`);
            console.log(`   Ad: ${test.testAdi}`);
            console.log(`   Konu: ${test.konu}`);
            console.log(`   HavuzId: ${test.havuzId}`);
            console.log('   ---');
        });

        console.log('\n🔍 TÜM HAVUZLAR:');
        const tumHavuzlar = await TestHavuzu.find().populate('testler');
        tumHavuzlar.forEach((havuz, index) => {
            console.log(`${index + 1}. Havuz: ${havuz.sinif} - ${havuz.ders} - ${havuz.konu}`);
            console.log(`   Havuz ID: ${havuz._id}`);
            console.log(`   Test Sayısı: ${havuz.testler.length}`);
            
            if (havuz.testler.length > 0) {
                console.log('   Testler:');
                havuz.testler.forEach((test, testIndex) => {
                    console.log(`     ${testIndex + 1}. ${test.testAdi} (ID: ${test._id})`);
                });
            }
            console.log('   ---');
        });

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
                });
            }
        }

    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        await mongoose.disconnect();
        console.log('✅ MongoDB bağlantısı kapatıldı');
    }
}

debugHavuzSorunu(); 