const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, updateDoc, doc, query, where } = require('firebase/firestore');

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

// Test sorularını düzelt
async function testSorulariniDuzelt() {
    try {
        console.log('🔧 Test sorularını düzeltiliyor...\n');
        
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
        
        // Eğer sorular yoksa, örnek sorular ekle
        if (!testData.sorular || testData.sorular.length === 0) {
            console.log('\n📝 Örnek sorular ekleniyor...');
            
            const ornekSorular = [
                {
                    soruMetni: "Aşağıdakilerden hangisi sorumluluk sahibi bir öğrencinin yapması gereken bir davranıştır?",
                    secenekA: "Ödevlerini zamanında yapmak",
                    secenekB: "Sınıfta gürültü yapmak",
                    secenekC: "Arkadaşlarının eşyalarını izinsiz almak",
                    secenekD: "Ders sırasında uyumak",
                    dogruCevap: "A"
                },
                {
                    soruMetni: "Hangi davranış sorumluluk sahibi bir kişinin özelliği değildir?",
                    secenekA: "Sözünde durmak",
                    secenekB: "Başkalarını rahatsız etmek",
                    secenekC: "Görevlerini zamanında yapmak",
                    secenekD: "Çevresini temiz tutmak",
                    dogruCevap: "B"
                },
                {
                    soruMetni: "Aşağıdakilerden hangisi evdeki sorumluluklarımızdan biridir?",
                    secenekA: "Oyun oynamak",
                    secenekB: "Odamızı düzenli tutmak",
                    secenekC: "Televizyon izlemek",
                    secenekD: "Bilgisayar oyunu oynamak",
                    dogruCevap: "B"
                },
                {
                    soruMetni: "Okulda sorumluluk sahibi bir öğrenci nasıl davranır?",
                    secenekA: "Sınıfta gürültü yapar",
                    secenekB: "Ödevlerini yapmaz",
                    secenekC: "Derslere zamanında gelir",
                    secenekD: "Arkadaşlarını rahatsız eder",
                    dogruCevap: "C"
                },
                {
                    soruMetni: "Hangi davranış sorumluluk sahibi bir kişinin yapacağı bir şey değildir?",
                    secenekA: "Çevresini temiz tutmak",
                    secenekB: "Başkalarının haklarına saygı göstermek",
                    secenekC: "Sözünde durmak",
                    secenekD: "Başkalarının eşyalarını izinsiz almak",
                    dogruCevap: "D"
                },
                {
                    soruMetni: "Ailemize karşı sorumluluklarımız nelerdir?",
                    secenekA: "Sadece oyun oynamak",
                    secenekB: "Ev işlerine yardım etmek",
                    secenekC: "Sadece televizyon izlemek",
                    secenekD: "Hiçbir şey yapmamak",
                    dogruCevap: "B"
                },
                {
                    soruMetni: "Sorumluluk sahibi bir kişi hangi özelliğe sahip olmalıdır?",
                    secenekA: "Düzensiz olmak",
                    secenekB: "Güvenilir olmak",
                    secenekC: "Tembel olmak",
                    secenekD: "Saygısız olmak",
                    dogruCevap: "B"
                },
                {
                    soruMetni: "Aşağıdakilerden hangisi okul sorumluluklarımızdan biridir?",
                    secenekA: "Sınıfta gürültü yapmak",
                    secenekB: "Ders araçlarını düzenli tutmak",
                    secenekC: "Arkadaşlarını rahatsız etmek",
                    secenekD: "Ödevlerini yapmamak",
                    dogruCevap: "B"
                },
                {
                    soruMetni: "Hangi davranış sorumluluk sahibi bir öğrencinin yapmaması gereken bir şeydir?",
                    secenekA: "Ödevlerini zamanında yapmak",
                    secenekB: "Sınıfta gürültü yapmak",
                    secenekC: "Derslere zamanında gelmek",
                    secenekD: "Çevresini temiz tutmak",
                    dogruCevap: "B"
                },
                {
                    soruMetni: "Sorumluluk sahibi bir kişi hangi özelliğe sahip değildir?",
                    secenekA: "Güvenilir olmak",
                    secenekB: "Düzenli olmak",
                    secenekC: "Saygısız olmak",
                    secenekD: "Çalışkan olmak",
                    dogruCevap: "C"
                }
            ];
            
            // Testi güncelle
            await updateDoc(doc(db, 'testler', testDoc.id), {
                sorular: ornekSorular
            });
            
            console.log('✅ 10 örnek soru eklendi!');
        } else {
            console.log('\n✅ Test zaten sorulara sahip!');
            console.log('İlk 3 soru örneği:');
            testData.sorular.slice(0, 3).forEach((soru, index) => {
                console.log(`\n  ${index + 1}. Soru:`);
                console.log(`     Soru: ${soru.soruMetni}`);
                console.log(`     A) ${soru.secenekA}`);
                console.log(`     B) ${soru.secenekB}`);
                console.log(`     C) ${soru.secenekC}`);
                console.log(`     D) ${soru.secenekD}`);
                console.log(`     Doğru: ${soru.dogruCevap}`);
            });
        }
        
        console.log('\n🎉 Test düzeltme işlemi tamamlandı!');
        
    } catch (error) {
        console.error('❌ Düzeltme sırasında hata:', error);
    }
}

// Düzeltme işlemini başlat
testSorulariniDuzelt(); 