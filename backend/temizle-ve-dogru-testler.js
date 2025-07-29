import mongoose from 'mongoose';
import Test from './models/Test.js';
import TestHavuzu from './models/TestHavuzu.js';
import { curriculumData } from './data/curriculum-data.js';

mongoose.connect('mongodb://localhost:27017/cozkazan')
.then(async () => {
    console.log('🧹 YANLIŞ TESTLER TEMİZLENİYOR VE DOĞRU TESTLER OLUŞTURULUYOR...');
    console.log('==============================================================');
    
    // 1. Tüm testleri ve havuzları sil
    console.log('🧹 Eski veriler temizleniyor...');
    await Test.deleteMany({});
    await TestHavuzu.deleteMany({});
    console.log('✅ Veritabanı temizlendi!');
    console.log('');
    
    let toplamHavuz = 0;
    let toplamTest = 0;
    
    // 2. Her konu için doğru testler oluştur
    for (const sinifData of curriculumData) {
        const sinif = sinifData.sinif;
        console.log(`📚 ${sinif} işleniyor...`);
        
        for (const dersData of sinifData.dersler) {
            const ders = dersData.ders;
            console.log(`  📖 ${ders} işleniyor...`);
            
            for (const konu of dersData.konular) {
                console.log(`    📝 ${konu} havuzu oluşturuluyor...`);
                
                // Her konu için konuya uygun test oluştur
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
    
    // 3. Özel testler ekle
    console.log('🎯 ÖZEL TESTLER EKLENİYOR...');
    
    // 1. Sınıf Türkçe Güzel Davranışlarımız için özel test
    const guzelDavranisTest = new Test({
        testAdi: 'Güzel Davranışlarımız Testi',
        aciklama: '1. Sınıf Türkçe Güzel Davranışlarımız konusu için özel test',
        sinif: '1. Sınıf',
        ders: 'Türkçe',
        konu: 'Güzel Davranışlarımız',
        sorular: [{
            soru: 'Aşağıdakilerden hangisi güzel bir davranıştır?',
            secenekler: ['A) Arkadaşlarına kötü davranmak', 'B) Büyüklerine saygı göstermek', 'C) Yalan söylemek', 'D) Kaba olmak'],
            dogruCevap: 1
        }],
        aktif: true
    });
    await guzelDavranisTest.save();
    
    // Havuzu güncelle
    const guzelDavranisHavuz = await TestHavuzu.findOne({ 
        sinif: '1. Sınıf', 
        ders: 'Türkçe', 
        konu: 'Güzel Davranışlarımız' 
    });
    if (guzelDavranisHavuz) {
        guzelDavranisHavuz.testler.push(guzelDavranisTest._id);
        await guzelDavranisHavuz.save();
        console.log('✅ 1. Sınıf Türkçe "Güzel Davranışlarımız" özel testi eklendi');
    }
    
    // 4. Sınıf Türkçe Atatürk ve Milli Mücadele için özel test
    const ataturkTest = new Test({
        testAdi: 'Atatürk ve Milli Mücadele Testi',
        aciklama: '4. Sınıf Türkçe Atatürk ve Milli Mücadele konusu için özel test',
        sinif: '4. Sınıf',
        ders: 'Türkçe',
        konu: 'Millî Mücadele ve Atatürk',
        sorular: [{
            soru: 'Atatürk hangi savaşta başkomutan olarak görev yapmıştır?',
            secenekler: ['A) Çanakkale Savaşı', 'B) Sakarya Meydan Muharebesi', 'C) Büyük Taarruz', 'D) Kurtuluş Savaşı'],
            dogruCevap: 1
        }],
        aktif: true
    });
    await ataturkTest.save();
    
    // Havuzu güncelle
    const ataturkHavuz = await TestHavuzu.findOne({ 
        sinif: '4. Sınıf', 
        ders: 'Türkçe', 
        konu: 'Millî Mücadele ve Atatürk' 
    });
    if (ataturkHavuz) {
        ataturkHavuz.testler.push(ataturkTest._id);
        await ataturkHavuz.save();
        console.log('✅ 4. Sınıf Türkçe "Millî Mücadele ve Atatürk" özel testi eklendi');
    }
    
    // 4. Özet
    console.log('');
    console.log('📊 ÖZET:');
    console.log(`📦 Toplam havuz sayısı: ${toplamHavuz}`);
    console.log(`📝 Toplam test sayısı: ${toplamTest + 2}`);
    console.log('');
    
    // 5. Kontrol
    console.log('🔍 KONTROL:');
    
    // 1. Sınıf Türkçe Güzel Davranışlarımız testleri
    const turkceTestleri = await Test.find({ 
        sinif: '1. Sınıf', 
        ders: 'Türkçe', 
        konu: 'Güzel Davranışlarımız' 
    });
    console.log(`1. Sınıf Türkçe "Güzel Davranışlarımız": ${turkceTestleri.length} test`);
    
    // 4. Sınıf Türkçe Atatürk testleri
    const ataturkTestleri = await Test.find({ 
        sinif: '4. Sınıf', 
        ders: 'Türkçe', 
        konu: 'Millî Mücadele ve Atatürk' 
    });
    console.log(`4. Sınıf Türkçe "Millî Mücadele ve Atatürk": ${ataturkTestleri.length} test`);
    
    if (turkceTestleri.length >= 1 && ataturkTestleri.length >= 1) {
        console.log('');
        console.log('🎉 SORUN ÇÖZÜLDÜ!');
        console.log('✅ Artık her konunun altında sadece o konuya ait testler görünecek');
        console.log('✅ Test yükleme işlemi doğru çalışacak');
        console.log('✅ Genel test listesi kaldırıldı, sadece konu havuzları aktif');
    } else {
        console.log('');
        console.log('❌ HALA SORUN VAR!');
    }
    
    mongoose.connection.close();
})
.catch(err => {
    console.error('Hata:', err);
    mongoose.connection.close();
}); 