import express from 'express';
import DuyguAnaliziService from '../services/duyguAnaliziService.js';
import DuyguAnalizi from '../models/DuyguAnalizi.js';

const router = express.Router();

// Mesajın duygusal tonunu analiz et
router.post('/analiz', async (req, res) => {
  try {
    const { mesaj, kullaniciId, kullaniciTipi, dil = 'tr' } = req.body;

    if (!mesaj || !kullaniciId || !kullaniciTipi) {
      return res.status(400).json({
        success: false,
        message: 'Mesaj, kullanıcı ID ve kullanıcı tipi gerekli'
      });
    }

    const duyguAnalizi = await DuyguAnaliziService.analizEt(
      mesaj, 
      kullaniciId, 
      kullaniciTipi, 
      dil
    );

    res.json({
      success: true,
      data: duyguAnalizi
    });
  } catch (error) {
    console.error('Duygu analizi API hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Duygu analizi yapılamadı'
    });
  }
});

// Yanıtı duygu analizine göre ayarla
router.post('/yanit-ayarla', async (req, res) => {
  try {
    const { yanit, duyguAnaliziId } = req.body;

    if (!yanit || !duyguAnaliziId) {
      return res.status(400).json({
        success: false,
        message: 'Yanıt ve duygu analizi ID gerekli'
      });
    }

    const duyguAnalizi = await DuyguAnalizi.findById(duyguAnaliziId);
    if (!duyguAnalizi) {
      return res.status(404).json({
        success: false,
        message: 'Duygu analizi bulunamadı'
      });
    }

    const ayarlanmisYanit = await DuyguAnaliziService.yanitiAyarla(yanit, duyguAnalizi);

    res.json({
      success: true,
      data: {
        orijinalYanit: yanit,
        ayarlanmisYanit,
        duyguAnalizi
      }
    });
  } catch (error) {
    console.error('Yanıt ayarlama API hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Yanıt ayarlanamadı'
    });
  }
});

// Kullanıcının duygu geçmişini getir
router.get('/gecmis/:kullaniciId', async (req, res) => {
  try {
    const { kullaniciId } = req.params;
    const { kullaniciTipi, gunSayisi = 7 } = req.query;

    if (!kullaniciTipi) {
      return res.status(400).json({
        success: false,
        message: 'Kullanıcı tipi gerekli'
      });
    }

    const gecmis = await DuyguAnaliziService.kullaniciDuyguGecmisi(
      kullaniciId, 
      kullaniciTipi, 
      parseInt(gunSayisi)
    );

    res.json({
      success: true,
      data: gecmis
    });
  } catch (error) {
    console.error('Duygu geçmişi API hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Duygu geçmişi getirilemedi'
    });
  }
});

// Duygu istatistiklerini getir
router.get('/istatistikler/:kullaniciId', async (req, res) => {
  try {
    const { kullaniciId } = req.params;
    const { kullaniciTipi, gunSayisi = 30 } = req.query;

    if (!kullaniciTipi) {
      return res.status(400).json({
        success: false,
        message: 'Kullanıcı tipi gerekli'
      });
    }

    const istatistikler = await DuyguAnaliziService.duyguIstatistikleri(
      kullaniciId, 
      kullaniciTipi, 
      parseInt(gunSayisi)
    );

    if (!istatistikler) {
      return res.status(404).json({
        success: false,
        message: 'İstatistik bulunamadı'
      });
    }

    res.json({
      success: true,
      data: istatistikler
    });
  } catch (error) {
    console.error('Duygu istatistikleri API hatası:', error);
    res.status(500).json({
      success: false,
      message: 'İstatistikler getirilemedi'
    });
  }
});

// Tüm duygu analizlerini getir (yönetim paneli için)
router.get('/tum-analizler', async (req, res) => {
  try {
    const { sayfa = 1, limit = 50, kullaniciTipi, duyguKategori } = req.query;
    const skip = (parseInt(sayfa) - 1) * parseInt(limit);

    let filter = {};
    if (kullaniciTipi) filter.kullaniciTipi = kullaniciTipi;
    if (duyguKategori) filter.duyguKategori = duyguKategori;

    const analizler = await DuyguAnalizi.find(filter)
      .sort({ tarih: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const toplam = await DuyguAnalizi.countDocuments(filter);

    res.json({
      success: true,
      data: {
        analizler,
        toplam,
        sayfa: parseInt(sayfa),
        limit: parseInt(limit),
        toplamSayfa: Math.ceil(toplam / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Tüm analizler API hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Analizler getirilemedi'
    });
  }
});

// Duygu analizi sil
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const silinenAnaliz = await DuyguAnalizi.findByIdAndDelete(id);
    
    if (!silinenAnaliz) {
      return res.status(404).json({
        success: false,
        message: 'Duygu analizi bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Duygu analizi başarıyla silindi'
    });
  } catch (error) {
    console.error('Duygu analizi silme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Duygu analizi silinemedi'
    });
  }
});

// Duygu analizi güncelle
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const guncelleme = req.body;

    const guncellenenAnaliz = await DuyguAnalizi.findByIdAndUpdate(
      id, 
      guncelleme, 
      { new: true }
    );

    if (!guncellenenAnaliz) {
      return res.status(404).json({
        success: false,
        message: 'Duygu analizi bulunamadı'
      });
    }

    res.json({
      success: true,
      data: guncellenenAnaliz
    });
  } catch (error) {
    console.error('Duygu analizi güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Duygu analizi güncellenemedi'
    });
  }
});

// Duygu analizi detayını getir
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const analiz = await DuyguAnalizi.findById(id);
    
    if (!analiz) {
      return res.status(404).json({
        success: false,
        message: 'Duygu analizi bulunamadı'
      });
    }

    res.json({
      success: true,
      data: analiz
    });
  } catch (error) {
    console.error('Duygu analizi detay hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Duygu analizi getirilemedi'
    });
  }
});

export default router; 