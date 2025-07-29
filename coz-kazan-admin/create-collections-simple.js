const https = require('http');
const { createDirectus, rest, authentication, createCollection, createField, createRelation } = require('@directus/sdk');

const client = createDirectus('http://localhost:8055').with(rest()).with(authentication());

async function createTreeCollections() {
    await client.login({ email: 'admin@cozkazan.com', password: 'admin123' });
    // 1. siniflar
    await client.request(createCollection({
        collection: 'siniflar',
        meta: { collection: 'siniflar', icon: 'school', note: 'Sınıflar' },
        schema: { name: 'siniflar' }
    }));
    await client.request(createField('siniflar', { field: 'ad', type: 'string', meta: { required: true, note: 'Sınıf adı' } }));

    // 2. dersler
    await client.request(createCollection({
        collection: 'dersler',
        meta: { collection: 'dersler', icon: 'book', note: 'Dersler' },
        schema: { name: 'dersler' }
    }));
    await client.request(createField('dersler', { field: 'ad', type: 'string', meta: { required: true, note: 'Ders adı' } }));
    await client.request(createField('dersler', { field: 'sinif_id', type: 'integer', meta: { required: true, note: 'Bağlı sınıf', interface: 'select-dropdown' } }));
    await client.request(createRelation({
        collection: 'dersler',
        field: 'sinif_id',
        related_collection: 'siniflar',
        meta: { many_collection: 'dersler', many_field: 'sinif_id', one_collection: 'siniflar', one_field: null, sort_field: null },
        schema: { on_delete: 'CASCADE' }
    }));

    // 3. konular
    await client.request(createCollection({
        collection: 'konular',
        meta: { collection: 'konular', icon: 'topic', note: 'Konular' },
        schema: { name: 'konular' }
    }));
    await client.request(createField('konular', { field: 'ad', type: 'string', meta: { required: true, note: 'Konu adı' } }));
    await client.request(createField('konular', { field: 'ders_id', type: 'integer', meta: { required: true, note: 'Bağlı ders', interface: 'select-dropdown' } }));
    await client.request(createRelation({
        collection: 'konular',
        field: 'ders_id',
        related_collection: 'dersler',
        meta: { many_collection: 'konular', many_field: 'ders_id', one_collection: 'dersler', one_field: null, sort_field: null },
        schema: { on_delete: 'CASCADE' }
    }));

    console.log('✅ Sınıf → Ders → Konu koleksiyonları ve ilişkileri oluşturuldu!');
}

createTreeCollections(); 