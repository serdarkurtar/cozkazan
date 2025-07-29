import mongoose from 'mongoose';

async function temizBasla() {
    try {
        await mongoose.connect('mongodb://localhost:27017/cozkazan');
        console.log('✅ MongoDB bağlantısı başarılı');

        const Test = (await import('./models/Test.js')).default;
        const TestHavuzu = (await import('./models/TestHavuzu.js')).default;

        // TÜM VERİLERİ SİL
        console.log('🧹 Tüm veriler siliniyor...');
        await Test.deleteMany({});
        await TestHavuzu.deleteMany({});
        console.log('✅ Tüm veriler silindi');

        // SADECE 3 TEST OLUŞTUR - HER BİRİ KENDİ HAVUZUNDA
        console.log('\n📝 Testler oluşturuluyor...');

        // 1. Güzel Davranışlarımız Testi
        const havuz1 = new TestHavuzu({
            sinif: '1. Sınıf',
            ders: 'Türkçe',
            konu: 'Güzel Davranışlarımız',
            testler: [],
            createdAt: new Date()
        });
        await havuz1.save();

        const test1 = new Test({
            testAdi: 'Güzel Davranışlarımız Testi',
            aciklama: 'Aşağıdakilerden hangisi güzel bir davranıştır?',
            sinif: '1. Sınıf',
            ders: 'Türkçe',
            konu: 'Güzel Davranışlarımız',
            havuzId: havuz1._id,
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
        await test1.save();
        havuz1.testler.push(test1._id);
        await havuz1.save();
        console.log('✅ Güzel Davranışlarımız testi oluşturuldu');

        // 2. Mustafa Kemal'den Atatürk'e Testi
        const havuz2 = new TestHavuzu({
            sinif: '1. Sınıf',
            ders: 'Türkçe',
            konu: 'Mustafa Kemal\'den Atatürk\'e',
            testler: [],
            createdAt: new Date()
        });
        await havuz2.save();

        const test2 = new Test({
            testAdi: 'Mustafa Kemal\'den Atatürk\'e Testi',
            aciklama: 'Atatürk ile ilgili test sorusu',
            sinif: '1. Sınıf',
            ders: 'Türkçe',
            konu: 'Mustafa Kemal\'den Atatürk\'e',
            havuzId: havuz2._id,
            sorular: [
                {
                    id: 1,
                    soru: 'Atatürk hangi yılda doğmuştur?',
                    secenekler: ['1880', '1881', '1882', '1883'],
                    dogruCevap: 1
                }
            ],
            aktif: true,
            createdAt: new Date()
        });
        await test2.save();
        havuz2.testler.push(test2._id);
        await havuz2.save();
        console.log('✅ Mustafa Kemal\'den Atatürk\'e testi oluşturuldu');

        // 3. Matematik Testi
        const havuz3 = new TestHavuzu({
            sinif: '1. Sınıf',
            ders: 'Matematik',
            konu: 'Sayılar ve Nicelikler (1)',
            testler: [],
            createdAt: new Date()
        });
        await havuz3.save();

        const test3 = new Test({
            testAdi: 'Sayılar ve Nicelikler Testi',
            aciklama: '35 + 12 işleminin sonucu kaçtır?',
            sinif: '1. Sınıf',
            ders: 'Matematik',
            konu: 'Sayılar ve Nicelikler (1)',
            havuzId: havuz3._id,
            sorular: [
                {
                    id: 1,
                    soru: '35 + 12 işleminin sonucu kaçtır?',
                    secenekler: ['47', '48', '49', '50'],
                    dogruCevap: 0
                }
            ],
            aktif: true,
            createdAt: new Date()
        });
        await test3.save();
        havuz3.testler.push(test3._id);
        await havuz3.save();
        console.log('✅ Matematik testi oluşturuldu');

        // KONTROL
        console.log('\n🔍 KONTROL:');
        const tumTestler = await Test.find();
        const tumHavuzlar = await TestHavuzu.find();
        
        console.log(`📝 Toplam test: ${tumTestler.length}`);
        console.log(`📦 Toplam havuz: ${tumHavuzlar.length}`);

        tumTestler.forEach((test, index) => {
            console.log(`${index + 1}. ${test.testAdi} (${test.sinif} - ${test.ders} - ${test.konu})`);
        });

        console.log('\n🎉 TEMİZ BAŞLANGIÇ TAMAMLANDI!');
        console.log('✅ Her test sadece kendi havuzunda');
        console.log('✅ Artık filtreleme doğru çalışacak');

    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        await mongoose.disconnect();
        console.log('✅ MongoDB bağlantısı kapatıldı');
    }
}

temizBasla(); 