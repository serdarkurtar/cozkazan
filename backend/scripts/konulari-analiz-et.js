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

// Müfredat verisi (admin panel ile uyumlu)
const curriculumData = [
    {
        "sinif": "1. Sınıf",
        "dersler": [
            {
                "ders": "Türkçe",
                "konular": [
                    "Güzel Davranışlarımız",
                    "Mustafa Kemal'den Atatürk'e",
                    "Çevremizdeki Yaşam",
                    "Yol Arkadaşımız Kitaplar",
                    "Yeteneklerimizi Keşfediyoruz",
                    "Minik Kaşifler",
                    "Atalarımızın İzleri",
                    "Sorumluluklarımızın Farkındayız"
                ]
            },
            {
                "ders": "Matematik",
                "konular": [
                    "Nesnelerin Geometrisi (1)",
                    "Sayılar ve Nicelikler (1)",
                    "Sayılar ve Nicelikler (2)",
                    "Sayılar ve Nicelikler (3)",
                    "İşlemlerden Cebirsel Düşünmeye",
                    "Veriye Dayalı Araştırma"
                ]
            },
            {
                "ders": "Hayat Bilgisi",
                "konular": [
                    "Ben ve Okulum",
                    "Sağlığım ve Güvenliğim",
                    "Ailem ve Toplum",
                    "Yaşadığım Yer ve Ülkem",
                    "Doğa ve Çevre",
                    "Bilim, Teknoloji ve Sanat"
                ]
            }
        ]
    },
    {
        "sinif": "2. Sınıf",
        "dersler": [
            {
                "ders": "Türkçe",
                "konular": [
                    "Değerlerimizle Varız",
                    "Atatürk ve Çocuk",
                    "Doğada Neler Oluyor?",
                    "Okuma Serüvenimiz",
                    "Yeteneklerimizi Tanıyoruz",
                    "Kültür Hazinemiz",
                    "Haklarımızı Biliyoruz"
                ]
            },
            {
                "ders": "Matematik",
                "konular": [
                    "Nesnelerin Geometrisi (1)",
                    "Sayılar ve Nicelikler (1)",
                    "İşlemlerden Cebirsel Düşünmeye",
                    "Sayılar ve Nicelikler (2)",
                    "Nesnelerin Geometrisi (2)",
                    "Veriye Dayalı Araştırma"
                ]
            },
            {
                "ders": "Hayat Bilgisi",
                "konular": [
                    "Ben ve Okulum",
                    "Sağlığım ve Güvenliğim",
                    "Ailem ve Toplum",
                    "Yaşadığım Yer ve Ülkem",
                    "Doğa ve Çevre",
                    "Bilim, Teknoloji ve Sanat"
                ]
            }
        ]
    },
    {
        "sinif": "3. Sınıf",
        "dersler": [
            {
                "ders": "Türkçe",
                "konular": [
                    "Değerlerimizle Yaşıyoruz",
                    "Atatürk ve Kahramanlarımız",
                    "Doğayı Tanıyoruz",
                    "Bilgi Hazinemiz",
                    "Yeteneklerimizi Kullanıyoruz",
                    "Bilim Yolculuğu",
                    "Millî Kültürümüz",
                    "Hak ve Sorumluluklarımız"
                ]
            },
            {
                "ders": "Matematik",
                "konular": [
                    "Sayılar ve Nicelikler (1)",
                    "Sayılar ve Nicelikler (2)",
                    "İşlemlerden Cebirsel Düşünmeye",
                    "Nesnelerin Geometrisi (1)",
                    "Nesnelerin Geometrisi (2)",
                    "Veriye Dayalı Araştırma"
                ]
            },
            {
                "ders": "Hayat Bilgisi",
                "konular": [
                    "Ben ve Okulum",
                    "Sağlığım ve Güvenliğim",
                    "Ailem ve Toplum",
                    "Yaşadığım Yer ve Ülkem",
                    "Doğa ve Çevre",
                    "Bilim, Teknoloji ve Sanat"
                ]
            },
            {
                "ders": "Fen Bilimleri",
                "konular": [
                    "Bilimsel Keşif Yolculuğu",
                    "Canlılar Dünyasına Yolculuk",
                    "Yer Bilimleri",
                    "Maddeyi Tanıyalım",
                    "Hareket",
                    "Elektrik",
                    "Tarım",
                    "Canlıların Yaşam Alanları"
                ]
            }
        ]
    },
    {
        "sinif": "4. Sınıf",
        "dersler": [
            {
                "ders": "Türkçe",
                "konular": [
                    "Erdemler",
                    "Millî Mücadele ve Atatürk",
                    "Doğa ve İnsan",
                    "Kütüphanemiz",
                    "Kendimizi Geliştiriyoruz",
                    "Bilim ve Teknoloji",
                    "Geçmişten Geleceğe Mirasımız",
                    "Demokratik Yaşam"
                ]
            },
            {
                "ders": "Matematik",
                "konular": [
                    "Sayılar ve Nicelikler (1)",
                    "Sayılar ve Nicelikler (2)",
                    "İşlemlerden Cebirsel Düşünmeye",
                    "Nesnelerin Geometrisi (1)",
                    "Nesnelerin Geometrisi (2)",
                    "Nesnelerin Geometrisi (3)",
                    "Olasılık ve Veriye Dayalı Araştırma"
                ]
            },
            {
                "ders": "Hayat Bilgisi",
                "konular": [
                    "Ben ve Okulum",
                    "Sağlığım ve Güvenliğim",
                    "Ailem ve Toplum",
                    "Yaşadığım Yer ve Ülkem",
                    "Doğa ve Çevre",
                    "Bilim, Teknoloji ve Sanat"
                ]
            },
            {
                "ders": "Fen Bilimleri",
                "konular": [
                    "Bilime Yolculuk",
                    "Beş Duyumuz",
                    "Dünyamız",
                    "Maddenin Değişimi",
                    "Mıknatıs",
                    "Enerji Dedektifleri",
                    "Işığın Peşinde",
                    "Sürdürülebilir Şehirler"
                ]
            },
            {
                "ders": "Sosyal Bilgiler",
                "konular": [
                    "Birlikte Yaşamak",
                    "Evimiz Dünya",
                    "Ortak Mirasımız",
                    "Yaşayan Demokrasimiz",
                    "Hayatımızdaki Ekonomi",
                    "Teknoloji ve Sosyal Bilimler"
                ]
            },
            {
                "ders": "Din Kültürü ve Ahlak Bilgisi",
                "konular": [
                    "Günlük Hayat ve Din",
                    "Allah Sevgisi",
                    "Peygamberlerin Sevgisi",
                    "Ahlaki Değerlerimiz",
                    "Haklar ve Sorumluluklar"
                ]
            },
            {
                "ders": "İnsan Hakları, Vatandaşlık ve Demokrasi",
                "konular": [
                    "Çocuk Olarak Haklarım",
                    "Eşitlik ve Adalet",
                    "Etkin Vatandaşlık",
                    "Hayatımda Demokrasi"
                ]
            }
        ]
    }
];

// Firebase'deki konuları analiz et
async function konulariAnalizEt() {
    try {
        console.log('🔍 Firebase konuları analiz ediliyor...\n');
        
        // Firebase'den tüm konuları al
        const konularSnapshot = await getDocs(collection(db, 'konular'));
        const firebaseKonular = [];
        
        for (const doc of konularSnapshot.docs) {
            const data = doc.data();
            firebaseKonular.push({
                id: doc.id,
                sinifAdi: data.sinifAdi || data.ad,
                dersAdi: data.dersAdi,
                konuAdi: data.konuAdi || data.ad,
                ad: data.ad
            });
        }
        
        console.log(`📊 Firebase'de toplam ${firebaseKonular.length} konu bulundu\n`);
        
        // Her sınıf için analiz
        for (const sinifData of curriculumData) {
            const sinifAdi = sinifData.sinif;
            console.log(`\n📚 ${sinifAdi} Analizi:`);
            console.log('='.repeat(50));
            
            // Bu sınıfın Firebase'deki konuları
            const sinifKonulari = firebaseKonular.filter(k => k.sinifAdi === sinifAdi);
            console.log(`Firebase'de ${sinifKonulari.length} konu bulundu`);
            
            // Her ders için analiz
            for (const dersData of sinifData.dersler) {
                const dersAdi = dersData.ders;
                console.log(`\n  📖 ${dersAdi}:`);
                
                // Bu dersin Firebase'deki konuları
                const dersKonulari = sinifKonulari.filter(k => k.dersAdi === dersAdi);
                console.log(`    Firebase'de ${dersKonulari.length} konu`);
                
                // Müfredattaki konular
                const muftedatKonulari = dersData.konular;
                console.log(`    Müfredatta ${muftedatKonulari.length} konu`);
                
                // Firebase'deki konu adları
                const firebaseKonuAdlari = dersKonulari.map(k => k.konuAdi || k.ad);
                
                // Tekrarlanan konular
                const tekrarlananlar = firebaseKonuAdlari.filter((item, index) => 
                    firebaseKonuAdlari.indexOf(item) !== index
                );
                
                if (tekrarlananlar.length > 0) {
                    console.log(`    ⚠️  Tekrarlanan konular: ${tekrarlananlar.join(', ')}`);
                }
                
                // Eksik konular
                const eksikler = muftedatKonulari.filter(konu => 
                    !firebaseKonuAdlari.includes(konu)
                );
                
                if (eksikler.length > 0) {
                    console.log(`    ❌ Eksik konular: ${eksikler.join(', ')}`);
                }
                
                // Fazla konular
                const fazlalar = firebaseKonuAdlari.filter(konu => 
                    !muftedatKonulari.includes(konu)
                );
                
                if (fazlalar.length > 0) {
                    console.log(`    ➕ Fazla konular: ${fazlalar.join(', ')}`);
                }
                
                // Doğru konular
                const dogrular = firebaseKonuAdlari.filter(konu => 
                    muftedatKonulari.includes(konu)
                );
                
                if (dogrular.length > 0) {
                    console.log(`    ✅ Doğru konular: ${dogrular.length} adet`);
                }
            }
        }
        
        // Genel özet
        console.log('\n\n📋 GENEL ÖZET:');
        console.log('='.repeat(50));
        
        let toplamTekrarlanan = 0;
        let toplamEksik = 0;
        let toplamFazla = 0;
        let toplamDogru = 0;
        
        for (const sinifData of curriculumData) {
            for (const dersData of sinifData.dersler) {
                const sinifKonulari = firebaseKonular.filter(k => 
                    k.sinifAdi === sinifData.sinif && k.dersAdi === dersData.ders
                );
                const firebaseKonuAdlari = sinifKonulari.map(k => k.konuAdi || k.ad);
                const muftedatKonulari = dersData.konular;
                
                // Tekrarlanan
                const tekrarlananlar = firebaseKonuAdlari.filter((item, index) => 
                    firebaseKonuAdlari.indexOf(item) !== index
                );
                toplamTekrarlanan += tekrarlananlar.length;
                
                // Eksik
                const eksikler = muftedatKonulari.filter(konu => 
                    !firebaseKonuAdlari.includes(konu)
                );
                toplamEksik += eksikler.length;
                
                // Fazla
                const fazlalar = firebaseKonuAdlari.filter(konu => 
                    !muftedatKonulari.includes(konu)
                );
                toplamFazla += fazlalar.length;
                
                // Doğru
                const dogrular = firebaseKonuAdlari.filter(konu => 
                    muftedatKonulari.includes(konu)
                );
                toplamDogru += dogrular.length;
            }
        }
        
        console.log(`✅ Doğru konular: ${toplamDogru}`);
        console.log(`⚠️  Tekrarlanan konular: ${toplamTekrarlanan}`);
        console.log(`❌ Eksik konular: ${toplamEksik}`);
        console.log(`➕ Fazla konular: ${toplamFazla}`);
        
        if (toplamTekrarlanan > 0 || toplamEksik > 0 || toplamFazla > 0) {
            console.log('\n🔧 DÜZELTME ÖNERİLERİ:');
            console.log('1. Tekrarlanan konuları silin');
            console.log('2. Eksik konuları ekleyin');
            console.log('3. Fazla konuları silin');
            console.log('4. Admin panel ile uyumlu hale getirin');
        } else {
            console.log('\n🎉 Tüm konular doğru ve uyumlu!');
        }
        
    } catch (error) {
        console.error('❌ Analiz sırasında hata:', error);
    }
}

// Analizi başlat
konulariAnalizEt(); 