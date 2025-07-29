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

// Tekrarlanan konuları temizle
async function tekrarlananKonulariTemizle() {
    try {
        console.log('🧹 Tekrarlanan konular temizleniyor...\n');
        
        // Tüm konuları al
        const konularSnapshot = await getDocs(collection(db, 'konular'));
        const konular = [];
        
        for (const doc of konularSnapshot.docs) {
            const data = doc.data();
            konular.push({
                id: doc.id,
                sinifAdi: data.sinifAdi,
                dersAdi: data.dersAdi,
                konuAdi: data.konuAdi || data.ad,
                ad: data.ad,
                olusturmaTarihi: data.olusturmaTarihi
            });
        }
        
        console.log(`📊 Toplam ${konular.length} konu bulundu`);
        
        // Tekrarlananları bul
        const tekrarlananlar = [];
        const benzersizler = new Map();
        
        for (const konu of konular) {
            const key = `${konu.sinifAdi}-${konu.dersAdi}-${konu.konuAdi}`;
            
            if (benzersizler.has(key)) {
                // Tekrarlanan - hangisi daha eski?
                const mevcut = benzersizler.get(key);
                const mevcutTarih = mevcut.olusturmaTarihi?.toDate?.() || new Date(0);
                const yeniTarih = konu.olusturmaTarihi?.toDate?.() || new Date(0);
                
                if (yeniTarih > mevcutTarih) {
                    // Yeni olanı sil, eski olanı tut
                    tekrarlananlar.push(konu);
                } else {
                    // Eski olanı sil, yeni olanı tut
                    tekrarlananlar.push(mevcut);
                    benzersizler.set(key, konu);
                }
            } else {
                benzersizler.set(key, konu);
            }
        }
        
        console.log(`✅ Benzersiz konular: ${benzersizler.size}`);
        console.log(`🗑️  Silinecek tekrarlananlar: ${tekrarlananlar.length}`);
        
        if (tekrarlananlar.length === 0) {
            console.log('🎉 Tekrarlanan konu yok!');
            return;
        }
        
        // Tekrarlananları sil
        console.log('\n🗑️  Tekrarlanan konular siliniyor...');
        let silinenSayisi = 0;
        
        for (const konu of tekrarlananlar) {
            try {
                await deleteDoc(doc(db, 'konular', konu.id));
                console.log(`✅ Silindi: ${konu.sinifAdi} - ${konu.dersAdi} - ${konu.konuAdi}`);
                silinenSayisi++;
            } catch (error) {
                console.log(`❌ Silinemedi: ${konu.sinifAdi} - ${konu.dersAdi} - ${konu.konuAdi} (${error.message})`);
            }
        }
        
        console.log(`\n🎉 İşlem tamamlandı!`);
        console.log(`✅ ${silinenSayisi} tekrarlanan konu silindi`);
        console.log(`📊 Kalan benzersiz konu: ${benzersizler.size}`);
        
        // Sınıf bazında özet
        console.log('\n📋 SINIF BAZINDA ÖZET:');
        const sinifOzeti = new Map();
        
        for (const konu of benzersizler.values()) {
            if (!sinifOzeti.has(konu.sinifAdi)) {
                sinifOzeti.set(konu.sinifAdi, new Map());
            }
            
            const sinifMap = sinifOzeti.get(konu.sinifAdi);
            if (!sinifMap.has(konu.dersAdi)) {
                sinifMap.set(konu.dersAdi, 0);
            }
            
            sinifMap.set(konu.dersAdi, sinifMap.get(konu.dersAdi) + 1);
        }
        
        for (const [sinif, dersler] of sinifOzeti) {
            console.log(`\n📚 ${sinif}:`);
            for (const [ders, konuSayisi] of dersler) {
                console.log(`  📖 ${ders}: ${konuSayisi} konu`);
            }
        }
        
    } catch (error) {
        console.error('❌ Temizlik sırasında hata:', error);
    }
}

// Temizlik işlemini başlat
tekrarlananKonulariTemizle(); 