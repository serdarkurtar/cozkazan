import express from 'express';
import GelisimRaporuService from '../services/gelisimRaporuService.js';
import GelisimRaporu from '../models/GelisimRaporu.js';

const router = express.Router();

// Otomatik rapor oluştur
router.post('/otomatik-olustur', async (req, res) => {
  try {
    const { childId, parentId, raporTipi = 'weekly' } = req.body;

    if (!childId || !parentId) {
      return res.status(400).json({
        success: false,
        message: 'Çocuk ID ve veli ID gerekli'
      });
    }

    const rapor = await GelisimRaporuService.otomatikRaporOlustur(childId, parentId, raporTipi);

    res.json({
      success: true,
      data: rapor
    });
  } catch (error) {
    console.error('Otomatik rapor oluşturma API hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Rapor oluşturulamadı'
    });
  }
});

// Manuel rapor oluştur
router.post('/manuel-olustur', async (req, res) => {
  try {
    const { childId, parentId, raporTipi, baslangicTarihi, bitisTarihi } = req.body;

    if (!childId || !parentId || !raporTipi || !baslangicTarihi || !bitisTarihi) {
      return res.status(400).json({
        success: false,
        message: 'Tüm alanlar gerekli'
      });
    }

    // Mevcut rapor var mı kontrol et
    const mevcutRapor = await GelisimRaporu.findOne({
      childId,
      raporTipi,
      baslangicTarihi: new Date(baslangicTarihi),
      bitisTarihi: new Date(bitisTarihi)
    });

    if (mevcutRapor) {
      return res.status(400).json({
        success: false,
        message: 'Bu tarih aralığında zaten rapor mevcut'
      });
    }

    const rapor = new GelisimRaporu({
      childId,
      parentId,
      raporTipi,
      baslangicTarihi: new Date(baslangicTarihi),
      bitisTarihi: new Date(bitisTarihi)
    });

    await rapor.save();

    res.json({
      success: true,
      data: rapor
    });
  } catch (error) {
    console.error('Manuel rapor oluşturma API hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Rapor oluşturulamadı'
    });
  }
});

// Raporu veliye gönder
router.post('/gonder/:raporId', async (req, res) => {
  try {
    const { raporId } = req.params;
    
    const rapor = await GelisimRaporuService.raporuGonder(raporId);

    res.json({
      success: true,
      data: rapor,
      message: 'Rapor başarıyla gönderildi'
    });
  } catch (error) {
    console.error('Rapor gönderme API hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Rapor gönderilemedi'
    });
  }
});

// Raporu görüntüle (veli tarafından)
router.post('/goruntulendi/:raporId', async (req, res) => {
  try {
    const { raporId } = req.params;
    
    const rapor = await GelisimRaporuService.raporuGoruntulendi(raporId);

    res.json({
      success: true,
      data: rapor,
      message: 'Rapor görüntüleme kaydedildi'
    });
  } catch (error) {
    console.error('Rapor görüntüleme API hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Görüntüleme kaydedilemedi'
    });
  }
});

// Çocuğun raporlarını getir
router.get('/cocuk/:childId', async (req, res) => {
  try {
    const { childId } = req.params;
    const { raporTipi } = req.query;

    const raporlar = await GelisimRaporuService.cocukRaporlari(childId, raporTipi);

    res.json({
      success: true,
      data: raporlar
    });
  } catch (error) {
    console.error('Çocuk raporları API hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Raporlar getirilemedi'
    });
  }
});

// Veli raporlarını getir
router.get('/veli/:parentId', async (req, res) => {
  try {
    const { parentId } = req.params;
    const { gonderildi } = req.query;

    const raporlar = await GelisimRaporuService.veliRaporlari(parentId, gonderildi === 'true');

    res.json({
      success: true,
      data: raporlar
    });
  } catch (error) {
    console.error('Veli raporları API hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Raporlar getirilemedi'
    });
  }
});

// Rapor detayını getir
router.get('/:raporId', async (req, res) => {
  try {
    const { raporId } = req.params;
    
    const rapor = await GelisimRaporu.findById(raporId);
    
    if (!rapor) {
      return res.status(404).json({
        success: false,
        message: 'Rapor bulunamadı'
      });
    }

    res.json({
      success: true,
      data: rapor
    });
  } catch (error) {
    console.error('Rapor detay API hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Rapor getirilemedi'
    });
  }
});

// Raporu güncelle
router.put('/:raporId', async (req, res) => {
  try {
    const { raporId } = req.params;
    const guncelleme = req.body;

    const guncellenenRapor = await GelisimRaporu.findByIdAndUpdate(
      raporId, 
      guncelleme, 
      { new: true }
    );

    if (!guncellenenRapor) {
      return res.status(404).json({
        success: false,
        message: 'Rapor bulunamadı'
      });
    }

    res.json({
      success: true,
      data: guncellenenRapor
    });
  } catch (error) {
    console.error('Rapor güncelleme API hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Rapor güncellenemedi'
    });
  }
});

// Raporu sil
router.delete('/:raporId', async (req, res) => {
  try {
    const { raporId } = req.params;
    
    const silinenRapor = await GelisimRaporu.findByIdAndDelete(raporId);
    
    if (!silinenRapor) {
      return res.status(404).json({
        success: false,
        message: 'Rapor bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Rapor başarıyla silindi'
    });
  } catch (error) {
    console.error('Rapor silme API hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Rapor silinemedi'
    });
  }
});

// Tüm raporları getir (yönetim paneli için)
router.get('/tum-raporlar', async (req, res) => {
  try {
    const { sayfa = 1, limit = 50, raporTipi, gonderildi } = req.query;
    const skip = (parseInt(sayfa) - 1) * parseInt(limit);

    let filter = {};
    if (raporTipi) filter.raporTipi = raporTipi;
    if (gonderildi !== undefined) filter.gonderildi = gonderildi === 'true';

    const raporlar = await GelisimRaporu.find(filter)
      .sort({ olusturmaTarihi: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const toplam = await GelisimRaporu.countDocuments(filter);

    res.json({
      success: true,
      data: {
        raporlar,
        toplam,
        sayfa: parseInt(sayfa),
        limit: parseInt(limit),
        toplamSayfa: Math.ceil(toplam / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Tüm raporlar API hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Raporlar getirilemedi'
    });
  }
});

// İstatistikler
router.get('/istatistikler', async (req, res) => {
  try {
    const toplamRapor = await GelisimRaporu.countDocuments();
    const gonderilenRapor = await GelisimRaporu.countDocuments({ gonderildi: true });
    const goruntulenenRapor = await GelisimRaporu.countDocuments({ veliGoruntuledi: true });
    
    // Rapor tiplerine göre dağılım
    const gunlukRapor = await GelisimRaporu.countDocuments({ raporTipi: 'daily' });
    const haftalikRapor = await GelisimRaporu.countDocuments({ raporTipi: 'weekly' });
    const aylikRapor = await GelisimRaporu.countDocuments({ raporTipi: 'monthly' });

    // Son 30 günde oluşturulan raporlar
    const son30Gun = new Date();
    son30Gun.setDate(son30Gun.getDate() - 30);
    const son30GunRapor = await GelisimRaporu.countDocuments({
      olusturmaTarihi: { $gte: son30Gun }
    });

    const istatistikler = {
      toplamRapor,
      gonderilenRapor,
      goruntulenenRapor,
      gonderimOrani: toplamRapor > 0 ? (gonderilenRapor / toplamRapor * 100).toFixed(1) : 0,
      goruntulemeOrani: gonderilenRapor > 0 ? (goruntulenenRapor / gonderilenRapor * 100).toFixed(1) : 0,
      raporTipiDagilimi: {
        gunluk: gunlukRapor,
        haftalik: haftalikRapor,
        aylik: aylikRapor
      },
      son30GunRapor
    };

    res.json({
      success: true,
      data: istatistikler
    });
  } catch (error) {
    console.error('İstatistikler API hatası:', error);
    res.status(500).json({
      success: false,
      message: 'İstatistikler getirilemedi'
    });
  }
});

export default router; 