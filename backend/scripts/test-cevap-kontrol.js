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

// Test cevaplarını kontrol et
async function testCevapKontrol() {
    try {
        console.log('🔍 Test cevapları kontrol ediliyor...\n');
        
        const testAdi = "1-Sinif-Turkce-Sorumluluklarimizin-Farkindayiz-100-Test";
        
        // Testi bul
        const testlerSnapshot = await getDocs(
            query(collection(db, 'testler'), where('ad', '==', testAdi))
        );
        
        if (testlerSnapshot.docs.length === 0) {
            console.log('❌ Test bulunamadı!');
            return;
        }
        
        const testDoc = testlerSnapshot.docs[0];
        const testData = testDoc.data();
        
        console.log('✅ Test bulundu:');
        console.log(`   ID: ${testDoc.id}`);
        console.log(`   Ad: ${testData.ad}`);
        console.log(`   Sınıf: ${testData.sinifAdi}`);
        console.log(`   Ders: ${testData.dersAdi}`);
        console.log(`   Konu: ${testData.konuAdi}`);
        console.log(`   Soru sayısı: ${testData.sorular?.length || 0}`);
        
        if (testData.sorular && testData.sorular.length > 0) {
            console.log('\n📝 İlk 5 soru analizi:');
            console.log('='.repeat(60));
            
            testData.sorular.slice(0, 5).forEach((soru, index) => {
                console.log(`\n${index + 1}. Soru:`);
                console.log(`   Soru: ${soru.soruMetni}`);
                console.log(`   A) ${soru.secenekA}`);
                console.log(`   B) ${soru.secenekB}`);
                console.log(`   C) ${soru.secenekC}`);
                console.log(`   D) ${soru.secenekD}`);
                console.log(`   Doğru Cevap: "${soru.dogruCevap}" (Tip: ${typeof soru.dogruCevap})`);
                console.log(`   Doğru Cevap Uzunluğu: ${soru.dogruCevap?.length || 0}`);
                console.log(`   Doğru Cevap ASCII: ${soru.dogruCevap?.charCodeAt(0) || 'N/A'}`);
                
                // Flutter'da nasıl karşılaştırılacağını göster
                const flutterKarsilastirma = `cevap == '${soru.dogruCevap}'`;
                console.log(`   Flutter Karşılaştırması: ${flutterKarsilastirma}`);
            });
            
            // Tüm doğru cevapları analiz et
            console.log('\n📊 TÜM DOĞRU CEVAPLAR ANALİZİ:');
            console.log('='.repeat(60));
            
            const dogruCevaplar = testData.sorular.map(s => s.dogruCevap);
            const benzersizCevaplar = [...new Set(dogruCevaplar)];
            
            console.log(`Toplam soru: ${dogruCevaplar.length}`);
            console.log(`Benzersiz doğru cevap: ${benzersizCevaplar.length}`);
            console.log(`Benzersiz cevaplar: ${benzersizCevaplar.join(', ')}`);
            
            // Her cevap tipini say
            const cevapSayilari = {};
            dogruCevaplar.forEach(cevap => {
                cevapSayilari[cevap] = (cevapSayilari[cevap] || 0) + 1;
            });
            
            console.log('\nCevap dağılımı:');
            Object.entries(cevapSayilari).forEach(([cevap, sayi]) => {
                console.log(`   "${cevap}": ${sayi} soru`);
            });
            
            // Sorunlu cevapları bul
            const sorunluCevaplar = dogruCevaplar.filter(cevap => 
                !['A', 'B', 'C', 'D', 'a', 'b', 'c', 'd'].includes(cevap)
            );
            
            if (sorunluCevaplar.length > 0) {
                console.log('\n⚠️  SORUNLU CEVAPLAR:');
                console.log(`   ${sorunluCevaplar.join(', ')}`);
            }
            
        } else {
            console.log('❌ Test bulundu ama soruları yok!');
        }
        
    } catch (error) {
        console.error('❌ Kontrol sırasında hata:', error);
    }
}

// Kontrolü başlat
testCevapKontrol(); 