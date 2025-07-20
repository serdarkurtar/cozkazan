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

const router = express.Router();

// Get all classes
router.get('/siniflar', async (req, res) => {
  try {
    const siniflar = await Sinif.find().sort('ad');
    res.json(siniflar.map(s => ({ id: s._id, ad: s.ad })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get lessons for a specific class
router.get('/dersler', async (req, res) => {
  try {
    const { sinifId } = req.query;
    console.log(`[API] /dersler - Gelen sinifId: ${sinifId}`);
    if (!sinifId) {
      return res.status(400).json({ message: 'sinifId gereklidir.' });
    }
    const dersler = await Ders.find({ sinif: sinifId }).sort('ad');
    console.log(`[API] /dersler - Bulunan ders sayısı: ${dersler.length}`);
    res.json(dersler.map(d => ({ id: d._id, ad: d.ad })));
  } catch (err) {
    console.error(`[API] /dersler - Hata: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// Get topics for a specific lesson
router.get('/konular', async (req, res) => {
  try {
    const { dersId } = req.query;
    console.log(`[API] /konular - Gelen dersId: ${dersId}`);
    if (!dersId) {
      return res.status(400).json({ message: 'dersId gereklidir.' });
    }
    const konular = await Konu.find({ ders: dersId }).sort('sira ad');
    console.log(`[API] /konular - Bulunan konu sayısı: ${konular.length}`);
    res.json(konular.map(k => ({ id: k._id, ad: k.ad })));
  } catch (err) {
    console.error(`[API] /konular - Hata: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// Get tests for a specific topic
router.get('/testler/:konuId', async (req, res) => {
  try {
    const { konuId } = req.params;
    console.log(`[API] /testler - Gelen konuId: ${konuId}`);
    if (!konuId) {
      return res.status(400).json({ message: 'konuId gereklidir.' });
    }
    const testler = await Test.find({ konu: konuId }).sort('testAdi');
    console.log(`[API] /testler - Bulunan test sayısı: ${testler.length}`);
    res.json(testler.map(t => ({ id: t._id, ad: t.testAdi, konu: t.konu })));
  } catch (err) {
    console.error(`[API] /testler - Hata: ${err.message}`);
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
    const { testAdi, aciklama, sinifId, dersId, konuId, sorular } = req.body;
    
    if (!testAdi || !sinifId || !dersId || !konuId) {
      return res.status(400).json({ message: 'Test adı, sınıf, ders ve konu gereklidir.' });
    }

    // Test oluştur
    const test = new Test({
      testAdi,
      aciklama,
      sinif: sinifId,
      ders: dersId,
      konu: konuId,
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
      message: 'Test başarıyla oluşturuldu ve havuza eklendi.',
      test: test,
      havuz: havuz
    });
  } catch (err) {
    console.error(`[API] POST /testler - Hata: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

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

export default router; 