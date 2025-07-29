const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where } = require('firebase/firestore');

// Firebase yapılandırması
const firebaseConfig = {
    apiKey: "AIzaSyBqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXq",
    authDomain: "cozkazan-app.firebaseapp.com",
    projectId: "cozkazan-app",
    storageBucket: "cozkazan-app.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdefghijklmnop"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Test durumunu kontrol et
async function testDurumuKontrol() {
    try {
        console.log('🔍 Test durumu kontrol ediliyor...\n');
        
        const testAdi = "1-Sinif-Turkce-Sorumluluklarimizin-Farkindayiz-100-Test";
        
        // Testler koleksiyonunda ara
        console.log(`📊 Test aranıyor: ${testAdi}`);
        
        const testlerSnapshot = await getDocs(
            query(collection(db, 'testler'), where('ad', '==', testAdi))
        );
        
        console.log(`📋 Testler koleksiyonunda ${testlerSnapshot.docs.length} sonuç bulundu`);
        
        if (testlerSnapshot.docs.length > 0) {
            const testDoc = testlerSnapshot.docs[0];
            const testData = testDoc.data();
            
            console.log('\n✅ TEST BULUNDU:');
            console.log('='.repeat(50));
            console.log(`📝 Test Adı: ${testData.ad}`);
            console.log(`🏫 Sınıf: ${testData.sinifAdi}`);
            console.log(`📖 Ders: ${testData.dersAdi}`);
            console.log(`📚 Konu: ${testData.konuAdi}`);
            console.log(`📊 Soru Sayısı: ${testData.sorular?.length || 0}`);
            console.log(`🆔 Document ID: ${testDoc.id}`);
            
            if (testData.sorular && testData.sorular.length > 0) {
                console.log('\n📝 İlk 3 soru örneği:');
                testData.sorular.slice(0, 3).forEach((soru, index) => {
                    console.log(`\n  ${index + 1}. Soru:`);
                    console.log(`     Soru: ${soru.soruMetni}`);
                    console.log(`     A) ${soru.secenekler[0]}`);
                    console.log(`     B) ${soru.secenekler[1]}`);
                    console.log(`     C) ${soru.secenekler[2]}`);
                    console.log(`     D) ${soru.secenekler[3]}`);
                    console.log(`     Doğru: ${soru.dogruCevap}`);
                });
            } else {
                console.log('\n❌ SORUN: Test bulundu ama soruları yok!');
            }
        } else {
            console.log('\n❌ TEST BULUNAMADI!');
        }
        
        // Sorular koleksiyonunda da ara
        console.log('\n🔍 Sorular koleksiyonunda aranıyor...');
        
        const sorularSnapshot = await getDocs(
            query(collection(db, 'sorular'), where('testAdi', '==', testAdi))
        );
        
        console.log(`📋 Sorular koleksiyonunda ${sorularSnapshot.docs.length} sonuç bulundu`);
        
        if (sorularSnapshot.docs.length > 0) {
            console.log('\n✅ SORULAR BULUNDU:');
            console.log('='.repeat(50));
            
            sorularSnapshot.docs.forEach((doc, index) => {
                const soruData = doc.data();
                console.log(`\n📝 Soru ${index + 1}:`);
                console.log(`     Soru: ${soruData.soruMetni}`);
                console.log(`     A) ${soruData.secenekler[0]}`);
                console.log(`     B) ${soruData.secenekler[1]}`);
                console.log(`     C) ${soruData.secenekler[2]}`);
                console.log(`     D) ${soruData.secenekler[3]}`);
                console.log(`     Doğru: ${soruData.dogruCevap}`);
            });
        }
        
        // Test sonuçları koleksiyonunda ara
        console.log('\n🔍 Test sonuçları koleksiyonunda aranıyor...');
        
        const testSonuclariSnapshot = await getDocs(collection(db, 'test_sonuclari'));
        
        console.log(`📋 Test sonuçları koleksiyonunda ${testSonuclariSnapshot.docs.length} doküman bulundu`);
        
        let testAtanmis = false;
        testSonuclariSnapshot.docs.forEach(doc => {
            const data = doc.data();
            if (data.testler && Array.isArray(data.testler)) {
                const testVar = data.testler.some(test => 
                    test.ad === testAdi || test.testAdi === testAdi
                );
                if (testVar) {
                    console.log(`\n✅ Test atanmış: ${doc.id}`);
                    console.log(`   Kullanıcı: ${data.userId}`);
                    console.log(`   Çocuk: ${data.cocukId}`);
                    testAtanmis = true;
                }
            }
        });
        
        if (!testAtanmis) {
            console.log('\n❌ Test hiçbir çocuğa atanmamış!');
        }
        
        // Genel özet
        console.log('\n\n📋 GENEL ÖZET:');
        console.log('='.repeat(50));
        console.log(`✅ Test mevcut: ${testlerSnapshot.docs.length > 0 ? 'Evet' : 'Hayır'}`);
        console.log(`✅ Sorular mevcut: ${testlerSnapshot.docs.length > 0 && testlerSnapshot.docs[0].data().sorular?.length > 0 ? 'Evet' : 'Hayır'}`);
        console.log(`✅ Ayrı sorular koleksiyonu: ${sorularSnapshot.docs.length > 0 ? 'Evet' : 'Hayır'}`);
        console.log(`✅ Test atanmış: ${testAtanmis ? 'Evet' : 'Hayır'}`);
        
        if (testlerSnapshot.docs.length === 0) {
            console.log('\n🔧 ÇÖZÜM: Test Firebase\'e yüklenmemiş!');
        } else if (!testlerSnapshot.docs[0].data().sorular?.length > 0 && sorularSnapshot.docs.length === 0) {
            console.log('\n🔧 ÇÖZÜM: Test var ama soruları yok!');
        } else if (!testAtanmis) {
            console.log('\n🔧 ÇÖZÜM: Test var ama çocuğa atanmamış!');
        } else {
            console.log('\n🔧 ÇÖZÜM: Flutter kodunda sorun olabilir!');
        }
        
    } catch (error) {
        console.error('❌ Kontrol sırasında hata:', error);
    }
}

// Kontrolü başlat
testDurumuKontrol(); 