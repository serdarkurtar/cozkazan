const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, deleteDoc, doc, query, where } = require('firebase/firestore');

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

// Tüm test verilerini temizle
async function testleriTemizle() {
    try {
        console.log('🧹 Test verileri temizleniyor...');
        
        let silinenTestSayisi = 0;
        let silinenSonucSayisi = 0;
        let silinenAyarlarSayisi = 0;
        
        // 1. test_sonuclari koleksiyonunu temizle
        console.log('\n📊 test_sonuclari koleksiyonu temizleniyor...');
        const testSonuclariSnapshot = await getDocs(collection(db, 'test_sonuclari'));
        
        for (const doc of testSonuclariSnapshot.docs) {
            await deleteDoc(doc.ref);
            silinenSonucSayisi++;
            console.log(`✅ test_sonuclari silindi: ${doc.id}`);
        }
        
        // 2. veli_test_ayarlari koleksiyonunu temizle
        console.log('\n⚙️ veli_test_ayarlari koleksiyonu temizleniyor...');
        const veliAyarlariSnapshot = await getDocs(collection(db, 'veli_test_ayarlari'));
        
        for (const doc of veliAyarlariSnapshot.docs) {
            await deleteDoc(doc.ref);
            silinenAyarlarSayisi++;
            console.log(`✅ veli_test_ayarlari silindi: ${doc.id}`);
        }
        
        // 3. testler koleksiyonunu temizle (isteğe bağlı)
        console.log('\n📝 testler koleksiyonu temizleniyor...');
        const testlerSnapshot = await getDocs(collection(db, 'testler'));
        
        for (const doc of testlerSnapshot.docs) {
            await deleteDoc(doc.ref);
            silinenTestSayisi++;
            console.log(`✅ test silindi: ${doc.data().ad || doc.id}`);
        }
        
        // 4. sorular koleksiyonunu temizle (isteğe bağlı)
        console.log('\n❓ sorular koleksiyonu temizleniyor...');
        const sorularSnapshot = await getDocs(collection(db, 'sorular'));
        
        for (const doc of sorularSnapshot.docs) {
            await deleteDoc(doc.ref);
            console.log(`✅ soru silindi: ${doc.id}`);
        }
        
        console.log('\n🎉 Temizlik tamamlandı!');
        console.log(`📊 Silinen test sonucu: ${silinenSonucSayisi}`);
        console.log(`⚙️ Silinen veli ayarları: ${silinenAyarlarSayisi}`);
        console.log(`📝 Silinen test: ${silinenTestSayisi}`);
        console.log(`❓ Silinen soru: ${sorularSnapshot.size}`);
        
        console.log('\n💡 Artık yeni testlerle temiz bir başlangıç yapabilirsiniz!');
        console.log('📋 Yeni testler yüklemek için admin panelini kullanın.');
        
    } catch (error) {
        console.error('❌ Temizlik sırasında hata:', error);
    }
}

// Temizlik işlemini başlat
testleriTemizle(); 