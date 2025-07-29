const mongoose = require('mongoose');

// MongoDB bağlantısı
mongoose.connect('mongodb://localhost:27017/cozkazan', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function tamamenTemizle() {
    try {
        console.log('🧹 TAMAMEN TEMİZLENİYOR...\n');
        
        // ES module modellerini dinamik import ile yükle
        const Test = (await import('./models/Test.js')).default;
        const TestHavuzu = (await import('./models/TestHavuzu.js')).default;
        
        // 1. TÜM TESTLERİ SİL
        console.log('🗑️ TÜM TESTLER SİLİNİYOR...');
        const testSilmeSonucu = await Test.deleteMany({});
        console.log(`✅ ${testSilmeSonucu.deletedCount} test silindi`);
        
        // 2. TÜM TEST HAVUZLARINI SİL
        console.log('🗑️ TÜM TEST HAVUZLARI SİLİNİYOR...');
        const havuzSilmeSonucu = await TestHavuzu.deleteMany({});
        console.log(`✅ ${havuzSilmeSonucu.deletedCount} test havuzu silindi`);
        
        // 3. KONTROL ET
        const kalanTestler = await Test.find({});
        const kalanHavuzlar = await TestHavuzu.find({});
        
        console.log('\n📊 TEMİZLİK KONTROLÜ:');
        console.log(`   Kalan Test: ${kalanTestler.length}`);
        console.log(`   Kalan Havuz: ${kalanHavuzlar.length}`);
        
        if (kalanTestler.length === 0 && kalanHavuzlar.length === 0) {
            console.log('\n🎉 TAMAMEN TEMİZLENDİ!');
            console.log('✅ Artık sıfırdan başlayabiliriz.');
        } else {
            console.log('\n❌ HALA VERİ KALDI!');
        }
        
    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        mongoose.connection.close();
    }
}

tamamenTemizle(); 