const express = require('express');
const multer = require('multer');
const Test = require('../models/Test.js');
const xlsx = require('xlsx');
const fs = require('fs');

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

// Tüm testleri getir
router.get('/', async (req, res) => {
  try {
    const { sinif, ders, konu, aktif, search } = req.query;
    
    let filter = {};
    
    // Arama filtresi
    if (search) {
      filter.aciklama = { $regex: search, $options: 'i' };
    }
    
    // Sınıf filtresi
    if (sinif) {
      filter.sinif = sinif;
    }
    
    // Ders filtresi
    if (ders) {
      filter.ders = ders;
    }
    
    // Konu filtresi
    if (konu) {
      filter.konu = konu;
    }
    
    // Aktif filtresi
    if (aktif !== undefined) {
      filter.aktif = aktif === 'true';
    }
    
    const tests = await Test.find(filter).sort({ createdAt: -1 });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tek test getir (düzenleme için)
router.get('/:id', async (req, res) => {
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

// Test güncelle
router.put('/:id', async (req, res) => {
  try {
    const { testAdi, aciklama, sinif, ders, konu, sorular, zorlukSeviyesi, sure, puan, aktif } = req.body;
    
    const test = await Test.findByIdAndUpdate(
      req.params.id,
      {
        testAdi,
        aciklama,
        sinif,
        ders,
        konu,
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
    
    res.json(test);
  } catch (error) {
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
    
    console.log(`[API] DELETE /testler - Test silindi: ${test.testAdi || test.aciklama}`);
    res.json({ message: 'Test başarıyla silindi' });
  } catch (error) {
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

// Excel yükleme
router.post('/excel-upload', upload.single('excel'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Dosya yüklenmedi!' });
    }

    // Excel dosyasını oku
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet);

    // Her satırı Test olarak kaydet
    const testler = [];
    for (const row of rows) {
      if (!row['Açıklama'] || !row['Sınıf'] || !row['Ders'] || !row['Konu']) continue;
      testler.push({
        aciklama: row['Açıklama'],
        sinif: row['Sınıf'],
        ders: row['Ders'],
        konu: row['Konu'],
        aktif: row['Aktif'] === true || row['Aktif'] === 'true' || row['Aktif'] === 1
      });
    }
    if (testler.length === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Excel dosyasında uygun veri bulunamadı!' });
    }
    await Test.insertMany(testler);
    fs.unlinkSync(req.file.path);
    res.json({ success: true, count: testler.length, message: `${testler.length} test başarıyla yüklendi!` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 