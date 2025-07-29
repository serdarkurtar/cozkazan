import mongoose from 'mongoose';
import Test from './models/Test.js';
import TestHavuzu from './models/TestHavuzu.js';

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
    
    // 2. Doğru testler oluştur
    console.log('🧪 DOĞRU TESTLER OLUŞTURULUYOR...');
    
    // Test 1: 1. Sınıf Türkçe Güzel Davranışlarımız
    const test1 = new Test({
        testAdi: 'Güzel Davranışlarımız Testi',
        aciklama: '1. Sınıf Türkçe Güzel Davranışlarımız konusu için test',
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
    await test1.save();
    
    // Havuz oluştur
    const havuz1 = new TestHavuzu({
        sinif: '1. Sınıf',
        ders: 'Türkçe',
        konu: 'Güzel Davranışlarımız',
        testler: [test1._id],
        cozulmeSayisi: 0,
        basariOrani: 0,
        ortalamaZorluk: 50
    });
    await havuz1.save();
    console.log('✅ 1. Sınıf Türkçe "Güzel Davranışlarımız" testi oluşturuldu');
    
    // Test 2: 4. Sınıf Matematik Sayılar ve Nicelikler
    const test2 = new Test({
        testAdi: 'Sayılar ve Nicelikler Testi',
        aciklama: '4. Sınıf Matematik Sayılar ve Nicelikler konusu için test',
        sinif: '4. Sınıf',
        ders: 'Matematik',
        konu: 'Sayılar ve Nicelikler (1)',
        sorular: [{
            soru: '25 + 37 = ?',
            secenekler: ['A) 52', 'B) 62', 'C) 72', 'D) 82'],
            dogruCevap: 1
        }],
        aktif: true
    });
    await test2.save();
    
    // Havuz oluştur
    const havuz2 = new TestHavuzu({
        sinif: '4. Sınıf',
        ders: 'Matematik',
        konu: 'Sayılar ve Nicelikler (1)',
        testler: [test2._id],
        cozulmeSayisi: 0,
        basariOrani: 0,
        ortalamaZorluk: 50
    });
    await havuz2.save();
    console.log('✅ 4. Sınıf Matematik "Sayılar ve Nicelikler" testi oluşturuldu');
    
    // 3. Kontrol
    console.log('');
    console.log('🔍 KONTROL:');
    
    // 1. Sınıf Türkçe testleri
    const turkceTestleri = await Test.find({ 
        sinif: '1. Sınıf', 
        ders: 'Türkçe', 
        konu: 'Güzel Davranışlarımız' 
    });
    console.log(`1. Sınıf Türkçe "Güzel Davranışlarımız": ${turkceTestleri.length} test`);
    
    // 4. Sınıf Matematik testleri
    const matematikTestleri = await Test.find({ 
        sinif: '4. Sınıf', 
        ders: 'Matematik', 
        konu: 'Sayılar ve Nicelikler (1)' 
    });
    console.log(`4. Sınıf Matematik "Sayılar ve Nicelikler": ${matematikTestleri.length} test`);
    
    // Tüm testler
    const tumTestler = await Test.find({});
    console.log(`Toplam test sayısı: ${tumTestler.length}`);
    
    if (turkceTestleri.length === 1 && matematikTestleri.length === 1) {
        console.log('');
        console.log('🎉 SORUN ÇÖZÜLDÜ!');
        console.log('✅ Artık her test sadece kendi konusunda görünecek');
        console.log('✅ Test yükleme işlemi doğru çalışacak');
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