const { createDirectus, rest, authentication, createCollection, createField, createRelation } = require('@directus/sdk');

const client = createDirectus('http://localhost:8055').with(rest()).with(authentication());

async function createCollections() {
    try {
        // Admin olarak giriş yap
        await client.login({
            email: 'admin@cozkazan.com',
            password: 'admin123'
        });
        console.log('✅ Admin girişi başarılı');

        // 1. KULLANICILAR Koleksiyonu
        console.log('📝 Kullanıcılar koleksiyonu oluşturuluyor...');
        await client.request(createCollection({
            collection: 'kullanicilar',
            meta: {
                collection: 'kullanicilar',
                icon: 'people',
                note: 'Uygulama kullanıcıları (veliler ve çocuklar)',
                display_template: '{{ad}} {{soyad}} ({{email}})',
                hidden: false,
                singleton: false,
                translations: [
                    { language: 'tr-TR', translation: 'Kullanıcılar' },
                    { language: 'en-US', translation: 'Users' }
                ]
            },
            schema: {
                name: 'kullanicilar'
            }
        }));

        // Kullanıcılar alanları
        const kullaniciFields = [
            { field: 'ad', type: 'string', meta: { required: true, note: 'Kullanıcının adı' } },
            { field: 'soyad', type: 'string', meta: { required: true, note: 'Kullanıcının soyadı' } },
            { field: 'email', type: 'string', meta: { required: true, note: 'E-posta adresi' } },
            { field: 'telefon', type: 'string', meta: { note: 'Telefon numarası' } },
            { field: 'rol', type: 'string', meta: { 
                required: true, 
                note: 'Kullanıcı rolü',
                interface: 'select-dropdown',
                options: {
                    choices: [
                        { text: 'Admin', value: 'admin' },
                        { text: 'Veli', value: 'veli' },
                        { text: 'Çocuk', value: 'cocuk' }
                    ]
                }
            }},
            { field: 'yas', type: 'integer', meta: { note: 'Yaş bilgisi' } },
            { field: 'sinif', type: 'string', meta: { note: 'Sınıf seviyesi' } },
            { field: 'aktif', type: 'boolean', meta: { note: 'Hesap aktif mi?', default_value: true } },
            { field: 'kayit_tarihi', type: 'timestamp', meta: { note: 'Kayıt tarihi', default_value: '$NOW' } },
            { field: 'son_giris', type: 'timestamp', meta: { note: 'Son giriş zamanı' } },
            { field: 'toplam_xp', type: 'integer', meta: { note: 'Toplam XP puanı', default_value: 0 } },
            { field: 'seviye', type: 'integer', meta: { note: 'Kullanıcı seviyesi', default_value: 1 } }
        ];

        for (const field of kullaniciFields) {
            await client.request(createField('kullanicilar', field));
        }

        // 2. SINIFLAR Koleksiyonu
        console.log('📝 Sınıflar koleksiyonu oluşturuluyor...');
        await client.request(createCollection({
            collection: 'siniflar',
            meta: {
                collection: 'siniflar',
                icon: 'school',
                note: 'Sınıf seviyeleri',
                display_template: '{{seviye}}. Sınıf',
                translations: [
                    { language: 'tr-TR', translation: 'Sınıflar' },
                    { language: 'en-US', translation: 'Classes' }
                ]
            }
        }));

        const sinifFields = [
            { field: 'seviye', type: 'integer', meta: { required: true, note: 'Sınıf seviyesi (1-8)' } },
            { field: 'ad', type: 'string', meta: { required: true, note: 'Sınıf adı' } },
            { field: 'aciklama', type: 'text', meta: { note: 'Sınıf açıklaması' } }
        ];

        for (const field of sinifFields) {
            await client.request(createField('siniflar', field));
        }

        // 3. DERSLER Koleksiyonu
        console.log('📝 Dersler koleksiyonu oluşturuluyor...');
        await client.request(createCollection({
            collection: 'dersler',
            meta: {
                collection: 'dersler',
                icon: 'book',
                note: 'Ders kategorileri',
                display_template: '{{ad}}',
                translations: [
                    { language: 'tr-TR', translation: 'Dersler' },
                    { language: 'en-US', translation: 'Subjects' }
                ]
            }
        }));

        const dersFields = [
            { field: 'ad', type: 'string', meta: { required: true, note: 'Ders adı' } },
            { field: 'kod', type: 'string', meta: { required: true, note: 'Ders kodu' } },
            { field: 'renk', type: 'string', meta: { note: 'Ders rengi', interface: 'input-color' } },
            { field: 'ikon', type: 'string', meta: { note: 'Ders ikonu' } },
            { field: 'aciklama', type: 'text', meta: { note: 'Ders açıklaması' } }
        ];

        for (const field of dersFields) {
            await client.request(createField('dersler', field));
        }

        // 4. KONULAR Koleksiyonu
        console.log('📝 Konular koleksiyonu oluşturuluyor...');
        await client.request(createCollection({
            collection: 'konular',
            meta: {
                collection: 'konular',
                icon: 'topic',
                note: 'Ders konuları',
                display_template: '{{ad}} ({{ders.ad}})',
                translations: [
                    { language: 'tr-TR', translation: 'Konular' },
                    { language: 'en-US', translation: 'Topics' }
                ]
            }
        }));

        const konuFields = [
            { field: 'ad', type: 'string', meta: { required: true, note: 'Konu adı' } },
            { field: 'ders_id', type: 'integer', meta: { required: true, note: 'Bağlı ders' } },
            { field: 'sinif_id', type: 'integer', meta: { required: true, note: 'Sınıf seviyesi' } },
            { field: 'sira', type: 'integer', meta: { note: 'Sıralama', default_value: 1 } },
            { field: 'aciklama', type: 'text', meta: { note: 'Konu açıklaması' } }
        ];

        for (const field of konuFields) {
            await client.request(createField('konular', field));
        }

        // 5. TESTLER Koleksiyonu (Ana Test Yönetimi)
        console.log('📝 Testler koleksiyonu oluşturuluyor...');
        await client.request(createCollection({
            collection: 'testler',
            meta: {
                collection: 'testler',
                icon: 'quiz',
                note: 'Test ve sınav yönetimi',
                display_template: '{{baslik}} ({{sinif.seviye}}. Sınıf)',
                translations: [
                    { language: 'tr-TR', translation: 'Testler' },
                    { language: 'en-US', translation: 'Tests' }
                ]
            }
        }));

        const testFields = [
            { field: 'baslik', type: 'string', meta: { required: true, note: 'Test başlığı' } },
            { field: 'aciklama', type: 'text', meta: { note: 'Test açıklaması' } },
            { field: 'sinif_id', type: 'integer', meta: { required: true, note: 'Sınıf seviyesi' } },
            { field: 'ders_id', type: 'integer', meta: { required: true, note: 'Ders kategorisi' } },
            { field: 'konu_id', type: 'integer', meta: { note: 'Spesifik konu' } },
            { field: 'zorluk', type: 'string', meta: { 
                note: 'Zorluk seviyesi',
                interface: 'select-dropdown',
                options: {
                    choices: [
                        { text: 'Kolay', value: 'kolay' },
                        { text: 'Orta', value: 'orta' },
                        { text: 'Zor', value: 'zor' }
                    ]
                }
            }},
            { field: 'sure', type: 'integer', meta: { note: 'Test süresi (dakika)' } },
            { field: 'soru_sayisi', type: 'integer', meta: { note: 'Toplam soru sayısı' } },
            { field: 'aktif', type: 'boolean', meta: { note: 'Test aktif mi?', default_value: true } },
            { field: 'olusturma_tarihi', type: 'timestamp', meta: { note: 'Oluşturma tarihi', default_value: '$NOW' } },
            { field: 'guncelleme_tarihi', type: 'timestamp', meta: { note: 'Güncelleme tarihi' } }
        ];

        for (const field of testFields) {
            await client.request(createField('testler', field));
        }

        // 6. TEST SORULARI Koleksiyonu
        console.log('📝 Test Soruları koleksiyonu oluşturuluyor...');
        await client.request(createCollection({
            collection: 'test_sorulari',
            meta: {
                collection: 'test_sorulari',
                icon: 'help',
                note: 'Test soruları ve cevapları',
                display_template: '{{soru_metni}}',
                translations: [
                    { language: 'tr-TR', translation: 'Test Soruları' },
                    { language: 'en-US', translation: 'Test Questions' }
                ]
            }
        }));

        const soruFields = [
            { field: 'test_id', type: 'integer', meta: { required: true, note: 'Bağlı test' } },
            { field: 'soru_metni', type: 'text', meta: { required: true, note: 'Soru metni' } },
            { field: 'soru_tipi', type: 'string', meta: { 
                required: true,
                note: 'Soru tipi',
                interface: 'select-dropdown',
                options: {
                    choices: [
                        { text: 'Çoktan Seçmeli', value: 'coktan_secmeli' },
                        { text: 'Doğru/Yanlış', value: 'dogru_yanlis' },
                        { text: 'Boşluk Doldurma', value: 'bosluk_doldurma' },
                        { text: 'Eşleştirme', value: 'eslestirme' }
                    ]
                }
            }},
            { field: 'secenekler', type: 'json', meta: { note: 'Soru seçenekleri (JSON format)' } },
            { field: 'dogru_cevap', type: 'string', meta: { required: true, note: 'Doğru cevap' } },
            { field: 'puan', type: 'integer', meta: { note: 'Soru puanı', default_value: 10 } },
            { field: 'zorluk', type: 'string', meta: { 
                note: 'Soru zorluğu',
                interface: 'select-dropdown',
                options: {
                    choices: [
                        { text: 'Kolay', value: 'kolay' },
                        { text: 'Orta', value: 'orta' },
                        { text: 'Zor', value: 'zor' }
                    ]
                }
            }},
            { field: 'aciklama', type: 'text', meta: { note: 'Soru açıklaması' } },
            { field: 'resim', type: 'uuid', meta: { note: 'Soru resmi' } },
            { field: 'sira', type: 'integer', meta: { note: 'Soru sırası' } }
        ];

        for (const field of soruFields) {
            await client.request(createField('test_sorulari', field));
        }

        // 7. HIKAYELER Koleksiyonu
        console.log('📝 Hikayeler koleksiyonu oluşturuluyor...');
        await client.request(createCollection({
            collection: 'hikayeler',
            meta: {
                collection: 'hikayeler',
                icon: 'auto_stories',
                note: 'Eğitici hikayeler',
                display_template: '{{baslik}} ({{yas_grubu}})',
                translations: [
                    { language: 'tr-TR', translation: 'Hikayeler' },
                    { language: 'en-US', translation: 'Stories' }
                ]
            }
        }));

        const hikayeFields = [
            { field: 'baslik', type: 'string', meta: { required: true, note: 'Hikaye başlığı' } },
            { field: 'icerik', type: 'text', meta: { required: true, note: 'Hikaye içeriği' } },
            { field: 'yas_grubu', type: 'string', meta: { note: 'Hedef yaş grubu' } },
            { field: 'kategori', type: 'string', meta: { note: 'Hikaye kategorisi' } },
            { field: 'kapak_resmi', type: 'uuid', meta: { note: 'Kapak resmi' } },
            { field: 'sure', type: 'integer', meta: { note: 'Okuma süresi (dakika)' } },
            { field: 'yazar', type: 'string', meta: { note: 'Hikaye yazarı' } },
            { field: 'aktif', type: 'boolean', meta: { note: 'Hikaye aktif mi?', default_value: true } },
            { field: 'olusturma_tarihi', type: 'timestamp', meta: { note: 'Oluşturma tarihi', default_value: '$NOW' } }
        ];

        for (const field of hikayeFields) {
            await client.request(createField('hikayeler', field));
        }

        // 8. GOREVLER Koleksiyonu
        console.log('📝 Görevler koleksiyonu oluşturuluyor...');
        await client.request(createCollection({
            collection: 'gorevler',
            meta: {
                collection: 'gorevler',
                icon: 'task',
                note: 'Sosyal görevler ve aktiviteler',
                display_template: '{{baslik}} ({{puan}} XP)',
                translations: [
                    { language: 'tr-TR', translation: 'Görevler' },
                    { language: 'en-US', translation: 'Tasks' }
                ]
            }
        }));

        const gorevFields = [
            { field: 'baslik', type: 'string', meta: { required: true, note: 'Görev başlığı' } },
            { field: 'aciklama', type: 'text', meta: { required: true, note: 'Görev açıklaması' } },
            { field: 'kategori', type: 'string', meta: { 
                note: 'Görev kategorisi',
                interface: 'select-dropdown',
                options: {
                    choices: [
                        { text: 'Günlük', value: 'gunluk' },
                        { text: 'Haftalık', value: 'haftalik' },
                        { text: 'Özel', value: 'ozel' }
                    ]
                }
            }},
            { field: 'puan', type: 'integer', meta: { note: 'Görev puanı', default_value: 50 } },
            { field: 'zorluk', type: 'string', meta: { 
                note: 'Görev zorluğu',
                interface: 'select-dropdown',
                options: {
                    choices: [
                        { text: 'Kolay', value: 'kolay' },
                        { text: 'Orta', value: 'orta' },
                        { text: 'Zor', value: 'zor' }
                    ]
                }
            }},
            { field: 'yas_grubu', type: 'string', meta: { note: 'Hedef yaş grubu' } },
            { field: 'aktif', type: 'boolean', meta: { note: 'Görev aktif mi?', default_value: true } },
            { field: 'olusturma_tarihi', type: 'timestamp', meta: { note: 'Oluşturma tarihi', default_value: '$NOW' } }
        ];

        for (const field of gorevFields) {
            await client.request(createField('gorevler', field));
        }

        // 9. BASARILAR Koleksiyonu
        console.log('📝 Başarılar koleksiyonu oluşturuluyor...');
        await client.request(createCollection({
            collection: 'basarilar',
            meta: {
                collection: 'basarilar',
                icon: 'emoji_events',
                note: 'Başarım sistemi',
                display_template: '{{baslik}} ({{puan}} XP)',
                translations: [
                    { language: 'tr-TR', translation: 'Başarılar' },
                    { language: 'en-US', translation: 'Achievements' }
                ]
            }
        }));

        const basariFields = [
            { field: 'baslik', type: 'string', meta: { required: true, note: 'Başarı başlığı' } },
            { field: 'aciklama', type: 'text', meta: { required: true, note: 'Başarı açıklaması' } },
            { field: 'ikon', type: 'string', meta: { note: 'Başarı ikonu' } },
            { field: 'puan', type: 'integer', meta: { note: 'Başarı puanı', default_value: 100 } },
            { field: 'kosul', type: 'json', meta: { note: 'Başarı koşulları (JSON)' } },
            { field: 'kategori', type: 'string', meta: { note: 'Başarı kategorisi' } },
            { field: 'nadir', type: 'boolean', meta: { note: 'Nadir başarı mı?', default_value: false } },
            { field: 'aktif', type: 'boolean', meta: { note: 'Başarı aktif mi?', default_value: true } }
        ];

        for (const field of basariFields) {
            await client.request(createField('basarilar', field));
        }

        // 10. AI ANALIZ Koleksiyonu
        console.log('📝 AI Analiz koleksiyonu oluşturuluyor...');
        await client.request(createCollection({
            collection: 'ai_analiz',
            meta: {
                collection: 'ai_analiz',
                icon: 'psychology',
                note: 'AI analiz verileri',
                display_template: '{{kullanici.ad}} - {{analiz_tipi}}',
                translations: [
                    { language: 'tr-TR', translation: 'AI Analiz' },
                    { language: 'en-US', translation: 'AI Analysis' }
                ]
            }
        }));

        const aiAnalizFields = [
            { field: 'kullanici_id', type: 'integer', meta: { required: true, note: 'Analiz edilen kullanıcı' } },
            { field: 'analiz_tipi', type: 'string', meta: { 
                required: true,
                note: 'Analiz türü',
                interface: 'select-dropdown',
                options: {
                    choices: [
                        { text: 'Performans', value: 'performans' },
                        { text: 'Davranış', value: 'davranis' },
                        { text: 'Öğrenme', value: 'ogrenme' },
                        { text: 'Sosyal', value: 'sosyal' }
                    ]
                }
            }},
            { field: 'veri', type: 'json', meta: { note: 'Analiz verileri (JSON)' } },
            { field: 'sonuc', type: 'text', meta: { note: 'Analiz sonucu' } },
            { field: 'oneriler', type: 'json', meta: { note: 'AI önerileri (JSON)' } },
            { field: 'skor', type: 'float', meta: { note: 'Analiz skoru' } },
            { field: 'tarih', type: 'timestamp', meta: { note: 'Analiz tarihi', default_value: '$NOW' } }
        ];

        for (const field of aiAnalizFields) {
            await client.request(createField('ai_analiz', field));
        }

        // İlişkileri oluştur
        console.log('🔗 İlişkiler oluşturuluyor...');
        
        // Konular -> Dersler ilişkisi
        await client.request(createRelation({
            collection: 'konular',
            field: 'ders_id',
            related_collection: 'dersler'
        }));

        // Konular -> Sınıflar ilişkisi
        await client.request(createRelation({
            collection: 'konular',
            field: 'sinif_id',
            related_collection: 'siniflar'
        }));

        // Testler -> Sınıflar ilişkisi
        await client.request(createRelation({
            collection: 'testler',
            field: 'sinif_id',
            related_collection: 'siniflar'
        }));

        // Testler -> Dersler ilişkisi
        await client.request(createRelation({
            collection: 'testler',
            field: 'ders_id',
            related_collection: 'dersler'
        }));

        // Testler -> Konular ilişkisi
        await client.request(createRelation({
            collection: 'testler',
            field: 'konu_id',
            related_collection: 'konular'
        }));

        // Test Soruları -> Testler ilişkisi
        await client.request(createRelation({
            collection: 'test_sorulari',
            field: 'test_id',
            related_collection: 'testler'
        }));

        // AI Analiz -> Kullanıcılar ilişkisi
        await client.request(createRelation({
            collection: 'ai_analiz',
            field: 'kullanici_id',
            related_collection: 'kullanicilar'
        }));

        console.log('✅ Tüm koleksiyonlar başarıyla oluşturuldu!');
        console.log('📊 Dashboard widget\'ları ve filtreler hazır!');
        console.log('📤 Excel/CSV toplu yükleme desteği aktif!');
        
    } catch (error) {
        console.error('❌ Hata:', error);
    }
}

createCollections(); 