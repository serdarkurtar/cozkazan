const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, query, where } = require('firebase/firestore');

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

// Müfredat verisi
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

// Konuları Firebase'e ekle
async function konulariFirebaseEkle() {
    try {
        console.log('Konular Firebase\'e ekleniyor...');
        
        let eklenenKonuSayisi = 0;
        let mevcutKonuSayisi = 0;
        
        // Her sınıf için
        for (const sinifData of curriculumData) {
            const sinifAdi = sinifData.sinif;
            
            // Her ders için
            for (const dersData of sinifData.dersler) {
                const dersAdi = dersData.ders;
                
                // Her konu için
                for (const konuAdi of dersData.konular) {
                    try {
                        // Konu zaten var mı kontrol et
                        const konuQuery = query(
                            collection(db, 'konular'),
                            where('sinifAdi', '==', sinifAdi),
                            where('dersAdi', '==', dersAdi),
                            where('konuAdi', '==', konuAdi)
                        );
                        
                        const konuSnapshot = await getDocs(konuQuery);
                        
                        if (konuSnapshot.empty) {
                            // Konu yoksa ekle
                            await addDoc(collection(db, 'konular'), {
                                sinifAdi: sinifAdi,
                                dersAdi: dersAdi,
                                konuAdi: konuAdi,
                                ad: konuAdi, // Eski format için
                                olusturmaTarihi: new Date(),
                                aktif: true
                            });
                            
                            console.log(`✅ ${sinifAdi} - ${dersAdi} - ${konuAdi} eklendi`);
                            eklenenKonuSayisi++;
                        } else {
                            console.log(`ℹ️ ${sinifAdi} - ${dersAdi} - ${konuAdi} zaten mevcut`);
                            mevcutKonuSayisi++;
                        }
                        
                    } catch (error) {
                        console.error(`❌ ${sinifAdi} - ${dersAdi} - ${konuAdi} eklenirken hata:`, error);
                    }
                }
            }
        }
        
        console.log(`\n🎉 İşlem tamamlandı!`);
        console.log(`✅ Eklenen konu sayısı: ${eklenenKonuSayisi}`);
        console.log(`ℹ️ Mevcut konu sayısı: ${mevcutKonuSayisi}`);
        console.log(`📊 Toplam işlenen konu: ${eklenenKonuSayisi + mevcutKonuSayisi}`);
        
    } catch (error) {
        console.error('Konular eklenirken genel hata:', error);
    }
}

// Scripti çalıştır
konulariFirebaseEkle(); 