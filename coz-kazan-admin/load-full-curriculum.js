const http = require('http');

const curriculum = [
  {
    sinif: 1,
    dersler: {
      'Türkçe': [
        'Güzel Davranışlarımız',
        'Mustafa Kemal’den Atatürk’e',
        'Çevremizdeki Yaşam',
        'Yol Arkadaşımız Kitaplar',
        'Yeteneklerimizi Keşfediyoruz',
        'Minik Kâşifler',
        'Atalarımızın İzleri',
        'Sorumluluklarımızın Farkındayız',
      ],
      'Matematik': [
        'Nesnelerin Geometrisi (1)',
        'Sayılar ve Nicelikler (1)',
        'Sayılar ve Nicelikler (2)',
        'İşlemlerden Cebirsel Düşünmeye',
        'Sayılar ve Nicelikler (3)',
        'Nesnelerin Geometrisi (2)',
        'Veriye Dayalı Araştırma',
      ],
      'Hayat Bilgisi': [
        'Ben ve Okulum',
        'Sağlığım ve Güvenliğim',
        'Ailem ve Toplum',
        'Yaşadığım Yer ve Ülkem',
        'Doğa ve Çevre',
        'Bilim, Teknoloji ve Sanat',
      ],
    },
  },
  {
    sinif: 2,
    dersler: {
      'Türkçe': [
        'Değerlerimizle Varız',
        'Atatürk ve Çocuk',
        'Doğada Neler Oluyor?',
        'Okuma Serüvenimiz',
        'Yeteneklerimizi Tanıyoruz',
        'Mucit Çocuk',
        'Kültür Hazinemiz',
        'Haklarımızı Biliyoruz',
      ],
      'Matematik': [
        'Nesnelerin Geometrisi (1)',
        'Sayılar ve Nicelikler (1)',
        'İşlemlerden Cebirsel Düşünmeye',
        'Sayılar ve Nicelikler (2)',
        'Nesnelerin Geometrisi (2)',
        'Veriye Dayalı Araştırma',
      ],
      'Hayat Bilgisi': [
        'Ben ve Okulum',
        'Sağlığım ve Güvenliğim',
        'Ailem ve Toplum',
        'Yaşadığım Yer ve Ülkem',
        'Doğa ve Çevre',
        'Bilim, Teknoloji ve Sanat',
      ],
    },
  },
  {
    sinif: 3,
    dersler: {
      'Türkçe': [
        'Değerlerimizle Yaşıyoruz',
        'Atatürk ve Kahramanlarımız',
        'Doğayı Tanıyoruz',
        'Bilgi Hazinemiz',
        'Yeteneklerimizi Kullanıyoruz',
        'Bilim Yolculuğu',
        'Millî Kültürümüz',
        'Hak ve Sorumluluklarımız',
      ],
      'Matematik': [
        'Sayılar ve Nicelikler (1)',
        'Sayılar ve Nicelikler (2)',
        'İşlemlerden Cebirsel Düşünmeye',
        'Nesnelerin Geometrisi (1)',
        'Nesnelerin Geometrisi (2)',
        'Veriye Dayalı Araştırma',
      ],
      'Hayat Bilgisi': [
        'Ben ve Okulum',
        'Sağlığım ve Güvenliğim',
        'Ailem ve Toplum',
        'Yaşadığım Yer ve Ülkem',
        'Doğa ve Çevre',
        'Bilim, Teknoloji ve Sanat',
      ],
      'Fen Bilimleri': [
        'Bilimsel Keşif Yolculuğu',
        'Canlılar Dünyasına Yolculuk',
        'Yer Bilimciler İş Başında',
        'Maddeyi Tanıyalım',
        'Hareketi Keşfediyorum',
        'Yaşamımızı Kolaylaştıran Elektrik',
        'Toprağı Tanıyorum',
        'Canlıların Yaşam Alanlarına Yolculuk',
      ],
    },
  },
  {
    sinif: 4,
    dersler: {
      'Türkçe': [
        'Erdemler',
        'Millî Mücadele ve Atatürk',
        'Doğa ve İnsan',
        'Kütüphanemiz',
        'Kendimizi Geliştiriyoruz',
        'Bilim ve Teknoloji',
        'Geçmişten Geleceğe Mirasımız',
        'Demokratik Yaşam',
      ],
      'Matematik': [
        'Sayılar ve Nicelikler (1)',
        'Sayılar ve Nicelikler (2)',
        'İşlemlerden Cebirsel Düşünmeye',
        'Nesnelerin Geometrisi (1)',
        'Nesnelerin Geometrisi (2)',
        'Nesnelerin Geometrisi (3)',
        'Olayların Olasılığı ve Veriye Dayalı Araştırma',
      ],
      'Sosyal Bilgiler': [
        'Birlikte Yaşamak',
        'Evimiz Dünya',
        'Ortak Mirasımız',
        'Yaşayan Demokrasimiz',
        'Hayatımdaki Ekonomi',
        'Teknoloji ve Sosyal Bilimler',
      ],
      'Fen Bilimleri': [
        'Bilime Yolculuk',
        'Sağlıklı Besleniyoruz',
        'Dünyamızı Keşfedelim',
        'Maddenin Değişimi',
        'Mıknatısı Keşfediyorum',
        'Enerji Dedektifleri',
        'Işığın Peşinde',
        'Sürdürülebilir Şehirler ve Topluluklar',
      ],
      'Din Kültürü': [
        'Günlük Hayat ve Din',
        'Allah Sevgisi',
        'Peygamberlerin Sevgisi',
        'Ahlaki Değerlerimiz',
        'Haklar ve Sorumluluklar',
      ],
      'İnsan Hakları': [
        'Çocuk Olarak Haklarımla Varım',
        'Hayatımda Eşitlik ve Adalet',
        'Etkin Bir Vatandaşım',
        'Hayatımda Demokrasi',
      ],
    },
  },
];

const login = async () => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ email: 'admin@cozkazan.com', password: 'admin123' });
    const req = http.request({
      hostname: 'localhost',
      port: 8055,
      path: '/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve(json.data.access_token);
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
};

const getOrCreate = async (token, collection, filter, data) => {
  // Filtre kontrolü
  if (!filter || typeof filter !== 'object') {
    throw new Error(`Geçersiz filtre: ${JSON.stringify(filter)}`);
  }

  // Varsa getir
  const filterStr = encodeURIComponent(JSON.stringify(filter));
  const getPath = `/${collection}?filter=${filterStr}`;
  const found = await fetchDirectus(token, getPath, 'GET');
  if (found && found.data && found.data.length > 0) {
    return { id: found.data[0].id, foundOrCreated: 'found', object: found.data[0] };
  }

  // Yoksa oluştur
  const created = await fetchDirectus(token, `/${collection}`, 'POST', data);

  if (!created || !created.data || !created.data.id) {
    console.error(`❌ Hata: ${collection} koleksiyonuna veri eklenemedi!`);
    console.error('API cevabı:', JSON.stringify(created, null, 2));
    throw new Error(`API hatası: ${collection} - ${JSON.stringify(created)}`);
  }

  return { id: created.data.id, foundOrCreated: 'created', object: created.data };
};

const fetchDirectus = (token, path, method, data) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8055,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };
    let body = '';
    const req = http.request(options, (res) => {
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
};

(async () => {
  const token = await login();
  for (const s of curriculum) {
    // Sınıf
    const sinifId = await getOrCreate(token, 'siniflar', { seviye: s.sinif }, { seviye: s.sinif, ad: `${s.sinif}. Sınıf`, aktif: true });
    for (const dersAd in s.dersler) {
      // Ders
      const dersId = await getOrCreate(token, 'dersler', { ad: dersAd }, { ad: dersAd, aktif: true });
      for (const konuAd of s.dersler[dersAd]) {
        // Konu
        await getOrCreate(token, 'konular', { ad: konuAd, ders_id: dersId, sinif_id: sinifId }, { ad: konuAd, ders_id: dersId, sinif_id: sinifId, aktif: true });
      }
    }
  }
  console.log('✅ Tüm sınıf, ders ve konular başarıyla yüklendi!');
})(); 