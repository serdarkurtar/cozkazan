import express from 'express';
import multer from 'multer';
import Test from '../models/Test.js';
import xlsx from 'xlsx';
import fs from 'fs';
import TestHavuzu from '../models/TestHavuzu.js';
import { testiHavuzaEkle, getOrCreateVarsayilanHavuz } from '../utils/havuzYoneticisi.js';

const router = express.Router();

// Multer konfigürasyonu
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('Sadece Excel dosyaları kabul edilir!'), false);
    }
  }
});

// Test sınıflandırma doğrulama fonksiyonu
function validateTestClassification(sinif, ders, konu) {
  const errors = [];
  
  if (!sinif || sinif.trim() === '') {
    errors.push('Sınıf bilgisi eksik!');
  }
  
  if (!ders || ders.trim() === '') {
    errors.push('Ders bilgisi eksik!');
  }
  
  if (!konu || konu.trim() === '') {
    errors.push('Konu bilgisi eksik!');
  }
  
  // Sınıf formatı kontrolü
  if (sinif && !sinif.match(/^\d+\.\s*Sınıf$/)) {
    errors.push('Sınıf formatı yanlış! Örnek: "1. Sınıf"');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors,
    message: errors.length > 0 ? 
      '❌ Test sınıflandırma hatası:\n' + errors.join('\n') + 
      '\n\n💡 Doğru format:\n✅ Sınıf: "1. Sınıf"\n✅ Ders: "Türkçe"\n✅ Konu: "Güzel Davranışlarımız"' : 
      '✅ Test sınıflandırması doğru!'
  };
}

// Havuz ID'sine göre testleri getir
router.get('/havuz/:havuzId', async (req, res) => {
  try {
    const { havuzId } = req.params;
    
    console.log(`[API] GET /testler/havuz/${havuzId} - Havuz ID ile test arama`);
    
    // 1. Havuzu bul
    const havuz = await TestHavuzu.findById(havuzId);
    if (!havuz) {
      console.log(`[API] GET /testler/havuz/${havuzId} - Havuz bulunamadı`);
      return res.json({
        tests: [],
        havuz: null,
        message: '❌ Havuz bulunamadı'
      });
    }
    
    console.log(`[API] GET /testler/havuz/${havuzId} - Havuz bulundu: ${havuz.testler.length} test`);
    
    // 2. Havuzda test yoksa boş döndür
    if (!havuz.testler || havuz.testler.length === 0) {
      return res.json({
        tests: [],
        havuz: {
          id: havuz._id,
          testSayisi: 0,
          toplamSoru: havuz.toplamSoru,
          aktifTest: havuz.aktifTest,
          basariOrani: havuz.basariOrani
        },
        message: `ℹ️ Bu havuzda henüz test bulunmuyor - ${havuz.sinif} ${havuz.ders} ${havuz.konu}`
      });
    }
    
    // 3. Havuzdaki testleri getir
    const tests = await Test.find({ 
      _id: { $in: havuz.testler }
    }).sort({ createdAt: -1 });
    
    console.log(`[API] GET /testler/havuz/${havuzId} - ${tests.length} test bulundu`);
    
    return res.json({
      tests: tests,
      havuz: {
        id: havuz._id,
        testSayisi: tests.length,
        toplamSoru: havuz.toplamSoru,
        aktifTest: havuz.aktifTest,
        basariOrani: havuz.basariOrani
      },
      message: `✅ ${tests.length} test bulundu - ${havuz.sinif} ${havuz.ders} ${havuz.konu}`
    });
    
  } catch (error) {
    console.error('[API] GET /testler/havuz/:havuzId - Hata:', error);
    res.status(500).json({ error: error.message });
  }
});

// Tek test getir (düzenleme için)
router.get('/test/:id', async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ error: 'Test bulunamadı' });
    }
    res.json(test);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tüm testleri getir (ESKİ ENDPOINT - DEVRE DIŞI)
router.get('/', async (req, res) => {
  try {
    console.log(`[API] GET /testler - ESKİ ENDPOINT KULLANILDI! HAVUZ ID KULLANIN!`);
    
    // Eski endpoint'i devre dışı bırak, havuz ID kullan
    return res.status(400).json({
      error: 'Bu endpoint artık kullanılmıyor!',
      message: '❌ Lütfen /api/testler/havuz/:havuzId endpoint\'ini kullanın!',
      solution: 'Frontend\'de havuz ID ile API çağrısı yapın.'
    });
    
  } catch (error) {
    console.error('[API] GET /testler - Hata:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test güncelle
router.put('/:id', async (req, res) => {
  try {
    const { testAdi, aciklama, sinif, ders, konu, konuAdi, sorular, zorlukSeviyesi, sure, puan, aktif } = req.body;
    
    // Sınıflandırma doğrulaması
    const validation = validateTestClassification(sinif, ders, konu);
    if (!validation.isValid) {
      return res.status(400).json({ 
        error: 'Test sınıflandırma hatası',
        details: validation.errors,
        message: validation.message
      });
    }
    
    const test = await Test.findByIdAndUpdate(
      req.params.id,
      {
        testAdi,
        ad: testAdi, // AdminJS uyumluluğu
        aciklama,
        sinif,
        ders,
        konu,
        konuAdi,
        sorular,
        zorlukSeviyesi,
        sure,
        puan,
        aktif
      },
      { new: true }
    );
    
    if (!test) {
      return res.status(404).json({ error: 'Test bulunamadı' });
    }
    
    // Testi yeni havuza ekle (eğer sınıf/ders/konu değiştiyse)
    if (sinif && ders && konu) {
      await testiHavuzaEkle(test._id, sinif, ders, konu);
    }
    
    console.log(`[API] PUT /testler - Test güncellendi: ${test.testAdi}`);
    res.json({
      test: test,
      message: '✅ Test başarıyla güncellendi!'
    });
  } catch (error) {
    console.error('[API] PUT /testler - Hata:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test sil
router.delete('/:id', async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);
    if (!test) {
      return res.status(404).json({ error: 'Test bulunamadı' });
    }
    
    // TÜM HAVUZLARDAN çıkar (güvenlik için)
    await TestHavuzu.updateMany(
      { testler: test._id },
      { $pull: { testler: test._id } }
    );
    
    console.log(`[API] DELETE /testler - Test silindi: ${test.testAdi || test.aciklama}`);
    res.json({ 
      message: '✅ Test başarıyla silindi',
      deletedTest: {
        id: test._id,
        testAdi: test.testAdi,
        sinif: test.sinif,
        ders: test.ders,
        konu: test.konu
      }
    });
  } catch (error) {
    console.error('[API] DELETE /testler - Hata:', error);
    res.status(500).json({ error: error.message });
  }
});

// Filtre seçeneklerini getir
router.get('/filters', async (req, res) => {
  try {
    const siniflar = await Test.distinct('sinif');
    const dersler = await Test.distinct('ders');
    const konular = await Test.distinct('konu');
    
    res.json({
      siniflar: siniflar.sort(),
      dersler: dersler.sort(),
      konular: konular.sort()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Esnek başlık algılayan ve net hata mesajı dönen Excel yükleme
router.post('/excel-upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Dosya yüklenmedi!' });
    }

    // Arayüzden gelen parametreler
    let { sinifId, dersId, konuId } = req.body;
    if (!sinifId || !dersId || !konuId) {
      return res.status(400).json({ 
        error: 'Sınıf, ders ve konu seçimi zorunlu!',
        message: '📌 Testin doğru yerde görünmesi için sınıf, ders ve konu bilgilerini eksiksiz girmen gerekiyor!'
      });
    }

    // Sınıflandırma doğrulaması
    const validation = validateTestClassification(sinifId, dersId, konuId);
    if (!validation.isValid) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        error: 'Test sınıflandırma hatası',
        details: validation.errors,
        message: validation.message
      });
    }

    // Eğer sinifId 1,2,3,4 gibi gelirse, "1. Sınıf" formatına çevir
    if (['1','2','3','4'].includes(sinifId)) {
      sinifId = `${sinifId}. Sınıf`;
    }

    // Excel dosyasını oku
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });

    // Başlıkları esnek algıla
    const firstRow = rows[0] || {};
    const getKey = (...alternatives) => alternatives.find(k => Object.keys(firstRow).includes(k));
    const soruKey = getKey('Soru Metni', 'Soru', 'Test Adı');
    const aKey = getKey('A', 'A Şıkkı');
    const bKey = getKey('B', 'B Şıkkı');
    const cKey = getKey('C', 'C Şıkkı');
    const dKey = getKey('D', 'D Şıkkı');
    const dogruKey = getKey('Doğru Cevap', 'Cevap', 'Doğru');

    // Log: Bulunan başlıklar
    console.log('Excel başlıkları:', Object.keys(firstRow));
    console.log('Algılanan başlıklar:', { soruKey, aKey, bKey, cKey, dKey, dogruKey });

    // Eksik başlık kontrolü
    const eksik = [];
    if (!soruKey) eksik.push('Soru Metni');
    if (!aKey) eksik.push('A');
    if (!bKey) eksik.push('B');
    if (!cKey) eksik.push('C');
    if (!dKey) eksik.push('D');
    if (!dogruKey) eksik.push('Doğru Cevap');
    if (eksik.length > 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        error: `Excel başlıklarında eksik alan(lar): ${eksik.join(', ')}`,
        message: '📋 Excel dosyasında gerekli başlıklar eksik!'
      });
    }

    // Soruları topla
    const sorular = [];
    let atlananSatir = 0;
    rows.forEach((row, i) => {
      if (!row[soruKey] || !row[aKey] || !row[bKey] || !row[cKey] || !row[dKey] || !row[dogruKey]) {
        atlananSatir++;
        console.log(`Satır ${i + 2} atlandı: Eksik veri!`);
        return;
      }
      let dogruCevapIndex = 0;
      const dogruCevapStr = (row[dogruKey] || '').toString().trim().toUpperCase();
      if (dogruCevapStr === 'A') dogruCevapIndex = 0;
      else if (dogruCevapStr === 'B') dogruCevapIndex = 1;
      else if (dogruCevapStr === 'C') dogruCevapIndex = 2;
      else if (dogruCevapStr === 'D') dogruCevapIndex = 3;
      else if (!isNaN(Number(dogruCevapStr))) dogruCevapIndex = Number(dogruCevapStr);
      sorular.push({
        soru: row[soruKey],
        secenekler: [row[aKey], row[bKey], row[cKey], row[dKey]],
        dogruCevap: dogruCevapIndex,
        aciklama: row['Açıklama'] || ''
      });
    });

    if (sorular.length === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        error: 'Excel dosyasında uygun veri bulunamadı veya tüm satırlar eksik!',
        message: '📋 Excel dosyasında geçerli soru bulunamadı!'
      });
    }

    // Test oluştur - havuzId ile birlikte
    const yeniTest = new Test({
      testAdi: `Test - ${konuId}`, // Konu adından test adı oluştur
      ad: `Test - ${konuId}`, // AdminJS uyumluluğu
      aciklama: `${konuId} konusu için ${sorular.length} soruluk test`,
      sinif: sinifId,
      ders: dersId,
      konu: konuId,
      konuAdi: konuId, // Konu adını da ekle
      sorular: sorular,
      aktif: true
    });
    await yeniTest.save();

    // Testi otomatik olarak havuza ekle
    const havuz = await testiHavuzaEkle(yeniTest._id, sinifId, dersId, konuId);
    
    fs.unlinkSync(req.file.path);
    
    console.log(`[API] POST /excel-upload - Test oluşturuldu: ${yeniTest._id} -> Havuz: ${havuz._id}`);
    console.log(`[API] POST /excel-upload - Test detayları: ${sinifId} | ${dersId} | ${konuId}`);
    
    res.json({ 
      success: true, 
      count: 1, 
      test: yeniTest,
      havuz: havuz,
      message: `✅ Test başarıyla oluşturuldu!\n\n📊 Detaylar:\n• Sınıf: ${sinifId}\n• Ders: ${dersId}\n• Konu: ${konuId}\n• Soru Sayısı: ${sorular.length}\n• Atlanan Satır: ${atlananSatir}\n\n🎯 Test artık doğru havuzda: ${havuz.havuzAdi || `${sinifId} ${dersId} ${konuId}`}`
    });
  } catch (error) {
    console.error('[API] POST /excel-upload - Hata:', error);
    res.status(500).json({ 
      error: 'Yükleme sırasında hata: ' + error.message,
      message: '❌ Test yüklenirken bir hata oluştu!'
    });
  }
});

export default router; 