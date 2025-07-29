import mongoose from 'mongoose';

async function havuzuTemizle() {
    try {
        await mongoose.connect('mongodb://localhost:27017/cozkazan');
        console.log('✅ MongoDB bağlantısı başarılı');

        const Test = (await import('./models/Test.js')).default;
        const TestHavuzu = (await import('./models/TestHavuzu.js')).default;

        // Güzel Davranışlarımız havuzunu bul
        const havuz = await TestHavuzu.findOne({ 
            sinif: '1. Sınıf', 
            ders: 'Türkçe', 
            konu: 'Güzel Davranışlarımız' 
        });

        if (havuz) {
            console.log('🔍 Güzel Davranışlarımız havuzu bulundu:');
            console.log(`   Havuz ID: ${havuz._id}`);
            console.log(`   Test sayısı: ${havuz.testler.length}`);
            console.log(`   Test ID'leri: ${havuz.testler.map(id => id.toString())}`);

            // Havuzdaki testleri kontrol et
            const havuzTestleri = await Test.find({ 
                _id: { $in: havuz.testler } 
            });

            console.log(`\n🔍 Havuzdaki gerçek testler:`);
            havuzTestleri.forEach((test, index) => {
                console.log(`   ${index + 1}. ${test.testAdi} (Konu: ${test.konu})`);
            });

            // Yanlış testleri havuzdan çıkar
            const dogruTestler = havuzTestleri.filter(test => 
                test.konu === 'Güzel Davranışlarımız'
            );

            console.log(`\n🧹 Havuz temizleniyor...`);
            console.log(`   Önceki test sayısı: ${havuz.testler.length}`);
            console.log(`   Doğru test sayısı: ${dogruTestler.length}`);

            // Havuzu güncelle
            havuz.testler = dogruTestler.map(test => test._id);
            await havuz.save();

            console.log(`   Sonraki test sayısı: ${havuz.testler.length}`);
            console.log('✅ Havuz temizlendi!');
        }

        // Kontrol et
        const temizHavuz = await TestHavuzu.findOne({ 
            sinif: '1. Sınıf', 
            ders: 'Türkçe', 
            konu: 'Güzel Davranışlarımız' 
        }).populate('testler');

        if (temizHavuz) {
            console.log(`\n✅ TEMİZLİK SONRASI:`);
            console.log(`   Test sayısı: ${temizHavuz.testler.length}`);
            
            if (temizHavuz.testler.length > 0) {
                temizHavuz.testler.forEach((test, index) => {
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

havuzuTemizle(); 