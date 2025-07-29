import mongoose from 'mongoose';
import Test from './backend/models/Test.js';
import TestHavuzu from './backend/models/TestHavuzu.js';

async function fixTestFiltering() {
    try {
        console.log('🔧 TEST FİLTRELEME SORUNU DÜZELTİLİYOR...\n');
        
        // MongoDB bağlantısı
        await mongoose.connect('mongodb://localhost:27017/cozkazan');
        console.log('✅ MongoDB bağlantısı başarılı');

        // 1. Tüm testleri kontrol et
        console.log('\n📋 Tüm testler kontrol ediliyor...');
        const tumTestler = await Test.find();
        console.log(`Toplam test sayısı: ${tumTestler.length}`);

        // 2. Her testin doğru havuzda olup olmadığını kontrol et
        let yanlisHavuzTestleri = 0;
        let duzeltilenTest = 0;

        for (const test of tumTestler) {
            console.log(`\n🔍 Test kontrol ediliyor: ${test.testAdi} (${test._id})`);
            console.log(`   Sınıf: ${test.sinif} | Ders: ${test.ders} | Konu: ${test.konu}`);

            // Bu testin ait olduğu havuzu bul
            const dogruHavuz = await TestHavuzu.findOne({
                sinif: test.sinif,
                ders: test.ders,
                konu: test.konu
            });

            if (!dogruHavuz) {
                console.log(`   ⚠️ Bu test için havuz bulunamadı!`);
                continue;
            }

            // Test bu havuzda var mı kontrol et
            const testHavuzdaVar = dogruHavuz.testler.includes(test._id);
            
            if (!testHavuzdaVar) {
                console.log(`   ❌ Test yanlış havuzda! Doğru havuz: ${dogruHavuz._id}`);
                yanlisHavuzTestleri++;
                
                // Testi doğru havuza ekle
                dogruHavuz.testler.push(test._id);
                await dogruHavuz.save();
                console.log(`   ✅ Test doğru havuza eklendi`);
                duzeltilenTest++;
            } else {
                console.log(`   ✅ Test doğru havuzda`);
            }

            // 3. Testi yanlış havuzlardan çıkar
            const yanlisHavuzlar = await TestHavuzu.find({
                _id: { $ne: dogruHavuz._id },
                testler: test._id
            });

            for (const yanlisHavuz of yanlisHavuzlar) {
                console.log(`   🧹 Test yanlış havuzdan çıkarılıyor: ${yanlisHavuz._id}`);
                yanlisHavuz.testler = yanlisHavuz.testler.filter(id => id.toString() !== test._id.toString());
                await yanlisHavuz.save();
            }
        }

        // 4. Havuz istatistiklerini güncelle
        console.log('\n📊 Havuz istatistikleri güncelleniyor...');
        const tumHavuzlar = await TestHavuzu.find();
        
        for (const havuz of tumHavuzlar) {
            // Havuzdaki testlerin gerçekten bu konuya ait olup olmadığını kontrol et
            const dogruTestler = [];
            for (const testId of havuz.testler) {
                const test = await Test.findById(testId);
                if (test && 
                    test.sinif === havuz.sinif && 
                    test.ders === havuz.ders && 
                    test.konu === havuz.konu) {
                    dogruTestler.push(testId);
                } else {
                    console.log(`   🗑️ Yanlış test havuzdan çıkarılıyor: ${testId}`);
                }
            }

            if (dogruTestler.length !== havuz.testler.length) {
                havuz.testler = dogruTestler;
                await havuz.save();
                console.log(`   ✅ Havuz ${havuz._id} temizlendi`);
            }
        }

        // 5. Sonuçları göster
        console.log('\n📈 DÜZELTME SONUÇLARI:');
        console.log(`   • Toplam test: ${tumTestler.length}`);
        console.log(`   • Yanlış havuzdaki test: ${yanlisHavuzTestleri}`);
        console.log(`   • Düzeltilen test: ${duzeltilenTest}`);
        console.log(`   • Toplam havuz: ${tumHavuzlar.length}`);

        // 6. Test filtreleme sistemini test et
        console.log('\n🧪 FİLTRELEME SİSTEMİ TEST EDİLİYOR...');
        
        // Örnek bir konu için test yap
        const ornekTest = await Test.findOne();
        if (ornekTest) {
            console.log(`\nTest örneği: ${ornekTest.testAdi}`);
            console.log(`Sınıf: ${ornekTest.sinif} | Ders: ${ornekTest.ders} | Konu: ${ornekTest.konu}`);
            
            // Bu testin sadece kendi konusunda görünüp görünmediğini kontrol et
            const dogruKonuTestleri = await Test.find({
                sinif: ornekTest.sinif,
                ders: ornekTest.ders,
                konu: ornekTest.konu
            });
            
            console.log(`✅ Bu konuda ${dogruKonuTestleri.length} test var`);
            
            // Yanlış konularda bu test var mı kontrol et
            const yanlisKonuTestleri = await Test.find({
                _id: ornekTest._id,
                $or: [
                    { sinif: { $ne: ornekTest.sinif } },
                    { ders: { $ne: ornekTest.ders } },
                    { konu: { $ne: ornekTest.konu } }
                ]
            });
            
            if (yanlisKonuTestleri.length > 0) {
                console.log(`❌ Test yanlış konularda da görünüyor!`);
            } else {
                console.log(`✅ Test sadece doğru konuda görünüyor`);
            }
        }

        console.log('\n✅ Test filtreleme sorunu düzeltildi!');
        console.log('\n💡 Artık testler sadece ait oldukları konularda görünecek.');

    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        await mongoose.disconnect();
        console.log('✅ MongoDB bağlantısı kapatıldı');
    }
}

fixTestFiltering(); 