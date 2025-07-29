const https = require('http');

async function loadCurriculumData() {
    console.log('📚 Müfredat verileri yükleniyor...');
    
    // Giriş yap
    const loginData = JSON.stringify({
        email: 'admin@cozkazan.com',
        password: 'admin123'
    });

    const loginOptions = {
        hostname: 'localhost',
        port: 8055,
        path: '/auth/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(loginData)
        }
    };

    try {
        const token = await new Promise((resolve, reject) => {
            const req = https.request(loginOptions, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        const response = JSON.parse(data);
                        if (response.data && response.data.access_token) {
                            resolve(response.data.access_token);
                        } else {
                            reject(new Error('Giriş başarısız'));
                        }
                    } catch (e) {
                        reject(e);
                    }
                });
            });
            req.on('error', reject);
            req.write(loginData);
            req.end();
        });

        console.log('✅ Giriş başarılı!');

        // 1. SINIFLAR
        console.log('📝 Sınıflar yükleniyor...');
        const siniflar = [
            { seviye: 1, ad: '1. Sınıf', aciklama: 'Birinci sınıf seviyesi', renk: '#FF6B6B', aktif: true, sira: 1 },
            { seviye: 2, ad: '2. Sınıf', aciklama: 'İkinci sınıf seviyesi', renk: '#4ECDC4', aktif: true, sira: 2 },
            { seviye: 3, ad: '3. Sınıf', aciklama: 'Üçüncü sınıf seviyesi', renk: '#45B7D1', aktif: true, sira: 3 },
            { seviye: 4, ad: '4. Sınıf', aciklama: 'Dördüncü sınıf seviyesi', renk: '#96CEB4', aktif: true, sira: 4 }
        ];

        for (const sinif of siniflar) {
            await createItem(token, 'siniflar', sinif);
        }

        // 2. DERSLER
        console.log('📝 Dersler yükleniyor...');
        const dersler = [
            { ad: 'Türkçe', kod: 'TRK', renk: '#FF6B6B', ikon: 'translate', aciklama: 'Türkçe dersi', aktif: true, sira: 1 },
            { ad: 'Matematik', kod: 'MAT', renk: '#4ECDC4', ikon: 'functions', aciklama: 'Matematik dersi', aktif: true, sira: 2 },
            { ad: 'Hayat Bilgisi', kod: 'HYB', renk: '#45B7D1', ikon: 'home', aciklama: 'Hayat Bilgisi dersi', aktif: true, sira: 3 },
            { ad: 'Fen Bilimleri', kod: 'FEN', renk: '#96CEB4', ikon: 'science', aciklama: 'Fen Bilimleri dersi', aktif: true, sira: 4 },
            { ad: 'Sosyal Bilgiler', kod: 'SOS', renk: '#FFEAA7', ikon: 'public', aciklama: 'Sosyal Bilgiler dersi', aktif: true, sira: 5 },
            { ad: 'Din Kültürü', kod: 'DIN', renk: '#DDA0DD', ikon: 'mosque', aciklama: 'Din Kültürü dersi', aktif: true, sira: 6 },
            { ad: 'İnsan Hakları', kod: 'INS', renk: '#98D8C8', ikon: 'gavel', aciklama: 'İnsan Hakları dersi', aktif: true, sira: 7 }
        ];

        for (const ders of dersler) {
            await createItem(token, 'dersler', ders);
        }

        // 3. KONULAR (1. Sınıf)
        console.log('📝 1. Sınıf konuları yükleniyor...');
        const sinif1Konular = [
            // Türkçe - 1. Sınıf
            { ad: 'Güzel Davranışlarımız', ders_id: 1, sinif_id: 1, aciklama: '1. Sınıf Türkçe - Güzel Davranışlarımız', aktif: true, sira: 1 },
            { ad: 'Mustafa Kemal\'den Atatürk\'e', ders_id: 1, sinif_id: 1, aciklama: '1. Sınıf Türkçe - Mustafa Kemal\'den Atatürk\'e', aktif: true, sira: 2 },
            { ad: 'Çevremizdeki Yaşam', ders_id: 1, sinif_id: 1, aciklama: '1. Sınıf Türkçe - Çevremizdeki Yaşam', aktif: true, sira: 3 },
            { ad: 'Yol Arkadaşımız Kitaplar', ders_id: 1, sinif_id: 1, aciklama: '1. Sınıf Türkçe - Yol Arkadaşımız Kitaplar', aktif: true, sira: 4 },
            { ad: 'Yeteneklerimizi Keşfediyoruz', ders_id: 1, sinif_id: 1, aciklama: '1. Sınıf Türkçe - Yeteneklerimizi Keşfediyoruz', aktif: true, sira: 5 },
            { ad: 'Minik Kâşifler', ders_id: 1, sinif_id: 1, aciklama: '1. Sınıf Türkçe - Minik Kâşifler', aktif: true, sira: 6 },
            { ad: 'Atalarımızın İzleri', ders_id: 1, sinif_id: 1, aciklama: '1. Sınıf Türkçe - Atalarımızın İzleri', aktif: true, sira: 7 },
            { ad: 'Sorumluluklarımızın Farkındayız', ders_id: 1, sinif_id: 1, aciklama: '1. Sınıf Türkçe - Sorumluluklarımızın Farkındayız', aktif: true, sira: 8 },

            // Matematik - 1. Sınıf
            { ad: 'Nesnelerin Geometrisi (1)', ders_id: 2, sinif_id: 1, aciklama: '1. Sınıf Matematik - Nesnelerin Geometrisi (1)', aktif: true, sira: 9 },
            { ad: 'Sayılar ve Nicelikler (1)', ders_id: 2, sinif_id: 1, aciklama: '1. Sınıf Matematik - Sayılar ve Nicelikler (1)', aktif: true, sira: 10 },
            { ad: 'Sayılar ve Nicelikler (2)', ders_id: 2, sinif_id: 1, aciklama: '1. Sınıf Matematik - Sayılar ve Nicelikler (2)', aktif: true, sira: 11 },
            { ad: 'İşlemlerden Cebirsel Düşünmeye', ders_id: 2, sinif_id: 1, aciklama: '1. Sınıf Matematik - İşlemlerden Cebirsel Düşünmeye', aktif: true, sira: 12 },
            { ad: 'Sayılar ve Nicelikler (3)', ders_id: 2, sinif_id: 1, aciklama: '1. Sınıf Matematik - Sayılar ve Nicelikler (3)', aktif: true, sira: 13 },
            { ad: 'Nesnelerin Geometrisi (2)', ders_id: 2, sinif_id: 1, aciklama: '1. Sınıf Matematik - Nesnelerin Geometrisi (2)', aktif: true, sira: 14 },
            { ad: 'Veriye Dayalı Araştırma', ders_id: 2, sinif_id: 1, aciklama: '1. Sınıf Matematik - Veriye Dayalı Araştırma', aktif: true, sira: 15 },

            // Hayat Bilgisi - 1. Sınıf
            { ad: 'Ben ve Okulum', ders_id: 3, sinif_id: 1, aciklama: '1. Sınıf Hayat Bilgisi - Ben ve Okulum', aktif: true, sira: 16 },
            { ad: 'Sağlığım ve Güvenliğim', ders_id: 3, sinif_id: 1, aciklama: '1. Sınıf Hayat Bilgisi - Sağlığım ve Güvenliğim', aktif: true, sira: 17 },
            { ad: 'Ailem ve Toplum', ders_id: 3, sinif_id: 1, aciklama: '1. Sınıf Hayat Bilgisi - Ailem ve Toplum', aktif: true, sira: 18 },
            { ad: 'Yaşadığım Yer ve Ülkem', ders_id: 3, sinif_id: 1, aciklama: '1. Sınıf Hayat Bilgisi - Yaşadığım Yer ve Ülkem', aktif: true, sira: 19 },
            { ad: 'Doğa ve Çevre', ders_id: 3, sinif_id: 1, aciklama: '1. Sınıf Hayat Bilgisi - Doğa ve Çevre', aktif: true, sira: 20 },
            { ad: 'Bilim, Teknoloji ve Sanat', ders_id: 3, sinif_id: 1, aciklama: '1. Sınıf Hayat Bilgisi - Bilim, Teknoloji ve Sanat', aktif: true, sira: 21 }
        ];

        for (const konu of sinif1Konular) {
            await createItem(token, 'konular', konu);
        }

        console.log('✅ 1. Sınıf konuları yüklendi!');

        // 4. KONULAR (2. Sınıf)
        console.log('📝 2. Sınıf konuları yükleniyor...');
        const sinif2Konular = [
            // Türkçe - 2. Sınıf
            { ad: 'Değerlerimizle Varız', ders_id: 1, sinif_id: 2, aciklama: '2. Sınıf Türkçe - Değerlerimizle Varız', aktif: true, sira: 1 },
            { ad: 'Atatürk ve Çocuk', ders_id: 1, sinif_id: 2, aciklama: '2. Sınıf Türkçe - Atatürk ve Çocuk', aktif: true, sira: 2 },
            { ad: 'Doğada Neler Oluyor?', ders_id: 1, sinif_id: 2, aciklama: '2. Sınıf Türkçe - Doğada Neler Oluyor?', aktif: true, sira: 3 },
            { ad: 'Okuma Serüvenimiz', ders_id: 1, sinif_id: 2, aciklama: '2. Sınıf Türkçe - Okuma Serüvenimiz', aktif: true, sira: 4 },
            { ad: 'Yeteneklerimizi Tanıyoruz', ders_id: 1, sinif_id: 2, aciklama: '2. Sınıf Türkçe - Yeteneklerimizi Tanıyoruz', aktif: true, sira: 5 },
            { ad: 'Mucit Çocuk', ders_id: 1, sinif_id: 2, aciklama: '2. Sınıf Türkçe - Mucit Çocuk', aktif: true, sira: 6 },
            { ad: 'Kültür Hazinemiz', ders_id: 1, sinif_id: 2, aciklama: '2. Sınıf Türkçe - Kültür Hazinemiz', aktif: true, sira: 7 },
            { ad: 'Haklarımızı Biliyoruz', ders_id: 1, sinif_id: 2, aciklama: '2. Sınıf Türkçe - Haklarımızı Biliyoruz', aktif: true, sira: 8 },

            // Matematik - 2. Sınıf
            { ad: 'Nesnelerin Geometrisi (1)', ders_id: 2, sinif_id: 2, aciklama: '2. Sınıf Matematik - Nesnelerin Geometrisi (1)', aktif: true, sira: 9 },
            { ad: 'Sayılar ve Nicelikler (1)', ders_id: 2, sinif_id: 2, aciklama: '2. Sınıf Matematik - Sayılar ve Nicelikler (1)', aktif: true, sira: 10 },
            { ad: 'İşlemlerden Cebirsel Düşünmeye', ders_id: 2, sinif_id: 2, aciklama: '2. Sınıf Matematik - İşlemlerden Cebirsel Düşünmeye', aktif: true, sira: 11 },
            { ad: 'Sayılar ve Nicelikler (2)', ders_id: 2, sinif_id: 2, aciklama: '2. Sınıf Matematik - Sayılar ve Nicelikler (2)', aktif: true, sira: 12 },
            { ad: 'Nesnelerin Geometrisi (2)', ders_id: 2, sinif_id: 2, aciklama: '2. Sınıf Matematik - Nesnelerin Geometrisi (2)', aktif: true, sira: 13 },
            { ad: 'Veriye Dayalı Araştırma', ders_id: 2, sinif_id: 2, aciklama: '2. Sınıf Matematik - Veriye Dayalı Araştırma', aktif: true, sira: 14 },

            // Hayat Bilgisi - 2. Sınıf
            { ad: 'Ben ve Okulum', ders_id: 3, sinif_id: 2, aciklama: '2. Sınıf Hayat Bilgisi - Ben ve Okulum', aktif: true, sira: 15 },
            { ad: 'Sağlığım ve Güvenliğim', ders_id: 3, sinif_id: 2, aciklama: '2. Sınıf Hayat Bilgisi - Sağlığım ve Güvenliğim', aktif: true, sira: 16 },
            { ad: 'Ailem ve Toplum', ders_id: 3, sinif_id: 2, aciklama: '2. Sınıf Hayat Bilgisi - Ailem ve Toplum', aktif: true, sira: 17 },
            { ad: 'Yaşadığım Yer ve Ülkem', ders_id: 3, sinif_id: 2, aciklama: '2. Sınıf Hayat Bilgisi - Yaşadığım Yer ve Ülkem', aktif: true, sira: 18 },
            { ad: 'Doğa ve Çevre', ders_id: 3, sinif_id: 2, aciklama: '2. Sınıf Hayat Bilgisi - Doğa ve Çevre', aktif: true, sira: 19 },
            { ad: 'Bilim, Teknoloji ve Sanat', ders_id: 3, sinif_id: 2, aciklama: '2. Sınıf Hayat Bilgisi - Bilim, Teknoloji ve Sanat', aktif: true, sira: 20 }
        ];

        for (const konu of sinif2Konular) {
            await createItem(token, 'konular', konu);
        }

        console.log('✅ 2. Sınıf konuları yüklendi!');

        console.log('\n🎉 Müfredat verileri başarıyla yüklendi!');
        console.log('📊 http://localhost:8055 adresinden kontrol edebilirsiniz.');
        console.log('\n📋 Yüklenen veriler:');
        console.log('✅ 4 Sınıf seviyesi');
        console.log('✅ 7 Ders kategorisi');
        console.log('✅ 1. ve 2. Sınıf konuları');
        console.log('\n🔄 3. ve 4. Sınıf konuları da yüklenebilir...');
        
    } catch (error) {
        console.error('❌ Hata:', error.message);
    }
}

async function createItem(token, collection, data) {
    const jsonData = JSON.stringify(data);
    
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 8055,
            path: `/${collection}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Length': Buffer.byteLength(jsonData)
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(responseData);
                } else {
                    console.log(`Veri yükleme hatası ${res.statusCode}: ${responseData}`);
                    resolve(); // Devam et
                }
            });
        });
        req.on('error', () => resolve()); // Hata olsa da devam et
        req.write(jsonData);
        req.end();
    });
}

loadCurriculumData(); 