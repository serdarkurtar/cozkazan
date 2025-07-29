import mongoose from 'mongoose';
import TestHavuzu from './models/TestHavuzu.js';
import Test from './models/Test.js';
import { curriculumData } from './data/curriculum-data.js';

mongoose.connect('mongodb://localhost:27017/cozkazan')
.then(async () => {
    console.log('🔧 GERÇEK MÜFREDAT HAVUZLARI OLUŞTURULUYOR...');
    console.log('================================================');
    
    // 1. Mevcut testleri ve havuzları temizle
    console.log('🧹 Eski veriler temizleniyor...');
    await Test.deleteMany({});
    await TestHavuzu.deleteMany({});
    console.log('✅ Veritabanı temizlendi!');
    console.log('');
    
    let toplamHavuz = 0;
    let toplamTest = 0;
    
    // 2. Müfredat verilerine göre havuzlar oluştur
    for (const sinifData of curriculumData) {
        const sinif = sinifData.sinif;
        console.log(`📚 ${sinif} işleniyor...`);
        
        for (const dersData of sinifData.dersler) {
            const ders = dersData.ders;
            console.log(`  📖 ${ders} işleniyor...`);
            
            for (const konu of dersData.konular) {
                console.log(`    📝 ${konu} havuzu oluşturuluyor...`);
                
                // Her konu için örnek test oluştur
                const test = new Test({
                    testAdi: `${konu} Testi`,
                    aciklama: `${sinif} ${ders} ${konu} konusu için örnek test`,
                    sinif: sinif,
                    ders: ders,
                    konu: konu,
                    sorular: [{
                        soru: `${konu} konusu ile ilgili örnek soru`,
                        secenekler: ['A) Birinci seçenek', 'B) İkinci seçenek', 'C) Üçüncü seçenek', 'D) Dördüncü seçenek'],
                        dogruCevap: 0
                    }],
                    aktif: true
                });
                await test.save();
                
                // Havuz oluştur
                const havuz = new TestHavuzu({
                    sinif: sinif,
                    ders: ders,
                    konu: konu,
                    testler: [test._id],
                    cozulmeSayisi: 0,
                    basariOrani: 0,
                    ortalamaZorluk: 50
                });
                await havuz.save();
                
                toplamHavuz++;
                toplamTest++;
                console.log(`    ✅ ${konu} havuzu oluşturuldu (1 test)`);
            }
        }
        console.log('');
    }
    
    // 3. Özet
    console.log('📊 ÖZET:');
    console.log(`📦 Toplam havuz sayısı: ${toplamHavuz}`);
    console.log(`📝 Toplam test sayısı: ${toplamTest}`);
    console.log('');
    
    // 4. Örnek kontrol
    console.log('🔍 ÖRNEK KONTROL:');
    const ornekHavuz = await TestHavuzu.findOne({ 
        sinif: '1. Sınıf', 
        ders: 'Türkçe', 
        konu: 'Güzel Davranışlarımız' 
    });
    
    if (ornekHavuz) {
        console.log('✅ 1. Sınıf Türkçe "Güzel Davranışlarımız" havuzu bulundu');
        console.log(`   Havuz ID: ${ornekHavuz._id}`);
        console.log(`   Test sayısı: ${ornekHavuz.testler.length}`);
    } else {
        console.log('❌ Örnek havuz bulunamadı');
    }
    
    console.log('');
    console.log('🎉 TÜM HAVUZLAR BAŞARIYLA OLUŞTURULDU!');
    console.log('📝 Artık her konunun altında sadece o konuya ait testler görünecek.');
    
    mongoose.connection.close();
})
.catch(err => {
    console.error('Hata:', err);
    mongoose.connection.close();
}); 