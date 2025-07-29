import mongoose from 'mongoose';

async function manuelTemizlik() {
    try {
        await mongoose.connect('mongodb://localhost:27017/cozkazan');
        console.log('✅ MongoDB bağlantısı başarılı');

        const Test = (await import('./models/Test.js')).default;
        const TestHavuzu = (await import('./models/TestHavuzu.js')).default;

        // TÜM VERİLERİ SİL
        console.log('🧹 Tüm testler siliniyor...');
        await Test.deleteMany({});
        console.log('✅ Tüm testler silindi');

        console.log('🧹 Tüm havuzlar siliniyor...');
        await TestHavuzu.deleteMany({});
        console.log('✅ Tüm havuzlar silindi');

        // SADECE 1 HAVUZ VE 1 TEST OLUŞTUR
        console.log('📦 Yeni havuz oluşturuluyor...');
        const havuz = new TestHavuzu({
            sinif: '1. Sınıf',
            ders: 'Türkçe',
            konu: 'Güzel Davranışlarımız',
            testler: [],
            createdAt: new Date()
        });
        await havuz.save();
        console.log('✅ Havuz oluşturuldu');

        console.log('📝 Test oluşturuluyor...');
        const test = new Test({
            testAdi: 'Güzel Davranışlarımız Testi',
            aciklama: 'Aşağıdakilerden hangisi güzel bir davranıştır?',
            sinif: '1. Sınıf',
            ders: 'Türkçe',
            konu: 'Güzel Davranışlarımız',
            havuzId: havuz._id,
            sorular: [
                {
                    id: 1,
                    soru: 'Aşağıdakilerden hangisi güzel bir davranıştır?',
                    secenekler: ['Başkalarını rahatsız etmek', 'Selam vermek', 'Yüksek sesle konuşmak', 'Çöpleri yere atmak'],
                    dogruCevap: 1
                }
            ],
            aktif: true,
            createdAt: new Date()
        });
        await test.save();
        console.log('✅ Test oluşturuldu');

        // Havuza testi ekle
        havuz.testler.push(test._id);
        await havuz.save();
        console.log('✅ Test havuzuna eklendi');

        // KONTROL
        const tumTestler = await Test.find();
        const tumHavuzlar = await TestHavuzu.find();
        
        console.log('\n🔍 KONTROL:');
        console.log(`📝 Toplam test: ${tumTestler.length}`);
        console.log(`📦 Toplam havuz: ${tumHavuzlar.length}`);
        
        if (tumTestler.length > 0) {
            console.log(`\n📝 Test detayı:`);
            console.log(`   ID: ${tumTestler[0]._id}`);
            console.log(`   Ad: ${tumTestler[0].testAdi}`);
            console.log(`   Konu: ${tumTestler[0].konu}`);
            console.log(`   HavuzId: ${tumTestler[0].havuzId}`);
        }

        console.log('\n🎉 TEMİZLİK TAMAMLANDI!');

    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        await mongoose.disconnect();
        console.log('✅ MongoDB bağlantısı kapatıldı');
    }
}

manuelTemizlik(); 