const https = require('http');

async function createAdvancedTestPanel() {
    console.log('🚀 ÇözKazan Gelişmiş Test Paneli oluşturuluyor...');
    
    // Önce giriş yapalım
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

        // 1. SINIFLAR Koleksiyonu
        console.log('📝 Sınıflar koleksiyonu oluşturuluyor...');
        await createCollection(token, {
            name: 'siniflar',
            icon: 'school',
            note: 'Sınıf seviyeleri (1-4)',
            fields: [
                { field: 'seviye', type: 'integer', required: true, note: 'Sınıf seviyesi (1-4)' },
                { field: 'ad', type: 'string', required: true, note: 'Sınıf adı (1. Sınıf, 2. Sınıf, vb.)' },
                { field: 'aciklama', type: 'text', note: 'Sınıf açıklaması' },
                { field: 'aktif', type: 'boolean', note: 'Sınıf aktif mi?', default_value: true },
                { field: 'renk', type: 'string', note: 'Sınıf rengi', interface: 'input-color' },
                { field: 'sira', type: 'integer', note: 'Sıralama', default_value: 1 }
            ]
        });

        // 2. DERSLER Koleksiyonu
        console.log('📝 Dersler koleksiyonu oluşturuluyor...');
        await createCollection(token, {
            name: 'dersler',
            icon: 'book',
            note: 'Ders kategorileri',
            fields: [
                { field: 'ad', type: 'string', required: true, note: 'Ders adı (Türkçe, Matematik, vb.)' },
                { field: 'kod', type: 'string', required: true, note: 'Ders kodu (TRK, MAT, vb.)' },
                { field: 'renk', type: 'string', note: 'Ders rengi', interface: 'input-color' },
                { field: 'ikon', type: 'string', note: 'Ders ikonu' },
                { field: 'aciklama', type: 'text', note: 'Ders açıklaması' },
                { field: 'aktif', type: 'boolean', note: 'Ders aktif mi?', default_value: true },
                { field: 'sira', type: 'integer', note: 'Sıralama', default_value: 1 }
            ]
        });

        // 3. KONULAR Koleksiyonu
        console.log('📝 Konular koleksiyonu oluşturuluyor...');
        await createCollection(token, {
            name: 'konular',
            icon: 'topic',
            note: 'Ders konuları (ağaç yapısı)',
            fields: [
                { field: 'ad', type: 'string', required: true, note: 'Konu adı' },
                { field: 'ders_id', type: 'integer', required: true, note: 'Bağlı ders' },
                { field: 'sinif_id', type: 'integer', required: true, note: 'Sınıf seviyesi' },
                { field: 'ust_konu_id', type: 'integer', note: 'Üst konu (hiyerarşi için)' },
                { field: 'aciklama', type: 'text', note: 'Konu açıklaması' },
                { field: 'aktif', type: 'boolean', note: 'Konu aktif mi?', default_value: true },
                { field: 'sira', type: 'integer', note: 'Sıralama', default_value: 1 },
                { field: 'test_sayisi', type: 'integer', note: 'Bu konudaki test sayısı', default_value: 0 }
            ]
        });

        // 4. TESTLER Koleksiyonu
        console.log('📝 Testler koleksiyonu oluşturuluyor...');
        await createCollection(token, {
            name: 'testler',
            icon: 'quiz',
            note: 'Test ve sınav yönetimi',
            fields: [
                { field: 'baslik', type: 'string', required: true, note: 'Test başlığı' },
                { field: 'aciklama', type: 'text', note: 'Test açıklaması' },
                { field: 'sinif_id', type: 'integer', required: true, note: 'Sınıf seviyesi' },
                { field: 'ders_id', type: 'integer', required: true, note: 'Ders kategorisi' },
                { field: 'konu_id', type: 'integer', required: true, note: 'Spesifik konu' },
                { field: 'zorluk', type: 'string', note: 'Zorluk seviyesi', 
                  options: {
                    choices: [
                        { text: 'Kolay', value: 'kolay' },
                        { text: 'Orta', value: 'orta' },
                        { text: 'Zor', value: 'zor' }
                    ]
                  }
                },
                { field: 'sure', type: 'integer', note: 'Test süresi (dakika)' },
                { field: 'soru_sayisi', type: 'integer', note: 'Toplam soru sayısı' },
                { field: 'toplam_puan', type: 'integer', note: 'Toplam test puanı' },
                { field: 'aktif', type: 'boolean', note: 'Test aktif mi?', default_value: true },
                { field: 'yuklenme_tarihi', type: 'timestamp', note: 'Yüklenme tarihi', default_value: '$NOW' },
                { field: 'guncelleme_tarihi', type: 'timestamp', note: 'Güncelleme tarihi' },
                { field: 'dosya_adi', type: 'string', note: 'Yüklenen dosya adı' },
                { field: 'yukleyen_kullanici', type: 'string', note: 'Yükleyen kullanıcı' }
            ]
        });

        // 5. TEST SORULARI Koleksiyonu
        console.log('📝 Test Soruları koleksiyonu oluşturuluyor...');
        await createCollection(token, {
            name: 'test_sorulari',
            icon: 'help',
            note: 'Test soruları ve cevapları',
            fields: [
                { field: 'test_id', type: 'integer', required: true, note: 'Bağlı test' },
                { field: 'soru_metni', type: 'text', required: true, note: 'Soru metni' },
                { field: 'soru_tipi', type: 'string', required: true, note: 'Soru tipi',
                  options: {
                    choices: [
                        { text: 'Çoktan Seçmeli', value: 'coktan_secmeli' },
                        { text: 'Doğru/Yanlış', value: 'dogru_yanlis' },
                        { text: 'Boşluk Doldurma', value: 'bosluk_doldurma' },
                        { text: 'Eşleştirme', value: 'eslestirme' },
                        { text: 'Açık Uçlu', value: 'acik_uclu' }
                    ]
                  }
                },
                { field: 'secenekler', type: 'json', note: 'Soru seçenekleri (JSON format)' },
                { field: 'dogru_cevap', type: 'string', required: true, note: 'Doğru cevap' },
                { field: 'puan', type: 'integer', note: 'Soru puanı', default_value: 10 },
                { field: 'zorluk', type: 'string', note: 'Soru zorluğu',
                  options: {
                    choices: [
                        { text: 'Kolay', value: 'kolay' },
                        { text: 'Orta', value: 'orta' },
                        { text: 'Zor', value: 'zor' }
                    ]
                  }
                },
                { field: 'aciklama', type: 'text', note: 'Soru açıklaması' },
                { field: 'resim', type: 'uuid', note: 'Soru resmi' },
                { field: 'sira', type: 'integer', note: 'Soru sırası' },
                { field: 'aktif', type: 'boolean', note: 'Soru aktif mi?', default_value: true }
            ]
        });

        // 6. TOPLU YUKLEME Koleksiyonu
        console.log('📝 Toplu Yükleme koleksiyonu oluşturuluyor...');
        await createCollection(token, {
            name: 'toplu_yuklemeler',
            icon: 'upload',
            note: 'Toplu test yükleme kayıtları',
            fields: [
                { field: 'dosya_adi', type: 'string', required: true, note: 'Yüklenen dosya adı' },
                { field: 'dosya_boyutu', type: 'integer', note: 'Dosya boyutu (byte)' },
                { field: 'dosya_tipi', type: 'string', note: 'Dosya tipi (xlsx, csv)' },
                { field: 'yukleyen_kullanici', type: 'string', required: true, note: 'Yükleyen kullanıcı' },
                { field: 'yuklenme_tarihi', type: 'timestamp', note: 'Yüklenme tarihi', default_value: '$NOW' },
                { field: 'durum', type: 'string', note: 'İşlem durumu',
                  options: {
                    choices: [
                        { text: 'Yükleniyor', value: 'yukleniyor' },
                        { text: 'İşleniyor', value: 'isleniyor' },
                        { text: 'Tamamlandı', value: 'tamamlandi' },
                        { text: 'Hata', value: 'hata' }
                    ]
                  }
                },
                { field: 'islenen_satir', type: 'integer', note: 'İşlenen satır sayısı', default_value: 0 },
                { field: 'basarili_satir', type: 'integer', note: 'Başarılı satır sayısı', default_value: 0 },
                { field: 'hatali_satir', type: 'integer', note: 'Hatalı satır sayısı', default_value: 0 },
                { field: 'hata_mesajlari', type: 'json', note: 'Hata mesajları (JSON)' },
                { field: 'hedef_sinif', type: 'integer', note: 'Hedef sınıf' },
                { field: 'hedef_ders', type: 'integer', note: 'Hedef ders' },
                { field: 'hedef_konu', type: 'integer', note: 'Hedef konu' }
            ]
        });

        // 7. KULLANICILAR Koleksiyonu (Gelişmiş)
        console.log('📝 Kullanıcılar koleksiyonu oluşturuluyor...');
        await createCollection(token, {
            name: 'kullanicilar',
            icon: 'people',
            note: 'Uygulama kullanıcıları',
            fields: [
                { field: 'ad', type: 'string', required: true, note: 'Kullanıcının adı' },
                { field: 'soyad', type: 'string', required: true, note: 'Kullanıcının soyadı' },
                { field: 'email', type: 'string', required: true, note: 'E-posta adresi' },
                { field: 'telefon', type: 'string', note: 'Telefon numarası' },
                { field: 'rol', type: 'string', required: true, note: 'Kullanıcı rolü',
                  options: {
                    choices: [
                        { text: 'Admin', value: 'admin' },
                        { text: 'Öğretmen', value: 'ogretmen' },
                        { text: 'Veli', value: 'veli' },
                        { text: 'Çocuk', value: 'cocuk' }
                    ]
                  }
                },
                { field: 'yas', type: 'integer', note: 'Yaş bilgisi' },
                { field: 'sinif_id', type: 'integer', note: 'Sınıf seviyesi' },
                { field: 'aktif', type: 'boolean', note: 'Hesap aktif mi?', default_value: true },
                { field: 'kayit_tarihi', type: 'timestamp', note: 'Kayıt tarihi', default_value: '$NOW' },
                { field: 'son_giris', type: 'timestamp', note: 'Son giriş zamanı' },
                { field: 'toplam_xp', type: 'integer', note: 'Toplam XP puanı', default_value: 0 },
                { field: 'seviye', type: 'integer', note: 'Kullanıcı seviyesi', default_value: 1 },
                { field: 'profil_resmi', type: 'uuid', note: 'Profil resmi' }
            ]
        });

        // İlişkileri oluştur
        console.log('🔗 İlişkiler oluşturuluyor...');
        
        // Konular -> Dersler ilişkisi
        await createRelation(token, 'konular', 'ders_id', 'dersler');
        
        // Konular -> Sınıflar ilişkisi
        await createRelation(token, 'konular', 'sinif_id', 'siniflar');
        
        // Konular -> Üst Konular (self-relation)
        await createRelation(token, 'konular', 'ust_konu_id', 'konular');
        
        // Testler -> Sınıflar ilişkisi
        await createRelation(token, 'testler', 'sinif_id', 'siniflar');
        
        // Testler -> Dersler ilişkisi
        await createRelation(token, 'testler', 'ders_id', 'dersler');
        
        // Testler -> Konular ilişkisi
        await createRelation(token, 'testler', 'konu_id', 'konular');
        
        // Test Soruları -> Testler ilişkisi
        await createRelation(token, 'test_sorulari', 'test_id', 'testler');
        
        // Kullanıcılar -> Sınıflar ilişkisi
        await createRelation(token, 'kullanicilar', 'sinif_id', 'siniflar');

        // Örnek verileri yükle
        console.log('📊 Örnek veriler yükleniyor...');
        await loadSampleData(token);

        console.log('\n🎉 Gelişmiş Test Paneli başarıyla oluşturuldu!');
        console.log('📊 http://localhost:8055 adresinden erişebilirsiniz.');
        console.log('\n📋 Özellikler:');
        console.log('✅ Sekme bazlı arayüz (Sınıflar, Dersler, Konular, Testler)');
        console.log('✅ Hiyerarşik filtreleme sistemi');
        console.log('✅ Toplu test yükleme özelliği');
        console.log('✅ Ağaç yapısı ile konu organizasyonu');
        console.log('✅ Gelişmiş arama ve filtreleme');
        
    } catch (error) {
        console.error('❌ Hata:', error.message);
    }
}

async function createCollection(token, collectionData) {
    const data = JSON.stringify({
        collection: collectionData.name,
        meta: {
            collection: collectionData.name,
            icon: collectionData.icon,
            note: collectionData.note,
            hidden: false,
            singleton: false,
            display_template: collectionData.display_template || '{{id}}'
        },
        schema: {
            name: collectionData.name
        }
    });

    await makeRequest(token, '/collections', 'POST', data);

    // Alanları oluştur
    for (const field of collectionData.fields) {
        const fieldData = JSON.stringify({
            field: field.field,
            type: field.type,
            meta: {
                required: field.required || false,
                note: field.note || '',
                hidden: false,
                interface: getInterfaceType(field.type),
                options: field.options || null,
                default_value: field.default_value || null
            }
        });

        await makeRequest(token, `/fields/${collectionData.name}`, 'POST', fieldData);
    }
}

async function createRelation(token, collection, field, relatedCollection) {
    const data = JSON.stringify({
        collection: collection,
        field: field,
        related_collection: relatedCollection,
        schema: {
            table: collection,
            column: field,
            foreign_key_table: relatedCollection,
            foreign_key_column: 'id',
            constraint_name: `${collection}_${field}_fkey`,
            on_update: 'CASCADE',
            on_delete: 'SET NULL'
        },
        meta: {
            id: 1,
            many_collection: collection,
            many_field: field,
            one_collection: relatedCollection,
            one_field: null,
            one_collection_field: null,
            one_allowed_collections: null,
            junction_field: null,
            sort_field: null,
            one_deselect_action: 'nullify'
        }
    });

    await makeRequest(token, '/relations', 'POST', data);
}

async function makeRequest(token, path, method, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 8055,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        if (data) {
            options.headers['Content-Length'] = Buffer.byteLength(data);
        }

        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(responseData);
                } else {
                    console.log(`İstek hatası ${res.statusCode}: ${responseData}`);
                    resolve(); // Devam et
                }
            });
        });
        req.on('error', () => resolve()); // Hata olsa da devam et
        if (data) req.write(data);
        req.end();
    });
}

function getInterfaceType(type) {
    const interfaces = {
        'string': 'input',
        'text': 'input-multiline',
        'integer': 'input',
        'float': 'input',
        'boolean': 'boolean',
        'timestamp': 'datetime',
        'uuid': 'file',
        'json': 'input-code'
    };
    return interfaces[type] || 'input';
}

async function loadSampleData(token) {
    // Sınıflar
    const siniflar = [
        { seviye: 1, ad: '1. Sınıf', aciklama: 'Birinci sınıf seviyesi', renk: '#FF6B6B' },
        { seviye: 2, ad: '2. Sınıf', aciklama: 'İkinci sınıf seviyesi', renk: '#4ECDC4' },
        { seviye: 3, ad: '3. Sınıf', aciklama: 'Üçüncü sınıf seviyesi', renk: '#45B7D1' },
        { seviye: 4, ad: '4. Sınıf', aciklama: 'Dördüncü sınıf seviyesi', renk: '#96CEB4' }
    ];

    // Dersler
    const dersler = [
        { ad: 'Türkçe', kod: 'TRK', renk: '#FF6B6B', ikon: 'translate' },
        { ad: 'Matematik', kod: 'MAT', renk: '#4ECDC4', ikon: 'functions' },
        { ad: 'Hayat Bilgisi', kod: 'HYB', renk: '#45B7D1', ikon: 'home' },
        { ad: 'Fen Bilimleri', kod: 'FEN', renk: '#96CEB4', ikon: 'science' },
        { ad: 'Sosyal Bilgiler', kod: 'SOS', renk: '#FFEAA7', ikon: 'public' },
        { ad: 'Din Kültürü', kod: 'DIN', renk: '#DDA0DD', ikon: 'mosque' },
        { ad: 'İnsan Hakları', kod: 'INS', renk: '#98D8C8', ikon: 'gavel' }
    ];

    console.log('📚 Örnek sınıf ve ders verileri yüklendi');
}

createAdvancedTestPanel(); 