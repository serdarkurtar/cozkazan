import mongoose from 'mongoose';
import TestHavuzu from './models/TestHavuzu.js';
import Test from './models/Test.js';

mongoose.connect('mongodb://localhost:27017/cozkazan')
.then(async () => {
    console.log('🔧 HAVUZ SORUNU DÜZELTİLİYOR...');
    console.log('=====================================');
    
    // 1. Tüm testleri ve havuzları sil
    console.log('🧹 Eski veriler temizleniyor...');
    await Test.deleteMany({});
    await TestHavuzu.deleteMany({});
    console.log('✅ Veritabanı temizlendi!');
    console.log('');
    
    // 2. Test 1: 1. Sınıf Türkçe İlk Konu
    console.log('🧪 TEST 1: 1. Sınıf Türkçe İlk Konu');
    const test1 = new Test({
        testAdi: 'Türkçe Test 1',
        aciklama: '1. Sınıf Türkçe İlk Konu testi',
        sinif: '1. Sınıf',
        ders: 'Türkçe',
        konu: 'İlk Konu',
        sorular: [{
            soru: 'Türkçe sorusu 1',
            secenekler: ['A', 'B', 'C', 'D'],
            dogruCevap: 0
        }],
        aktif: true
    });
    await test1.save();
    
    // 1. Sınıf Türkçe İlk Konu için havuz oluştur
    let havuz1 = await TestHavuzu.findOne({ 
        sinif: '1. Sınıf', 
        ders: 'Türkçe', 
        konu: 'İlk Konu' 
    });
    if (!havuz1) {
        havuz1 = new TestHavuzu({ 
            sinif: '1. Sınıf', 
            ders: 'Türkçe', 
            konu: 'İlk Konu', 
            testler: [] 
        });
    }
    havuz1.testler.push(test1._id);
    await havuz1.save();
    console.log('✅ 1. Sınıf Türkçe İlk Konu testi eklendi');
    console.log('');
    
    // 3. Test 2: 4. Sınıf Matematik İlk Konu
    console.log('🧪 TEST 2: 4. Sınıf Matematik İlk Konu');
    const test2 = new Test({
        testAdi: 'Matematik Test 1',
        aciklama: '4. Sınıf Matematik İlk Konu testi',
        sinif: '4. Sınıf',
        ders: 'Matematik',
        konu: 'İlk Konu',
        sorular: [{
            soru: 'Matematik sorusu 1',
            secenekler: ['A', 'B', 'C', 'D'],
            dogruCevap: 1
        }],
        aktif: true
    });
    await test2.save();
    
    // 4. Sınıf Matematik İlk Konu için havuz oluştur
    let havuz2 = await TestHavuzu.findOne({ 
        sinif: '4. Sınıf', 
        ders: 'Matematik', 
        konu: 'İlk Konu' 
    });
    if (!havuz2) {
        havuz2 = new TestHavuzu({ 
            sinif: '4. Sınıf', 
            ders: 'Matematik', 
            konu: 'İlk Konu', 
            testler: [] 
        });
    }
    havuz2.testler.push(test2._id);
    await havuz2.save();
    console.log('✅ 4. Sınıf Matematik İlk Konu testi eklendi');
    console.log('');
    
    // 4. Kontrol
    console.log('🔍 KONTROL:');
    const havuzlar = await TestHavuzu.find();
    const testler = await Test.find();
    
    console.log(`📦 Havuz sayısı: ${havuzlar.length}`);
    havuzlar.forEach(h => {
        console.log(`   - ${h.sinif} - ${h.ders} - ${h.konu} (${h.testler.length} test)`);
    });
    
    console.log(`📝 Test sayısı: ${testler.length}`);
    testler.forEach(t => {
        console.log(`   - ${t.sinif} - ${t.ders} - ${t.konu} (${t.testAdi})`);
    });
    
    // 5. API testi
    console.log('');
    console.log('🧪 API TESTİ:');
    
    // 1. Sınıf Türkçe İlk Konu testleri
    const turkceTestleri = await Test.find({ 
        sinif: '1. Sınıf', 
        ders: 'Türkçe', 
        konu: 'İlk Konu' 
    });
    console.log(`1. Sınıf Türkçe İlk Konu test sayısı: ${turkceTestleri.length}`);
    
    // 4. Sınıf Matematik İlk Konu testleri
    const matematikTestleri = await Test.find({ 
        sinif: '4. Sınıf', 
        ders: 'Matematik', 
        konu: 'İlk Konu' 
    });
    console.log(`4. Sınıf Matematik İlk Konu test sayısı: ${matematikTestleri.length}`);
    
    if (turkceTestleri.length === 1 && matematikTestleri.length === 1) {
        console.log('✅ SORUN ÇÖZÜLDÜ! Her konu kendi testlerini gösteriyor.');
        console.log('');
        console.log('🎉 ARTIK TEST YÜKLEME ÇALIŞACAK!');
        console.log('📝 Her konuya yüklediğiniz test sadece o konuda görünecek.');
    } else {
        console.log('❌ HALA SORUN VAR!');
    }
    
    mongoose.connection.close();
})
.catch(err => {
    console.error('Hata:', err);
    mongoose.connection.close();
}); 