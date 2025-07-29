const { createDirectus, rest, authentication, createCollection, createField } = require('@directus/sdk');

const client = createDirectus('http://localhost:3000').with(rest()).with(authentication());

async function createCollections() {
  try {
    // Admin ile giriş yap
    await client.login({ email: 'admin@cozkazan.com', password: 'admin123' });
    
    console.log('✅ Admin girişi başarılı');
    
    // 1. kullanicilar koleksiyonu
    await client.request(createCollection({
      collection: 'kullanicilar',
      meta: {
        collection: 'kullanicilar',
        icon: 'people',
        note: 'Kullanıcı yönetimi',
        display_template: '{{ad}} {{soyad}}',
        hidden: false,
        singleton: false,
        translations: [
          {
            language: 'tr-TR',
            translation: 'Kullanıcılar'
          }
        ]
      },
      schema: {
        name: 'kullanicilar'
      }
    }));
    
    // kullanicilar alanları
    await client.request(createField('kullanicilar', {
      field: 'ad',
      type: 'string',
      meta: {
        interface: 'input',
        display: 'raw',
        required: true,
        translations: [{ language: 'tr-TR', translation: 'Ad' }]
      }
    }));
    
    await client.request(createField('kullanicilar', {
      field: 'soyad',
      type: 'string',
      meta: {
        interface: 'input',
        display: 'raw',
        required: true,
        translations: [{ language: 'tr-TR', translation: 'Soyad' }]
      }
    }));
    
    await client.request(createField('kullanicilar', {
      field: 'telefon',
      type: 'string',
      meta: {
        interface: 'input',
        display: 'raw',
        translations: [{ language: 'tr-TR', translation: 'Telefon' }]
      }
    }));
    
    await client.request(createField('kullanicilar', {
      field: 'tip',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        display: 'labels',
        required: true,
        options: {
          choices: [
            { text: 'Veli', value: 'veli' },
            { text: 'Çocuk', value: 'cocuk' },
            { text: 'Admin', value: 'admin' }
          ]
        },
        translations: [{ language: 'tr-TR', translation: 'Tip' }]
      }
    }));
    
    await client.request(createField('kullanicilar', {
      field: 'sinif',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        display: 'raw',
        options: {
          choices: [
            { text: '1. Sınıf', value: '1' },
            { text: '2. Sınıf', value: '2' },
            { text: '3. Sınıf', value: '3' },
            { text: '4. Sınıf', value: '4' }
          ]
        },
        translations: [{ language: 'tr-TR', translation: 'Sınıf' }]
      }
    }));
    
    await client.request(createField('kullanicilar', {
      field: 'xp',
      type: 'integer',
      meta: {
        interface: 'input',
        display: 'raw',
        translations: [{ language: 'tr-TR', translation: 'XP Puanı' }]
      },
      schema: {
        default_value: 0
      }
    }));
    
    await client.request(createField('kullanicilar', {
      field: 'parent_id',
      type: 'uuid',
      meta: {
        interface: 'select-dropdown-m2o',
        display: 'related-values',
        special: ['m2o'],
        translations: [{ language: 'tr-TR', translation: 'Veli' }]
      }
    }));
    
    console.log('✅ kullanicilar koleksiyonu oluşturuldu');
    
    // 2. testler koleksiyonu
    await client.request(createCollection({
      collection: 'testler',
      meta: {
        collection: 'testler',
        icon: 'quiz',
        note: 'Test yönetimi',
        display_template: '{{test_adi}}',
        hidden: false,
        singleton: false,
        translations: [
          {
            language: 'tr-TR',
            translation: 'Testler'
          }
        ]
      },
      schema: {
        name: 'testler'
      }
    }));
    
    // testler alanları
    await client.request(createField('testler', {
      field: 'sinif',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        display: 'raw',
        required: true,
        options: {
          choices: [
            { text: '1. Sınıf', value: '1' },
            { text: '2. Sınıf', value: '2' },
            { text: '3. Sınıf', value: '3' },
            { text: '4. Sınıf', value: '4' }
          ]
        },
        translations: [{ language: 'tr-TR', translation: 'Sınıf' }]
      }
    }));
    
    await client.request(createField('testler', {
      field: 'ders',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        display: 'raw',
        required: true,
        options: {
          choices: [
            { text: 'Türkçe', value: 'turkce' },
            { text: 'Matematik', value: 'matematik' },
            { text: 'Hayat Bilgisi', value: 'hayat_bilgisi' },
            { text: 'Fen Bilimleri', value: 'fen_bilimleri' }
          ]
        },
        translations: [{ language: 'tr-TR', translation: 'Ders' }]
      }
    }));
    
    await client.request(createField('testler', {
      field: 'konu',
      type: 'string',
      meta: {
        interface: 'input',
        display: 'raw',
        required: true,
        translations: [{ language: 'tr-TR', translation: 'Konu' }]
      }
    }));
    
    await client.request(createField('testler', {
      field: 'test_adi',
      type: 'string',
      meta: {
        interface: 'input',
        display: 'raw',
        required: true,
        translations: [{ language: 'tr-TR', translation: 'Test Adı' }]
      }
    }));
    
    await client.request(createField('testler', {
      field: 'sorular',
      type: 'json',
      meta: {
        interface: 'input-code',
        display: 'raw',
        options: {
          language: 'json'
        },
        translations: [{ language: 'tr-TR', translation: 'Sorular' }]
      }
    }));
    
    console.log('✅ testler koleksiyonu oluşturuldu');
    
    // 3. hikayeler koleksiyonu
    await client.request(createCollection({
      collection: 'hikayeler',
      meta: {
        collection: 'hikayeler',
        icon: 'auto_stories',
        note: 'Hikaye yönetimi',
        display_template: '{{baslik}}',
        hidden: false,
        singleton: false,
        translations: [
          {
            language: 'tr-TR',
            translation: 'Hikayeler'
          }
        ]
      },
      schema: {
        name: 'hikayeler'
      }
    }));
    
    // hikayeler alanları
    await client.request(createField('hikayeler', {
      field: 'baslik',
      type: 'string',
      meta: {
        interface: 'input',
        display: 'raw',
        required: true,
        translations: [{ language: 'tr-TR', translation: 'Başlık' }]
      }
    }));
    
    await client.request(createField('hikayeler', {
      field: 'icerik',
      type: 'text',
      meta: {
        interface: 'input-rich-text-html',
        display: 'raw',
        required: true,
        translations: [{ language: 'tr-TR', translation: 'İçerik' }]
      }
    }));
    
    await client.request(createField('hikayeler', {
      field: 'kategori',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        display: 'raw',
        required: true,
        options: {
          choices: [
            { text: 'Masal', value: 'masal' },
            { text: 'Macera', value: 'macera' },
            { text: 'Eğitim', value: 'egitim' },
            { text: 'Bilim', value: 'bilim' }
          ]
        },
        translations: [{ language: 'tr-TR', translation: 'Kategori' }]
      }
    }));
    
    await client.request(createField('hikayeler', {
      field: 'ekleyen',
      type: 'uuid',
      meta: {
        interface: 'select-dropdown-m2o',
        display: 'related-values',
        special: ['m2o'],
        translations: [{ language: 'tr-TR', translation: 'Ekleyen' }]
      }
    }));
    
    console.log('✅ hikayeler koleksiyonu oluşturuldu');
    
    // 4. gorevler koleksiyonu
    await client.request(createCollection({
      collection: 'gorevler',
      meta: {
        collection: 'gorevler',
        icon: 'task',
        note: 'Görev yönetimi',
        display_template: '{{aciklama}}',
        hidden: false,
        singleton: false,
        translations: [
          {
            language: 'tr-TR',
            translation: 'Görevler'
          }
        ]
      },
      schema: {
        name: 'gorevler'
      }
    }));
    
    // gorevler alanları
    await client.request(createField('gorevler', {
      field: 'aciklama',
      type: 'text',
      meta: {
        interface: 'input-multiline',
        display: 'raw',
        required: true,
        translations: [{ language: 'tr-TR', translation: 'Açıklama' }]
      }
    }));
    
    await client.request(createField('gorevler', {
      field: 'puan',
      type: 'integer',
      meta: {
        interface: 'input',
        display: 'raw',
        required: true,
        translations: [{ language: 'tr-TR', translation: 'Puan' }]
      }
    }));
    
    await client.request(createField('gorevler', {
      field: 'tarih',
      type: 'datetime',
      meta: {
        interface: 'datetime',
        display: 'datetime',
        required: true,
        translations: [{ language: 'tr-TR', translation: 'Tarih' }]
      }
    }));
    
    await client.request(createField('gorevler', {
      field: 'onayli',
      type: 'boolean',
      meta: {
        interface: 'boolean',
        display: 'boolean',
        translations: [{ language: 'tr-TR', translation: 'Onaylı' }]
      },
      schema: {
        default_value: false
      }
    }));
    
    await client.request(createField('gorevler', {
      field: 'ekleyen',
      type: 'uuid',
      meta: {
        interface: 'select-dropdown-m2o',
        display: 'related-values',
        special: ['m2o'],
        translations: [{ language: 'tr-TR', translation: 'Ekleyen' }]
      }
    }));
    
    console.log('✅ gorevler koleksiyonu oluşturuldu');
    
    // 5. basarilar koleksiyonu
    await client.request(createCollection({
      collection: 'basarilar',
      meta: {
        collection: 'basarilar',
        icon: 'emoji_events',
        note: 'Başarı takibi',
        display_template: '{{aciklama}}',
        hidden: false,
        singleton: false,
        translations: [
          {
            language: 'tr-TR',
            translation: 'Başarılar'
          }
        ]
      },
      schema: {
        name: 'basarilar'
      }
    }));
    
    // basarilar alanları
    await client.request(createField('basarilar', {
      field: 'kullanici_id',
      type: 'uuid',
      meta: {
        interface: 'select-dropdown-m2o',
        display: 'related-values',
        special: ['m2o'],
        required: true,
        translations: [{ language: 'tr-TR', translation: 'Kullanıcı' }]
      }
    }));
    
    await client.request(createField('basarilar', {
      field: 'aciklama',
      type: 'text',
      meta: {
        interface: 'input-multiline',
        display: 'raw',
        required: true,
        translations: [{ language: 'tr-TR', translation: 'Açıklama' }]
      }
    }));
    
    await client.request(createField('basarilar', {
      field: 'xp',
      type: 'integer',
      meta: {
        interface: 'input',
        display: 'raw',
        required: true,
        translations: [{ language: 'tr-TR', translation: 'XP' }]
      }
    }));
    
    await client.request(createField('basarilar', {
      field: 'rozet',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        display: 'raw',
        options: {
          choices: [
            { text: 'Altın', value: 'altin' },
            { text: 'Gümüş', value: 'gumus' },
            { text: 'Bronz', value: 'bronz' }
          ]
        },
        translations: [{ language: 'tr-TR', translation: 'Rozet' }]
      }
    }));
    
    await client.request(createField('basarilar', {
      field: 'tarih',
      type: 'datetime',
      meta: {
        interface: 'datetime',
        display: 'datetime',
        required: true,
        translations: [{ language: 'tr-TR', translation: 'Tarih' }]
      }
    }));
    
    console.log('✅ basarilar koleksiyonu oluşturuldu');
    
    // 6. ai_analiz koleksiyonu
    await client.request(createCollection({
      collection: 'ai_analiz',
      meta: {
        collection: 'ai_analiz',
        icon: 'psychology',
        note: 'AI analiz yönetimi',
        display_template: '{{icerik}}',
        hidden: false,
        singleton: false,
        translations: [
          {
            language: 'tr-TR',
            translation: 'AI Analiz'
          }
        ]
      },
      schema: {
        name: 'ai_analiz'
      }
    }));
    
    // ai_analiz alanları
    await client.request(createField('ai_analiz', {
      field: 'hedef',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        display: 'raw',
        required: true,
        options: {
          choices: [
            { text: 'Veli', value: 'veli' },
            { text: 'Çocuk', value: 'cocuk' }
          ]
        },
        translations: [{ language: 'tr-TR', translation: 'Hedef' }]
      }
    }));
    
    await client.request(createField('ai_analiz', {
      field: 'icerik',
      type: 'text',
      meta: {
        interface: 'input-multiline',
        display: 'raw',
        required: true,
        translations: [{ language: 'tr-TR', translation: 'İçerik' }]
      }
    }));
    
    await client.request(createField('ai_analiz', {
      field: 'analiz_kaynak',
      type: 'uuid',
      meta: {
        interface: 'select-dropdown-m2o',
        display: 'related-values',
        special: ['m2o'],
        translations: [{ language: 'tr-TR', translation: 'Analiz Kaynak' }]
      }
    }));
    
    await client.request(createField('ai_analiz', {
      field: 'gpt_yanit',
      type: 'text',
      meta: {
        interface: 'input-multiline',
        display: 'raw',
        translations: [{ language: 'tr-TR', translation: 'GPT Yanıt' }]
      }
    }));
    
    await client.request(createField('ai_analiz', {
      field: 'tarih',
      type: 'datetime',
      meta: {
        interface: 'datetime',
        display: 'datetime',
        required: true,
        translations: [{ language: 'tr-TR', translation: 'Tarih' }]
      }
    }));
    
    console.log('✅ ai_analiz koleksiyonu oluşturuldu');
    
    console.log('\n🎉 Tüm koleksiyonlar başarıyla oluşturuldu!');
    
  } catch (error) {
    console.error('❌ Hata:', error);
  }
}

createCollections(); 