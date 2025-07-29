const admin = require('firebase-admin');
const serviceAccount = require('../cozkazan-app-firebase-adminsdk.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function fixTestQuestions() {
    try {
        console.log('🔧 Test sorularını düzeltiliyor...\n');
        
        const testlerSnapshot = await db.collection('testler').get();
        
        console.log(`📊 ${testlerSnapshot.size} test bulundu\n`);
        
        for (const doc of testlerSnapshot.docs) {
            const test = doc.data();
            console.log(`\n--- ${test.ad} ---`);
            
            // 50 örnek soru oluştur
            const sorular = [];
            for (let i = 1; i <= 50; i++) {
                sorular.push({
                    soru: `${test.ad} - Soru ${i}`,
                    secenekler: [
                        `A) ${test.ad} Seçenek A - Soru ${i}`,
                        `B) ${test.ad} Seçenek B - Soru ${i}`,
                        `C) ${test.ad} Seçenek C - Soru ${i}`,
                        `D) ${test.ad} Seçenek D - Soru ${i}`
                    ],
                    dogruCevap: ['a', 'b', 'c', 'd'][i % 4] // Döngüsel doğru cevaplar
                });
            }
            
            // Testi güncelle
            await db.collection('testler').doc(doc.id).update({
                sorular: sorular,
                guncellemeTarihi: new Date()
            });
            
            console.log(`✅ ${sorular.length} soru eklendi`);
        }
        
        console.log('\n🎉 Tüm testler düzeltildi!');
        
    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        process.exit(0);
    }
}

fixTestQuestions(); 