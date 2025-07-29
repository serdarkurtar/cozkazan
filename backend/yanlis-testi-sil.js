import mongoose from 'mongoose';

async function yanlisTestiSil() {
    try {
        await mongoose.connect('mongodb://localhost:27017/cozkazan');
        console.log('✅ MongoDB bağlantısı başarılı');

        const Test = (await import('./models/Test.js')).default;
        const TestHavuzu = (await import('./models/TestHavuzu.js')).default;

        // Yanlış testi bul ve sil
        const yanlisTest = await Test.findOne({ 
            _id: '6885177d2a36d6f262e88ba8' 
        });

        if (yanlisTest) {
            console.log('🗑️ Yanlış test bulundu:');
            console.log(`   ID: ${yanlisTest._id}`);
            console.log(`   Ad: ${yanlisTest.testAdi}`);
            console.log(`   Konu: ${yanlisTest.konu}`);
            console.log(`   HavuzId: ${yanlisTest.havuzId}`);
            
            // Testi sil
            await Test.findByIdAndDelete(yanlisTest._id);
            console.log('✅ Yanlış test silindi');
            
            // Eğer havuzId varsa, o havuzdan da çıkar
            if (yanlisTest.havuzId) {
                await TestHavuzu.updateOne(
                    { _id: yanlisTest.havuzId },
                    { $pull: { testler: yanlisTest._id } }
                );
                console.log('✅ Test havuzdan çıkarıldı');
            }
        } else {
            console.log('❌ Yanlış test bulunamadı');
        }

        // Kontrol et
        const tumTestler = await Test.find();
        console.log(`\n📝 Kalan test sayısı: ${tumTestler.length}`);
        
        tumTestler.forEach((test, index) => {
            console.log(`${index + 1}. ${test.testAdi} (Konu: ${test.konu})`);
        });

    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        await mongoose.disconnect();
        console.log('✅ MongoDB bağlantısı kapatıldı');
    }
}

yanlisTestiSil(); 