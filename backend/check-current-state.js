const mongoose = require('mongoose');
const TestHavuzu = require('./models/TestHavuzu');
const Test = require('./models/Test');

mongoose.connect('mongodb://localhost:27017/cozkazan')
.then(async () => {
    console.log('🔍 Test Havuzları:');
    const havuzlar = await TestHavuzu.find();
    havuzlar.forEach(h => {
        console.log(`📦 ${h.sinif} - ${h.ders} - ${h.konu} (Test sayısı: ${h.testler.length})`);
    });
    
    console.log('\n🔍 Testler:');
    const testler = await Test.find();
    testler.forEach(t => {
        console.log(`📝 ${t.sinif} - ${t.ders} - ${t.konu} - ${t.soruMetni.substring(0,30)}...`);
    });
    
    mongoose.connection.close();
})
.catch(err => {
    console.error('Hata:', err);
    mongoose.connection.close();
}); 