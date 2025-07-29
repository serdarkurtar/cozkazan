import express from 'express';
import Sinif from '../models/Sinif.js';
import Ders from '../models/Ders.js';
import Konu from '../models/Konu.js';
import Test from '../models/Test.js';
import Soru from '../models/Soru.js';
import TestHavuzu from '../models/TestHavuzu.js';

import Istatistik from '../models/Istatistik.js';
import { 
  getOrCreateVarsayilanHavuz, 
  testiHavuzaEkle, 
  yeniHavuzOlustur, 
  konuHavuzlariniGetir, 
  rastgeleTestlerGetir 
} from '../utils/havuzYoneticisi.js';

import VeliTestAyarlari from '../models/VeliTestAyarlari.js'; // Yeni eklenen import

const router = express.Router();

// Get all classes
router.get('/siniflar', async (req, res) => {
  try {
    const siniflar = await Sinif.find().sort('ad');
    console.log(`[API] GET /siniflar - Bulunan sınıf sayısı: ${siniflar.length}`);
    res.json(siniflar);
  } catch (err) {
    console.error(`[API] GET /siniflar - Hata: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// Get lessons for a specific class (admin panel compatibility)
router.get('/dersler', async (req, res) => {
  try {
    const { sinifId } = req.query;
    console.log(`[API] /dersler - Gelen sinifId: ${sinifId}`);
    
    if (!sinifId) {
      return res.status(400).json({ message: 'sinifId parametresi gerekli' });
    }
    
    // Sınıf ID'sine göre dersleri getir
    const dersler = await Ders.find({ sinif: sinifId }).sort('ad');
    console.log(`[API] /dersler - Bulunan ders sayısı: ${dersler.length}`);
    
    res.json(dersler);
  } catch (err) {
    console.error(`[API] /dersler - Hata: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// Get lessons for a specific class (Flutter compatibility)
router.get('/dersler/:sinif', async (req, res) => {
  try {
    const { sinif } = req.params;
    console.log(`[API] /dersler/:sinif - Gelen sınıf: ${sinif}`);
    
    // Sınıf adına göre dersleri getir
    const dersler = await Ders.find({ sinifAdi: sinif }).sort('ad');
    console.log(`[API] /dersler/:sinif - Bulunan ders sayısı: ${dersler.length}`);
    
    const dersAdlari = dersler.map(d => d.ad);
    res.json(dersAdlari);
  } catch (err) {
    console.error(`[API] /dersler/:sinif - Hata: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// Get topics for a specific lesson (admin panel compatibility)
router.get('/konular', async (req, res) => {
  try {
    const { dersId } = req.query;
    console.log(`[API] /konular - Gelen dersId: ${dersId}`);
    
    if (!dersId) {
      return res.status(400).json({ message: 'dersId parametresi gerekli' });
    }
    
    // Ders ID'sine göre konuları getir
    const konular = await Konu.find({ ders: dersId }).sort('sira ad');
    console.log(`[API] /konular - Bulunan konu sayısı: ${konular.length}`);
    
    res.json(konular);
  } catch (err) {
    console.error(`[API] /konular - Hata: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// Get topics for a specific lesson (Flutter compatibility)
router.get('/konular/:sinif/:ders', async (req, res) => {
  try {
    const { sinif, ders } = req.params;
    console.log(`[API] /konular/:sinif/:ders - Gelen sınıf: ${sinif}, ders: ${ders}`);
    
    // Sınıf ve ders adına göre konuları getir
    const konular = await Konu.find({ sinifAdi: sinif, dersAdi: ders }).sort('sira ad');
    console.log(`[API] /konular/:sinif/:ders - Bulunan konu sayısı: ${konular.length}`);
    
    const konuAdlari = konular.map(k => k.ad);
    res.json(konuAdlari);
  } catch (err) {
    console.error(`[API] /konular/:sinif/:ders - Hata: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// Get tests for a specific topic
router.get('/testler/:sinif/:ders/:konu', async (req, res) => {
  try {
    const { sinif, ders, konu } = req.params;
    console.log(`[API] /testler/:sinif/:ders/:konu - Gelen sınıf: ${sinif}, ders: ${ders}, konu: ${konu}`);
    
    // Hem eski hem yeni alan formatlarını dene
    const testler = await Test.find({
      $or: [
        // Yeni format (sinifAdi, dersAdi, konuAdi)
        { sinifAdi: sinif, dersAdi: ders, konuAdi: konu },
        // Eski format (sinif, ders, konu)
        { sinif: sinif, ders: ders, konu: konu }
      ]
    }).sort('testAdi');
    
    console.log(`[API] /testler/:sinif/:ders/:konu - Bulunan test sayısı: ${testler.length}`);
    
    // Testleri Flutter için uygun formata dönüştür
    const formattedTests = testler.map(test => ({
      _id: test._id,
      testAdi: test.testAdi || test.ad,
      sinif: test.sinifAdi || test.sinif,
      ders: test.dersAdi || test.ders,
      konu: test.konuAdi || test.konu,
      sinifAdi: test.sinifAdi || test.sinif,
      dersAdi: test.dersAdi || test.ders,
      konuAdi: test.konuAdi || test.konu,
      aciklama: test.aciklama,
      sorular: test.sorular || [],
      puan: test.puan || 10,
      aktif: test.aktif
    }));
    
    res.json(formattedTests);
  } catch (err) {
    console.error(`[API] /testler/:sinif/:ders/:konu - Hata: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// Get all tests (for admin panel)
router.get('/testler', async (req, res) => {
  try {
    const testler = await Test.find().populate('konu').populate('ders').populate('sinif');
    console.log(`[API] GET /testler - Bulunan test sayısı: ${testler.length}`);
    res.json(testler);
  } catch (err) {
    console.error(`[API] GET /testler - Hata: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// VELİ TEST AYARLARINI GETİR
router.get('/veli-test-ayarlari/:parentId', async (req, res) => {
  try {
    const { parentId } = req.params;
    console.log(`[API] GET /veli-test-ayarlari - ParentId: ${parentId}`);
    
    // Veli test ayarlarını veritabanından getir
    // Şimdilik basit bir yapı kullanıyoruz, daha sonra ayrı model oluşturabiliriz
    const veliAyarlari = await VeliTestAyarlari.findOne({ parentId });
    
    if (!veliAyarlari) {
      return res.json({ testler: [] });
    }
    
    res.json(veliAyarlari);
  } catch (err) {
    console.error(`[API] GET /veli-test-ayarlari - Hata: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// VELİ TEST AYARLARINI KAYDET
router.post('/veli-test-ayarlari', async (req, res) => {
  try {
    const { parentId, testler, guncellemeTarihi } = req.body;
    console.log(`[API] POST /veli-test-ayarlari - ParentId: ${parentId}, Test sayısı: ${testler?.length || 0}`);
    
    // Mevcut ayarları kontrol et
    let veliAyarlari = await VeliTestAyarlari.findOne({ parentId });
    
    if (veliAyarlari) {
      // Güncelle
      veliAyarlari.testler = testler;
      veliAyarlari.guncellemeTarihi = guncellemeTarihi;
    } else {
      // Yeni oluştur
      veliAyarlari = new VeliTestAyarlari({
        parentId,
        testler,
        guncellemeTarihi
      });
    }
    
    await veliAyarlari.save();
    res.json({ message: 'Test ayarları başarıyla kaydedildi', veliAyarlari });
  } catch (err) {
    console.error(`[API] POST /veli-test-ayarlari - Hata: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// ÇOCUK İÇİN VELİNİN SEÇTİĞİ TESTLERİ GETİR
router.get('/cocuk-testleri/:childId', async (req, res) => {
  try {
    const { childId } = req.params;
    console.log(`[API] GET /cocuk-testleri - ChildId: ${childId}`);
    
    // Çocuk ID'sini kullanarak veli ID'sini bul
    // Sabit mapping: child_1 -> parent_1
    const parentId = childId === 'child_1' ? 'parent_1' : `parent_${childId.split('_')[1]}`;
    console.log(`[API] GET /cocuk-testleri - ParentId: ${parentId}`);
    
    const veliAyarlari = await VeliTestAyarlari.findOne({ parentId });
    
    if (!veliAyarlari || !veliAyarlari.testler) {
      console.log(`[API] GET /cocuk-testleri - Veli ayarları bulunamadı: ${parentId}`);
      return res.json([]);
    }
    
    console.log(`[API] GET /cocuk-testleri - ${veliAyarlari.testler.length} test bulundu`);
    res.json(veliAyarlari.testler);
  } catch (err) {
    console.error(`[API] GET /cocuk-testleri - Hata: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// Test detay (test + sorular)
router.get('/test-detay/:id', async (req, res) => {
  try {
    const test = await Test.findById(req.params.id).populate('sinif ders konu');
    if (!test) return res.status(404).json({ message: 'Test bulunamadı.' });
    
    const sorular = await Soru.find({ test: test._id });
    // Eski kodda secenekler obje olarak bekleniyor, dönüştürelim
    const sorularObj = sorular.map(s => ({
      _id: s._id,
      soruMetni: s.soruMetni,
      secenekler: {
        A: s.secenekA,
        B: s.secenekB,
        C: s.secenekC,
        D: s.secenekD || ''
      },
      dogruCevap: s.dogruCevap
    }));
    
    res.json({
      _id: test._id,
      testAdi: test.testAdi,
      aciklama: test.aciklama,
      sinif: test.sinif,
      ders: test.ders,
      konu: test.konu,
      aktif: test.aktif,
      sorular: sorularObj
    });
  } catch (err) {
    console.error(`[API] /test-detay - Hata: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// Test oluştur ve otomatik havuza ekle
router.post('/testler', async (req, res) => {
  try {
    const { testAdi, aciklama, sinifId, dersId, konuId, konuAdi, sorular } = req.body;
    
    if (!testAdi || !sinifId || !dersId || !konuId) {
      return res.status(400).json({ 
        message: 'Test adı, sınıf, ders ve konu gereklidir.',
        error: 'Eksik bilgi',
        details: {
          testAdi: !testAdi ? 'Eksik' : 'Mevcut',
          sinifId: !sinifId ? 'Eksik' : 'Mevcut',
          dersId: !dersId ? 'Eksik' : 'Mevcut',
          konuId: !konuId ? 'Eksik' : 'Mevcut'
        }
      });
    }

    // Sınıflandırma doğrulaması
    const validation = validateTestClassification(sinifId, dersId, konuId);
    if (!validation.isValid) {
      return res.status(400).json({ 
        error: 'Test sınıflandırma hatası',
        details: validation.errors,
        message: validation.message
      });
    }

    // Test oluştur
    const test = new Test({
      testAdi,
      ad: testAdi, // AdminJS uyumluluğu
      aciklama,
      sinif: sinifId,
      ders: dersId,
      konu: konuId,
      konuAdi: konuAdi || konuId,
      aktif: true
    });

    await test.save();

    // Testi otomatik olarak havuza ekle
    const havuz = await testiHavuzaEkle(test._id, sinifId, dersId, konuId);

    // Soruları ekle
    if (sorular && Array.isArray(sorular)) {
      for (const soru of sorular) {
        const yeniSoru = new Soru({
          test: test._id,
          soruMetni: soru.soruMetni,
          secenekA: soru.secenekler.A,
          secenekB: soru.secenekler.B,
          secenekC: soru.secenekler.C,
          secenekD: soru.secenekler.D,
          dogruCevap: soru.dogruCevap
        });
        await yeniSoru.save();
      }
    }

    console.log(`[API] POST /testler - Test oluşturuldu ve havuza eklendi: ${test._id} -> ${havuz._id}`);
    
    res.status(201).json({
      message: '✅ Test başarıyla oluşturuldu ve havuza eklendi!',
      test: test,
      havuz: havuz,
      details: {
        sinif: sinifId,
        ders: dersId,
        konu: konuId,
        soruSayisi: sorular ? sorular.length : 0,
        havuzAdi: havuz.havuzAdi || `${sinifId} ${dersId} ${konuId}`
      }
    });
  } catch (err) {
    console.error(`[API] POST /testler - Hata: ${err.message}`);
    res.status(500).json({ 
      message: err.message,
      error: 'Test oluşturulurken bir hata oluştu!'
    });
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

// Delete a test
router.delete('/testler/:testId', async (req, res) => {
  try {
    const { testId } = req.params;
    console.log(`[API] DELETE /testler - Gelen testId: ${testId}`);
    
    const test = await Test.findByIdAndDelete(testId);
    if (!test) {
      return res.status(404).json({ message: 'Test bulunamadı.' });
    }
    
    console.log(`[API] DELETE /testler - Test silindi: ${test.testAdi}`);
    res.json({ message: 'Test başarıyla silindi.' });
  } catch (err) {
    console.error(`[API] DELETE /testler - Hata: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// Get test statistics
router.get('/test-istatistikler', async (req, res) => {
  try {
    const totalTests = await Test.countDocuments();
    const activeTests = await Test.countDocuments({ aktif: true });
    const totalQuestions = await Soru.countDocuments();
    
    // Ortalama başarı oranı (örnek değer)
    const avgSuccess = 85;
    
    res.json({
      totalTests,
      activeTests,
      totalQuestions,
      avgSuccess
    });
  } catch (err) {
    console.error(`[API] /test-istatistikler - Hata: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// Bulk operations
router.post('/testler/toplu-sil', async (req, res) => {
  try {
    const { testIds } = req.body;
    if (!testIds || !Array.isArray(testIds)) {
      return res.status(400).json({ message: 'Test ID listesi gereklidir.' });
    }
    
    const result = await Test.deleteMany({ _id: { $in: testIds } });
    console.log(`[API] /testler/toplu-sil - ${result.deletedCount} test silindi`);
    
    res.json({ 
      message: `${result.deletedCount} test başarıyla silindi.`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error(`[API] /testler/toplu-sil - Hata: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// Export test to Excel
router.get('/testler/:testId/export', async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId).populate('konu ders sinif');
    if (!test) {
      return res.status(404).json({ message: 'Test bulunamadı.' });
    }
    
    const sorular = await Soru.find({ test: test._id });
    
    res.json({
      test: {
        _id: test._id,
        testAdi: test.testAdi,
        aciklama: test.aciklama,
        sinif: test.sinif,
        ders: test.ders,
        konu: test.konu,
        aktif: test.aktif
      },
      sorular: sorular
    });
  } catch (err) {
    console.error(`[API] /testler/export - Hata: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// Test Havuzu API'ları
// Test havuzu oluştur veya güncelle
router.post('/test-havuzu', async (req, res) => {
  try {
    const { sinifId, dersId, konuId, testIds } = req.body;
    
    if (!sinifId || !dersId || !konuId) {
      return res.status(400).json({ message: 'Sınıf, ders ve konu ID\'leri gereklidir.' });
    }

    // Mevcut havuzu bul veya yeni oluştur
    let havuz = await TestHavuzu.findOne({ sinif: sinifId, ders: dersId, konu: konuId });
    
    if (havuz) {
      // Mevcut havuzu güncelle
      havuz.testler = testIds || [];
      await havuz.save();
      console.log(`[API] /test-havuzu - Havuz güncellendi: ${havuz._id}`);
    } else {
      // Yeni havuz oluştur
      havuz = new TestHavuzu({
        sinif: sinifId,
        ders: dersId,
        konu: konuId,
        testler: testIds || []
      });
      await havuz.save();
      console.log(`[API] /test-havuzu - Yeni havuz oluşturuldu: ${havuz._id}`);
    }

    res.json({
      message: 'Test havuzu başarıyla oluşturuldu/güncellendi.',
      havuz: havuz
    });
  } catch (err) {
    console.error(`[API] /test-havuzu - Hata: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// Test havuzunu getir (istatistiklerle birlikte)
router.get('/test-havuzu/:sinifId/:dersId/:konuId', async (req, res) => {
  try {
    const { sinifId, dersId, konuId } = req.params;
    
    const havuz = await TestHavuzu.findOne({ 
      sinif: sinifId, 
      ders: dersId, 
      konu: konuId 
    }).populate('sinif ders konu testler');
    
    if (!havuz) {
      return res.status(404).json({ message: 'Test havuzu bulunamadı.' });
    }

    // İstatistikleri hesapla
    const testler = await Test.find({ _id: { $in: havuz.testler } });
    const sorular = await Soru.find({ test: { $in: havuz.testler } });

    // Havuz istatistiklerini güncelle
    havuz.toplamSoru = sorular.length;
    havuz.aktifTest = testler.filter(t => t.aktif).length;
    havuz.cozulmeSayisi = 0;
    havuz.basariOrani = 0;
    havuz.ortalamaZorluk = 50;

    await havuz.save();
    
    console.log(`[API] /test-havuzu - Havuz bulundu: ${havuz.testSayisi} test, ${havuz.toplamSoru} soru`);
    res.json(havuz);
  } catch (err) {
    console.error(`[API] /test-havuzu - Hata: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// Test havuzundan rastgele testler getir (uygulama için) - TÜM HAVUZLARI BİRLEŞTİRİR
router.get('/test-havuzu/:sinifId/:dersId/:konuId/rastgele', async (req, res) => {
  try {
    const { sinifId, dersId, konuId } = req.params;
    const { limit = 10 } = req.query; // Varsayılan 10 test
    
    const result = await rastgeleTestlerGetir(sinifId, dersId, konuId, limit);
    
    if (result.havuzBos) {
      return res.status(404).json(result);
    }
    
    console.log(`[API] /test-havuzu/rastgele - ${result.testler.length} test gönderildi`);
    res.json(result);
  } catch (err) {
    console.error(`[API] /test-havuzu/rastgele - Hata: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// Tüm test havuzlarını listele
router.get('/test-havuzlari', async (req, res) => {
  try {
    const havuzlar = await TestHavuzu.find()
      .populate('sinif ders konu')
      .sort('sinif.ad ders.ad konu.ad');
    
    console.log(`[API] /test-havuzlari - ${havuzlar.length} havuz bulundu`);
    res.json(havuzlar);
  } catch (err) {
    console.error(`[API] /test-havuzlari - Hata: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// Toplam soru sayısını getir
router.get('/toplam-soru', async (req, res) => {
  try {
    const testler = await Test.find({ aktif: true });
    const testIds = testler.map(test => test._id);
    
    // Her test için soru sayısını hesapla
    let toplamSoru = 0;
    for (const testId of testIds) {
      const soruSayisi = await Soru.countDocuments({ test: testId });
      toplamSoru += soruSayisi;
    }
    
    console.log(`[API] /toplam-soru - ${toplamSoru} soru bulundu`);
    res.json({ toplamSoru });
  } catch (err) {
    console.error(`[API] /toplam-soru - Hata: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// Toplam test sayısını getir
router.get('/toplam-test', async (req, res) => {
  try {
    const toplamTest = await Test.countDocuments({ aktif: true });
    console.log(`[API] /toplam-test - ${toplamTest} test bulundu`);
    res.json({ toplamTest });
  } catch (err) {
    console.error(`[API] /toplam-test - Hata: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// Test havuzunu sil
router.delete('/test-havuzu/:sinifId/:dersId/:konuId', async (req, res) => {
  try {
    const { sinifId, dersId, konuId } = req.params;
    
    const havuz = await TestHavuzu.findOneAndDelete({ 
      sinif: sinifId, 
      ders: dersId, 
      konu: konuId 
    });
    
    if (!havuz) {
      return res.status(404).json({ message: 'Test havuzu bulunamadı.' });
    }
    
    console.log(`[API] /test-havuzu - Havuz silindi: ${havuz._id}`);
    res.json({ message: 'Test havuzu başarıyla silindi.' });
  } catch (err) {
    console.error(`[API] /test-havuzu - Hata: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// Yeni havuz oluştur (test yetersiz kaldığında)
router.post('/test-havuzu/yeni', async (req, res) => {
  try {
    const { sinifId, dersId, konuId, havuzAdi } = req.body;
    
    if (!sinifId || !dersId || !konuId) {
      return res.status(400).json({ message: 'Sınıf, ders ve konu ID\'leri gereklidir.' });
    }

    const yeniHavuz = await yeniHavuzOlustur(sinifId, dersId, konuId, havuzAdi);
    
    console.log(`[API] /test-havuzu/yeni - Yeni havuz oluşturuldu: ${yeniHavuz._id}`);
    
    res.json({
      message: 'Yeni havuz başarıyla oluşturuldu.',
      havuz: yeniHavuz
    });
  } catch (err) {
    console.error(`[API] /test-havuzu/yeni - Hata: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// Konunun tüm havuzlarını getir
router.get('/test-havuzu/:sinifId/:dersId/:konuId/havuzlar', async (req, res) => {
  try {
    const { sinifId, dersId, konuId } = req.params;
    
    const havuzlar = await konuHavuzlariniGetir(sinifId, dersId, konuId);
    
    console.log(`[API] /test-havuzu/havuzlar - ${havuzlar.length} havuz bulundu`);
    res.json(havuzlar);
  } catch (err) {
    console.error(`[API] /test-havuzu/havuzlar - Hata: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// === İSTATİSTİK API'LARI ===

// Sınıf bazlı istatistikleri getir
router.get('/istatistikler/:sinifId', async (req, res) => {
  try {
    const { sinifId } = req.params;
    const { periyot = 'gunluk', baslangic, bitis } = req.query;
    
    let tarihFiltresi = {};
    if (baslangic && bitis) {
      tarihFiltresi = {
        tarih: {
          $gte: new Date(baslangic),
          $lte: new Date(bitis)
        }
      };
    }
    
    const istatistikler = await Istatistik.find({
      sinifId,
      periyot,
      ...tarihFiltresi
    }).sort('tarih');
    
    console.log(`[API] /istatistikler - ${istatistikler.length} istatistik bulundu`);
    res.json(istatistikler);
  } catch (err) {
    console.error(`[API] /istatistikler - Hata: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// Ders bazlı istatistikleri getir
router.get('/istatistikler/:sinifId/:dersId', async (req, res) => {
  try {
    const { sinifId, dersId } = req.params;
    const { periyot = 'gunluk', baslangic, bitis } = req.query;
    
    let tarihFiltresi = {};
    if (baslangic && bitis) {
      tarihFiltresi = {
        tarih: {
          $gte: new Date(baslangic),
          $lte: new Date(bitis)
        }
      };
    }
    
    const istatistikler = await Istatistik.find({
      sinifId,
      dersId,
      periyot,
      ...tarihFiltresi
    }).sort('tarih');
    
    console.log(`[API] /istatistikler/ders - ${istatistikler.length} istatistik bulundu`);
    res.json(istatistikler);
  } catch (err) {
    console.error(`[API] /istatistikler/ders - Hata: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// Konu bazlı istatistikleri getir
router.get('/istatistikler/:sinifId/:dersId/:konuId', async (req, res) => {
  try {
    const { sinifId, dersId, konuId } = req.params;
    const { periyot = 'gunluk', baslangic, bitis } = req.query;
    
    let tarihFiltresi = {};
    if (baslangic && bitis) {
      tarihFiltresi = {
        tarih: {
          $gte: new Date(baslangic),
          $lte: new Date(bitis)
        }
      };
    }
    
    const istatistikler = await Istatistik.find({
      sinifId,
      dersId,
      konuId,
      periyot,
      ...tarihFiltresi
    }).sort('tarih');
    
    console.log(`[API] /istatistikler/konu - ${istatistikler.length} istatistik bulundu`);
    res.json(istatistikler);
  } catch (err) {
    console.error(`[API] /istatistikler/konu - Hata: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// Test çözme sonucunu kaydet
router.post('/test-sonucu', async (req, res) => {
  try {
    const {
      sinifId,
      dersId,
      konuId,
      testId,
      basarili,
      sure,
      dogruCevapSayisi,
      toplamSoruSayisi,
      kazanilanXP
    } = req.body;
    
    // Bugünün tarihini al
    const bugun = new Date();
    bugun.setHours(0, 0, 0, 0);
    
    // Mevcut istatistiği bul veya oluştur
    let istatistik = await Istatistik.findOne({
      sinifId,
      dersId,
      konuId,
      tarih: bugun,
      periyot: 'gunluk'
    });
    
    if (!istatistik) {
      istatistik = new Istatistik({
        sinifId,
        dersId,
        konuId,
        tarih: bugun,
        periyot: 'gunluk'
      });
    }
    
    // İstatistikleri güncelle
    istatistik.cozulenTestSayisi += 1;
    if (basarili) {
      istatistik.basariliTestSayisi += 1;
    } else {
      istatistik.basarisizTestSayisi += 1;
    }
    
    istatistik.cozulenSoruSayisi += toplamSoruSayisi;
    istatistik.dogruCevapSayisi += dogruCevapSayisi;
    istatistik.yanlisCevapSayisi += (toplamSoruSayisi - dogruCevapSayisi);
    istatistik.toplamSure += sure;
    istatistik.kazanilanXP += kazanilanXP;
    
    // Ortalama hesapla
    istatistik.ortalamaSure = istatistik.toplamSure / istatistik.cozulenTestSayisi;
    istatistik.testBasariOrani = (istatistik.basariliTestSayisi / istatistik.cozulenTestSayisi) * 100;
    istatistik.soruBasariOrani = (istatistik.dogruCevapSayisi / istatistik.cozulenSoruSayisi) * 100;
    
    // Test detayını ekle
    istatistik.testDetaylari.push({
      testId,
      basarili,
      sure,
      dogruCevapSayisi,
      toplamSoruSayisi,
      kazanilanXP,
      cozulmeTarihi: new Date()
    });
    
    await istatistik.save();
    
    console.log(`[API] /test-sonucu - Test sonucu kaydedildi: ${testId}`);
    res.json({ message: 'Test sonucu başarıyla kaydedildi.' });
  } catch (err) {
    console.error(`[API] /test-sonucu - Hata: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// === YENİ ADMIN PANEL ENDPOINTLERİ ===

// Geçici veri depoları (örnek)
let testHedefleri = [{ id: 1, kullanici: 'veli1', hedef: 10 }];
let ekranSureleri = [{ id: 1, kullanici: 'veli1', sure: 60 }];
let serbestGunler = [{ id: 1, kullanici: 'veli1', gun: 'Pazar' }];
let notlar = [{ id: 1, kullanici: 'veli1', not: 'Bugün çok çalıştı!' }];
let aileNotlari = [{ id: 1, kullanici: 'veli1', not: 'Anne: Harika gidiyorsun!' }];
let aiSohbetler = [{ id: 1, kullanici: 'veli1', mesaj: 'AI: Merhaba, bugün nasılsın?' }];
let gelisimGunlukleri = [{ id: 1, kullanici: 'veli1', xp: 120, test: 5, kitap: 30 }];

// Test Hedefi CRUD
router.get('/test-hedefleri', (req, res) => res.json(testHedefleri));
router.post('/test-hedefleri', (req, res) => { const yeni = { id: Date.now(), ...req.body }; testHedefleri.push(yeni); res.json(yeni); });
router.put('/test-hedefleri/:id', (req, res) => { const i = testHedefleri.findIndex(x => x.id == req.params.id); if (i>-1) testHedefleri[i] = { ...testHedefleri[i], ...req.body }; res.json(testHedefleri[i]); });
router.delete('/test-hedefleri/:id', (req, res) => { testHedefleri = testHedefleri.filter(x => x.id != req.params.id); res.json({ ok: true }); });

// Ekran Süresi CRUD
router.get('/ekran-sureleri', (req, res) => res.json(ekranSureleri));
router.post('/ekran-sureleri', (req, res) => { const yeni = { id: Date.now(), ...req.body }; ekranSureleri.push(yeni); res.json(yeni); });
router.put('/ekran-sureleri/:id', (req, res) => { const i = ekranSureleri.findIndex(x => x.id == req.params.id); if (i>-1) ekranSureleri[i] = { ...ekranSureleri[i], ...req.body }; res.json(ekranSureleri[i]); });
router.delete('/ekran-sureleri/:id', (req, res) => { ekranSureleri = ekranSureleri.filter(x => x.id != req.params.id); res.json({ ok: true }); });

// Serbest Günler CRUD
router.get('/serbest-gunler', (req, res) => res.json(serbestGunler));
router.post('/serbest-gunler', (req, res) => { const yeni = { id: Date.now(), ...req.body }; serbestGunler.push(yeni); res.json(yeni); });
router.put('/serbest-gunler/:id', (req, res) => { const i = serbestGunler.findIndex(x => x.id == req.params.id); if (i>-1) serbestGunler[i] = { ...serbestGunler[i], ...req.body }; res.json(serbestGunler[i]); });
router.delete('/serbest-gunler/:id', (req, res) => { serbestGunler = serbestGunler.filter(x => x.id != req.params.id); res.json({ ok: true }); });

// Notlar CRUD
router.get('/notlar', (req, res) => res.json(notlar));
router.post('/notlar', (req, res) => { const yeni = { id: Date.now(), ...req.body }; notlar.push(yeni); res.json(yeni); });
router.put('/notlar/:id', (req, res) => { const i = notlar.findIndex(x => x.id == req.params.id); if (i>-1) notlar[i] = { ...notlar[i], ...req.body }; res.json(notlar[i]); });
router.delete('/notlar/:id', (req, res) => { notlar = notlar.filter(x => x.id != req.params.id); res.json({ ok: true }); });

// Aile Notları CRUD
router.get('/aile-notlari', (req, res) => res.json(aileNotlari));
router.post('/aile-notlari', (req, res) => { const yeni = { id: Date.now(), ...req.body }; aileNotlari.push(yeni); res.json(yeni); });
router.put('/aile-notlari/:id', (req, res) => { const i = aileNotlari.findIndex(x => x.id == req.params.id); if (i>-1) aileNotlari[i] = { ...aileNotlari[i], ...req.body }; res.json(aileNotlari[i]); });
router.delete('/aile-notlari/:id', (req, res) => { aileNotlari = aileNotlari.filter(x => x.id != req.params.id); res.json({ ok: true }); });

// AI Sohbet CRUD
router.get('/ai-sohbetler', (req, res) => res.json(aiSohbetler));
router.post('/ai-sohbetler', (req, res) => { const yeni = { id: Date.now(), ...req.body }; aiSohbetler.push(yeni); res.json(yeni); });
router.put('/ai-sohbetler/:id', (req, res) => { const i = aiSohbetler.findIndex(x => x.id == req.params.id); if (i>-1) aiSohbetler[i] = { ...aiSohbetler[i], ...req.body }; res.json(aiSohbetler[i]); });
router.delete('/ai-sohbetler/:id', (req, res) => { aiSohbetler = aiSohbetler.filter(x => x.id != req.params.id); res.json({ ok: true }); });

// Gelişim Günlüğü CRUD
router.get('/gelisim-gunlukleri', (req, res) => res.json(gelisimGunlukleri));
router.post('/gelisim-gunlukleri', (req, res) => { const yeni = { id: Date.now(), ...req.body }; gelisimGunlukleri.push(yeni); res.json(yeni); });
router.put('/gelisim-gunlukleri/:id', (req, res) => { const i = gelisimGunlukleri.findIndex(x => x.id == req.params.id); if (i>-1) gelisimGunlukleri[i] = { ...gelisimGunlukleri[i], ...req.body }; res.json(gelisimGunlukleri[i]); });
router.delete('/gelisim-gunlukleri/:id', (req, res) => { gelisimGunlukleri = gelisimGunlukleri.filter(x => x.id != req.params.id); res.json({ ok: true }); });

// XP Hedefleri endpointi (Flutter ile tam uyumlu veri)
router.get('/xp-hedefleri', (req, res) => {
  const { parentId, childId } = req.query;
  let hedefler = [
    {
      _id: '1',
      childId: 'cocuk1',
      hedefXp: 100,
      odulAd: 'Yıldız Rozeti',
      aciklama: 'Haftalık hedef',
      tamamlandi: false,
      tamamlanmaTarihi: null,
      olusturmaTarihi: new Date().toISOString()
    },
    {
      _id: '2',
      childId: 'cocuk2',
      hedefXp: 150,
      odulAd: 'Süper Rozet',
      aciklama: 'Aylık hedef',
      tamamlandi: true,
      tamamlanmaTarihi: new Date().toISOString(),
      olusturmaTarihi: new Date().toISOString()
    },
    {
      _id: '3',
      childId: 'cocuk3',
      hedefXp: 200,
      odulAd: 'Mega Rozet',
      aciklama: 'Yıllık hedef',
      tamamlandi: false,
      tamamlanmaTarihi: null,
      olusturmaTarihi: new Date().toISOString()
    }
  ];
  if (parentId) {
    const childIds = cocuklar.filter(c => c.parentId === parentId).map(c => c.id);
    hedefler = hedefler.filter(h => childIds.includes(h.childId));
  }
  if (childId) {
    hedefler = hedefler.filter(h => h.childId === childId);
  }
  res.json(hedefler);
});

// Şehir Bazlı Kullanıcılar endpointi (Flutter ile tam uyumlu veri)
router.get('/sehir-bazli-kullanicilar', (req, res) => {
  const { parentId } = req.query;
  let sehirler = [
    { sehir: 'İstanbul', veliSayisi: 1, cocukSayisi: 1 },
    { sehir: 'Ankara', veliSayisi: 1, cocukSayisi: 1 },
    { sehir: 'İzmir', veliSayisi: 1, cocukSayisi: 1 }
  ];
  if (parentId) {
    // Sadece ilgili veli ve çocukları için şehir verisi
    const cocuklarim = cocuklar.filter(c => c.parentId === parentId);
    sehirler = cocuklarim.map(c => ({
      sehir: c.sehir,
      veliSayisi: 1,
      cocukSayisi: 1
    }));
  }
  res.json({ sehirler });
});

// Veli İstatistikler endpointi (Flutter ile tam uyumlu veri)
router.get('/veli-istatistikler', (req, res) => {
  const { parentId } = req.query;
  if (parentId) {
    // Sadece ilgili veli ve çocukları için istatistik
    const cocuklarim = cocuklar.filter(c => c.parentId === parentId);
    res.json({
      toplamVeli: 1,
      aktifVeli: 1,
      toplamCocuk: cocuklarim.length,
      aktifKullanicilar: 1,
      buAyKayitlar: 0,
      ortalamaTest: 5,
      ortalamaXp: 120,
      enBasariliCocuk: cocuklarim[0] || {},
      enAktifVeli: { ad: 'Veli Bir', mesaj: 'Her gün takipte!' }
    });
  } else {
    // Admin için tüm veriler
    res.json({
      toplamVeli: 2,
      aktifVeli: 2,
      toplamCocuk: cocuklar.length,
      aktifKullanicilar: 2,
      buAyKayitlar: 1,
      ortalamaTest: 7,
      ortalamaXp: 150,
      enBasariliCocuk: { ad: 'Ali', xp: 320, test: 15 },
      enAktifVeli: { ad: 'Veli Bir', mesaj: 'Her gün takipte!' }
    });
  }
});

export default router; 