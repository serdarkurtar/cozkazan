import mongoose from 'mongoose';
import Test from './models/Test.js';

mongoose.connect('mongodb://localhost:27017/cozkazan')
.then(async () => {
    console.log('🔍 MEVCUT TESTLER KONTROL EDİLİYOR...');
    console.log('=====================================');
    
    const tests = await Test.find().limit(10);
    console.log(`📝 Toplam test sayısı: ${await Test.countDocuments()}`);
    console.log('');
    
    console.log('📋 İlk 10 test:');
    tests.forEach((test, index) => {
        console.log(`${index + 1}. ${test.sinif} | ${test.ders} | ${test.konu} | ${test.testAdi}`);
    });
    
    console.log('');
    console.log('🔍 KONU BAZLI KONTROL:');
    
    // 1. Sınıf Türkçe Güzel Davranışlarımız testleri
    const turkceTestleri = await Test.find({ 
        sinif: '1. Sınıf', 
        ders: 'Türkçe', 
        konu: 'Güzel Davranışlarımız' 
    });
    console.log(`1. Sınıf Türkçe "Güzel Davranışlarımız": ${turkceTestleri.length} test`);
    
    // 4. Sınıf Matematik testleri
    const matematikTestleri = await Test.find({ 
        sinif: '4. Sınıf', 
        ders: 'Matematik' 
    });
    console.log(`4. Sınıf Matematik: ${matematikTestleri.length} test`);
    
    // Tüm testler
    const tumTestler = await Test.find({});
    console.log(`Tüm testler: ${tumTestler.length} test`);
    
    mongoose.connection.close();
})
.catch(err => {
    console.error('Hata:', err);
    mongoose.connection.close();
}); 