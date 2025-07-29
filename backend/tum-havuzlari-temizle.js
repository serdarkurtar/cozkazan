import mongoose from 'mongoose';

async function tumHavuzlariTemizle() {
    try {
        await mongoose.connect('mongodb://localhost:27017/cozkazan');
        console.log('✅ MongoDB bağlantısı başarılı');

        const Test = (await import('./models/Test.js')).default;
        const TestHavuzu = (await import('./models/TestHavuzu.js')).default;

        // Tüm havuzları kontrol et
        console.log('\n🔍 TÜM HAVUZLAR KONTROL EDİLİYOR...');
        const tumHavuzlar = await TestHavuzu.find().populate('testler');
        
        let toplamYanlisTest = 0;
        
        for (const havuz of tumHavuzlar) {
            console.log(`\n📦 HAVUZ: ${havuz.sinif} - ${havuz.ders} - ${havuz.konu}`);
            console.log(`   Havuz ID: ${havuz._id}`);
            console.log(`   Test sayısı: ${havuz.testler.length}`);
            
            if (havuz.testler.length > 0) {
                // Bu havuzdaki testleri kontrol et
                const dogruTestler = havuz.testler.filter(test => 
                    test.konu === havuz.konu
                );
                
                const yanlisTestler = havuz.testler.filter(test => 
                    test.konu !== havuz.konu
                );
                
                if (yanlisTestler.length > 0) {
                    console.log(`   ❌ YANLIŞ TESTLER: ${yanlisTestler.length}`);
                    yanlisTestler.forEach(test => {
                        console.log(`      - ${test.testAdi} (Konu: ${test.konu})`);
                    });
                    
                    // Havuzu temizle
                    havuz.testler = dogruTestler.map(test => test._id);
                    await havuz.save();
                    
                    toplamYanlisTest += yanlisTestler.length;
                    console.log(`   ✅ Havuz temizlendi. Yeni test sayısı: ${havuz.testler.length}`);
                } else {
                    console.log(`   ✅ Havuz temiz (${havuz.testler.length} test)`);
                }
            }
        }

        console.log(`\n🎉 TOPLAM ${toplamYanlisTest} YANLIŞ TEST TEMİZLENDİ!`);

        // Kontrol et
        console.log('\n🔍 TEMİZLİK SONRASI KONTROL:');
        const temizHavuzlar = await TestHavuzu.find().populate('testler');
        
        temizHavuzlar.forEach((havuz, index) => {
            console.log(`${index + 1}. ${havuz.sinif} - ${havuz.ders} - ${havuz.konu}: ${havuz.testler.length} test`);
        });

        // Güzel Davranışlarımız özel kontrol
        const guzelDavranislarHavuz = await TestHavuzu.findOne({ 
            sinif: '1. Sınıf', 
            ders: 'Türkçe', 
            konu: 'Güzel Davranışlarımız' 
        }).populate('testler');
        
        if (guzelDavranislarHavuz) {
            console.log(`\n✅ GÜZEL DAVRANIŞLARIMIZ HAVUZU:`);
            console.log(`   Test sayısı: ${guzelDavranislarHavuz.testler.length}`);
            
            if (guzelDavranislarHavuz.testler.length > 0) {
                guzelDavranislarHavuz.testler.forEach((test, index) => {
                    console.log(`   ${index + 1}. ${test.testAdi} (Konu: ${test.konu})`);
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

tumHavuzlariTemizle(); 