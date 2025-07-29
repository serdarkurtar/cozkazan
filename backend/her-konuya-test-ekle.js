import mongoose from 'mongoose';

async function herKonuyaTestEkle() {
    try {
        await mongoose.connect('mongodb://localhost:27017/cozkazan');
        console.log('✅ MongoDB bağlantısı başarılı');

        const Test = (await import('./models/Test.js')).default;
        const TestHavuzu = (await import('./models/TestHavuzu.js')).default;
        const { curriculumData } = await import('./data/curriculum-data.js');

        // Önce tüm testleri sil
        console.log('🧹 Tüm testler siliniyor...');
        await Test.deleteMany({});
        console.log('✅ Tüm testler silindi');

        // Her konuya 1 test ekle
        console.log('\n📝 Her konuya test ekleniyor...');
        let testSayisi = 0;

        for (const sinif of curriculumData) {
            for (const ders of sinif.dersler) {
                for (const konu of ders.konular) {
                    // Havuzu bul veya oluştur
                    let havuz = await TestHavuzu.findOne({ 
                        sinif: sinif.sinif, 
                        ders: ders.ders, 
                        konu: konu 
                    });

                    if (!havuz) {
                        havuz = new TestHavuzu({
                            sinif: sinif.sinif,
                            ders: ders.ders,
                            konu: konu,
                            testler: [],
                            createdAt: new Date()
                        });
                        await havuz.save();
                    }

                    // Test oluştur
                    const test = new Test({
                        testAdi: `${konu} Testi`,
                        aciklama: `${sinif.sinif} ${ders.ders} ${konu} konusu testi`,
                        sinif: sinif.sinif,
                        ders: ders.ders,
                        konu: konu,
                        havuzId: havuz._id,
                        sorular: [
                            {
                                id: 1,
                                soru: `${konu} konusu ile ilgili test sorusu`,
                                secenekler: ['Seçenek A', 'Seçenek B', 'Seçenek C', 'Seçenek D'],
                                dogruCevap: 0
                            }
                        ],
                        aktif: true,
                        createdAt: new Date()
                    });

                    await test.save();
                    
                    // Havuza testi ekle
                    havuz.testler.push(test._id);
                    await havuz.save();

                    testSayisi++;
                    console.log(`✅ ${sinif.sinif} - ${ders.ders} - ${konu}: Test eklendi`);
                }
            }
        }

        console.log(`\n🎉 TOPLAM ${testSayisi} TEST EKLENDİ!`);

        // Kontrol et
        const tumTestler = await Test.find();
        const tumHavuzlar = await TestHavuzu.find();
        
        console.log(`\n🔍 KONTROL:`);
        console.log(`📝 Toplam test: ${tumTestler.length}`);
        console.log(`📦 Toplam havuz: ${tumHavuzlar.length}`);

        // İlk 5 testi göster
        console.log(`\n📝 İLK 5 TEST:`);
        tumTestler.slice(0, 5).forEach((test, index) => {
            console.log(`${index + 1}. ${test.testAdi} (${test.sinif} - ${test.ders} - ${test.konu})`);
        });

    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        await mongoose.disconnect();
        console.log('✅ MongoDB bağlantısı kapatıldı');
    }
}

herKonuyaTestEkle(); 