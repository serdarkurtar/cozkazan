const mongoose = require('mongoose');

async function temizleVeDogruHavuzlarOlustur() {
    try {
        // ES Module'ü dinamik import ile yükle
        const { curriculumData } = await import('./data/curriculum-data.js');
        
        await mongoose.connect('mongodb://localhost:27017/cozkazan');
        console.log('🧹 VERİTABANI TEMİZLENİYOR...');
        console.log('=====================================');
        
        // Test ve TestHavuzu modellerini import et
        const Test = (await import('./models/Test.js')).default;
        const TestHavuzu = (await import('./models/TestHavuzu.js')).default;
        
        // TÜM VERİLERİ TEMİZLE
        await Test.deleteMany({});
        await TestHavuzu.deleteMany({});
        console.log('✅ Tüm testler ve havuzlar silindi');
        
        console.log('\n📦 YENİ HAVUZLAR OLUŞTURULUYOR...');
        console.log('=====================================');
        
        // Her konu için havuz oluştur
        for (const sinif of curriculumData.siniflar) {
            for (const ders of sinif.dersler) {
                for (const konu of ders.konular) {
                    const havuz = new TestHavuzu({
                        sinif: sinif.sinif,
                        ders: ders.ders,
                        konu: konu,
                        testler: [],
                        createdAt: new Date()
                    });
                    await havuz.save();
                    console.log(`✅ Havuz oluşturuldu: ${sinif.sinif} - ${ders.ders} - ${konu}`);
                }
            }
        }
        
        console.log('\n📝 ÖRNEK TESTLER EKLENİYOR...');
        console.log('=====================================');
        
        // Sadece 1. Sınıf Türkçe Güzel Davranışlarımız konusuna 1 test ekle
        const havuz = await TestHavuzu.findOne({ 
            sinif: '1. Sınıf', 
            ders: 'Türkçe', 
            konu: 'Güzel Davranışlarımız' 
        });
        
        if (havuz) {
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
            
            // Havuza testi ekle
            havuz.testler.push(test._id);
            await havuz.save();
            
            console.log(`✅ Test eklendi: ${test.aciklama}`);
            console.log(`   Havuz ID: ${havuz._id}`);
            console.log(`   Test ID: ${test._id}`);
        }
        
        console.log('\n🔍 KONTROL EDİLİYOR...');
        console.log('=====================================');
        
        // Kontrol et
        const tumHavuzlar = await TestHavuzu.find();
        const tumTestler = await Test.find();
        
        console.log(`📦 Toplam ${tumHavuzlar.length} havuz var`);
        console.log(`📝 Toplam ${tumTestler.length} test var`);
        
        // 1. Sınıf Türkçe Güzel Davranışlarımız kontrolü
        const kontrolHavuz = await TestHavuzu.findOne({ 
            sinif: '1. Sınıf', 
            ders: 'Türkçe', 
            konu: 'Güzel Davranışlarımız' 
        }).populate('testler');
        
        if (kontrolHavuz) {
            console.log(`\n✅ 1. Sınıf Türkçe Güzel Davranışlarımız:`);
            console.log(`   Havuz ID: ${kontrolHavuz._id}`);
            console.log(`   Test Sayısı: ${kontrolHavuz.testler.length}`);
            
            if (kontrolHavuz.testler.length > 0) {
                console.log(`   Test: ${kontrolHavuz.testler[0].aciklama}`);
                console.log(`   Test ID: ${kontrolHavuz.testler[0]._id}`);
                console.log(`   Test HavuzId: ${kontrolHavuz.testler[0].havuzId}`);
            }
        }
        
        console.log('\n🎉 TEMİZLİK TAMAMLANDI!');
        console.log('=====================================');
        console.log('✅ Veritabanı temizlendi');
        console.log('✅ Tüm havuzlar yeniden oluşturuldu');
        console.log('✅ Sadece 1 test eklendi (1. Sınıf Türkçe Güzel Davranışlarımız)');
        console.log('✅ Artık her konu sadece kendi testlerini gösterecek');
        
    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        await mongoose.disconnect();
        console.log('✅ MongoDB bağlantısı kapatıldı');
    }
}

temizleVeDogruHavuzlarOlustur(); 