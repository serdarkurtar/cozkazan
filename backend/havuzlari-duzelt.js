import mongoose from 'mongoose';

async function havuzlariDuzelt() {
    try {
        await mongoose.connect('mongodb://localhost:27017/cozkazan');
        console.log('✅ MongoDB bağlantısı başarılı');

        const Test = (await import('./models/Test.js')).default;
        const TestHavuzu = (await import('./models/TestHavuzu.js')).default;

        // Tüm testleri al
        const tumTestler = await Test.find();
        console.log(`📝 Toplam test: ${tumTestler.length}`);

        // Tüm havuzları al
        const tumHavuzlar = await TestHavuzu.find();
        console.log(`📦 Toplam havuz: ${tumHavuzlar.length}`);

        // Her havuzu düzelt
        for (const havuz of tumHavuzlar) {
            console.log(`\n🔧 Havuz düzeltiliyor: ${havuz.sinif} - ${havuz.ders} - ${havuz.konu}`);
            
            // Bu havuzun konusuna ait testi bul
            const dogruTest = tumTestler.find(test => 
                test.sinif === havuz.sinif && 
                test.ders === havuz.ders && 
                test.konu === havuz.konu
            );
            
            if (dogruTest) {
                console.log(`✅ Doğru test bulundu: ${dogruTest.testAdi}`);
                console.log(`   Test ID: ${dogruTest._id}`);
                
                // Havuzu güncelle - sadece doğru test ID'sini içersin
                havuz.testler = [dogruTest._id];
                await havuz.save();
                
                console.log(`✅ Havuz güncellendi - sadece 1 test ID'si`);
            } else {
                console.log(`❌ Bu havuz için test bulunamadı`);
                // Havuzu temizle
                havuz.testler = [];
                await havuz.save();
                console.log(`✅ Havuz temizlendi`);
            }
        }

        // Kontrol
        console.log('\n🔍 KONTROL:');
        const guncelHavuzlar = await TestHavuzu.find();
        
        guncelHavuzlar.forEach((havuz, index) => {
            console.log(`\n${index + 1}. ${havuz.sinif} - ${havuz.ders} - ${havuz.konu}`);
            console.log(`   Test sayısı: ${havuz.testler.length}`);
            
            if (havuz.testler.length > 0) {
                console.log(`   Test ID: ${havuz.testler[0]}`);
            }
        });

        console.log('\n🎉 HAVUZLAR DÜZELTİLDİ!');
        console.log('✅ Her havuzda sadece kendi testinin ID\'si var');

    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        await mongoose.disconnect();
        console.log('✅ MongoDB bağlantısı kapatıldı');
    }
}

havuzlariDuzelt(); 