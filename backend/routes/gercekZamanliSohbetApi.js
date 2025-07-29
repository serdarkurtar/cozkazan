import express from 'express';
import GercekZamanliSohbetService from '../services/gercekZamanliSohbetService.js';
import GercekZamanliSohbet from '../models/GercekZamanliSohbet.js';

const router = express.Router();

// Yeni sohbet oturumu başlat
router.post('/oturum-baslat', async (req, res) => {
  try {
    const { kullaniciId, kullaniciTipi } = req.body;

    if (!kullaniciId || !kullaniciTipi) {
      return res.status(400).json({
        success: false,
        message: 'Kullanıcı ID ve kullanıcı tipi gerekli'
      });
    }

    if (!['child', 'parent'].includes(kullaniciTipi)) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz kullanıcı tipi. Kullanılabilir: child, parent'
      });
    }

    const oturum = await GercekZamanliSohbetService.sohbetOturumuBaslat(kullaniciId, kullaniciTipi);

    res.json({
      success: true,
      data: oturum
    });
  } catch (error) {
    console.error('Oturum başlatma API hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Oturum başlatılamadı'
    });
  }
});

// Mesaj gönder
router.post('/mesaj-gonder', async (req, res) => {
  try {
    const { sohbetOturumu, mesaj } = req.body;

    if (!sohbetOturumu || !mesaj) {
      return res.status(400).json({
        success: false,
        message: 'Sohbet oturumu ve mesaj gerekli'
      });
    }

    const guncellenenOturum = await GercekZamanliSohbetService.mesajGonder(sohbetOturumu, mesaj);

    res.json({
      success: true,
      data: guncellenenOturum
    });
  } catch (error) {
    console.error('Mesaj gönderme API hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Mesaj gönderilemedi'
    });
  }
});

// Görev tamamla
router.post('/gorev-tamamla', async (req, res) => {
  try {
    const { sohbetOturumu, gorevId } = req.body;

    if (!sohbetOturumu || !gorevId) {
      return res.status(400).json({
        success: false,
        message: 'Sohbet oturumu ve görev ID gerekli'
      });
    }

    const guncellenenOturum = await GercekZamanliSohbetService.gorevTamamla(sohbetOturumu, gorevId);

    res.json({
      success: true,
      data: guncellenenOturum,
      message: 'Görev başarıyla tamamlandı!'
    });
  } catch (error) {
    console.error('Görev tamamlama API hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Görev tamamlanamadı'
    });
  }
});

// Oturum kapat
router.post('/oturum-kapat', async (req, res) => {
  try {
    const { sohbetOturumu } = req.body;

    if (!sohbetOturumu) {
      return res.status(400).json({
        success: false,
        message: 'Sohbet oturumu gerekli'
      });
    }

    const kapatilanOturum = await GercekZamanliSohbetService.oturumKapat(sohbetOturumu);

    res.json({
      success: true,
      data: kapatilanOturum,
      message: 'Oturum başarıyla kapatıldı'
    });
  } catch (error) {
    console.error('Oturum kapatma API hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Oturum kapatılamadı'
    });
  }
});

// Aktif oturum getir
router.get('/aktif-oturum/:kullaniciId/:kullaniciTipi', async (req, res) => {
  try {
    const { kullaniciId, kullaniciTipi } = req.params;

    if (!['child', 'parent'].includes(kullaniciTipi)) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz kullanıcı tipi'
      });
    }

    const oturum = await GercekZamanliSohbetService.aktifOturumGetir(kullaniciId, kullaniciTipi);

    res.json({
      success: true,
      data: oturum
    });
  } catch (error) {
    console.error('Aktif oturum getirme API hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Aktif oturum getirilemedi'
    });
  }
});

// Kullanıcı oturumları getir
router.get('/kullanici-oturumlari/:kullaniciId/:kullaniciTipi', async (req, res) => {
  try {
    const { kullaniciId, kullaniciTipi } = req.params;
    const { limit = 10 } = req.query;

    if (!['child', 'parent'].includes(kullaniciTipi)) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz kullanıcı tipi'
      });
    }

    const oturumlar = await GercekZamanliSohbetService.kullaniciOturumlari(
      kullaniciId, 
      kullaniciTipi, 
      parseInt(limit)
    );

    res.json({
      success: true,
      data: oturumlar
    });
  } catch (error) {
    console.error('Kullanıcı oturumları getirme API hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Kullanıcı oturumları getirilemedi'
    });
  }
});

// Oturum detayı getir
router.get('/oturum/:sohbetOturumu', async (req, res) => {
  try {
    const { sohbetOturumu } = req.params;

    const oturum = await GercekZamanliSohbet.findOne({ sohbetOturumu });

    if (!oturum) {
      return res.status(404).json({
        success: false,
        message: 'Oturum bulunamadı'
      });
    }

    res.json({
      success: true,
      data: oturum
    });
  } catch (error) {
    console.error('Oturum detay getirme API hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Oturum detayı getirilemedi'
    });
  }
});

// Kullanıcı profilini güncelle
router.put('/profil-guncelle/:sohbetOturumu', async (req, res) => {
  try {
    const { sohbetOturumu } = req.params;
    const profilGuncellemeleri = req.body;

    const oturum = await GercekZamanliSohbet.findOne({ sohbetOturumu });

    if (!oturum) {
      return res.status(404).json({
        success: false,
        message: 'Oturum bulunamadı'
      });
    }

    // Profil güncellemelerini uygula
    Object.keys(profilGuncellemeleri).forEach(key => {
      if (oturum.kullaniciProfili[key] !== undefined) {
        oturum.kullaniciProfili[key] = profilGuncellemeleri[key];
      }
    });

    await oturum.save();

    res.json({
      success: true,
      data: oturum,
      message: 'Profil başarıyla güncellendi'
    });
  } catch (error) {
    console.error('Profil güncelleme API hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Profil güncellenemedi'
    });
  }
});

// Sistem ayarlarını güncelle
router.put('/ayarlar-guncelle/:sohbetOturumu', async (req, res) => {
  try {
    const { sohbetOturumu } = req.params;
    const ayarGuncellemeleri = req.body;

    const oturum = await GercekZamanliSohbet.findOne({ sohbetOturumu });

    if (!oturum) {
      return res.status(404).json({
        success: false,
        message: 'Oturum bulunamadı'
      });
    }

    // Ayar güncellemelerini uygula
    Object.keys(ayarGuncellemeleri).forEach(key => {
      if (oturum.sistemAyarlari[key] !== undefined) {
        oturum.sistemAyarlari[key] = ayarGuncellemeleri[key];
      }
    });

    await oturum.save();

    res.json({
      success: true,
      data: oturum,
      message: 'Ayarlar başarıyla güncellendi'
    });
  } catch (error) {
    console.error('Ayar güncelleme API hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Ayarlar güncellenemedi'
    });
  }
});

// Öneri uygula
router.post('/oneri-uygula', async (req, res) => {
  try {
    const { sohbetOturumu, oneriId, etkinlikSkoru } = req.body;

    if (!sohbetOturumu || !oneriId) {
      return res.status(400).json({
        success: false,
        message: 'Sohbet oturumu ve öneri ID gerekli'
      });
    }

    const oturum = await GercekZamanliSohbet.findOne({ sohbetOturumu });

    if (!oturum) {
      return res.status(404).json({
        success: false,
        message: 'Oturum bulunamadı'
      });
    }

    const oneri = oturum.oneriler.find(o => o.oneriId === oneriId);
    if (!oneri) {
      return res.status(404).json({
        success: false,
        message: 'Öneri bulunamadı'
      });
    }

    oneri.uygulandi = true;
    oneri.uygulamaZamani = new Date();
    if (etkinlikSkoru !== undefined) {
      oneri.etkinlikSkoru = Math.max(0, Math.min(10, etkinlikSkoru));
    }

    await oturum.save();

    res.json({
      success: true,
      data: oturum,
      message: 'Öneri başarıyla uygulandı'
    });
  } catch (error) {
    console.error('Öneri uygulama API hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Öneri uygulanamadı'
    });
  }
});

// İstatistikler
router.get('/istatistikler', async (req, res) => {
  try {
    const toplamOturum = await GercekZamanliSohbet.countDocuments();
    const aktifOturum = await GercekZamanliSohbet.countDocuments({ 'oturumDurumu.aktif': true });
    const toplamMesaj = await GercekZamanliSohbet.aggregate([
      { $group: { _id: null, toplam: { $sum: '$oturumDurumu.toplamMesaj' } } }
    ]);

    // Kullanıcı tipi dağılımı
    const cocukOturumlari = await GercekZamanliSohbet.countDocuments({ kullaniciTipi: 'child' });
    const veliOturumlari = await GercekZamanliSohbet.countDocuments({ kullaniciTipi: 'parent' });

    // Son 24 saatteki aktivite
    const son24Saat = new Date();
    son24Saat.setDate(son24Saat.getDate() - 1);
    const son24SaatAktivite = await GercekZamanliSohbet.countDocuments({
      'oturumDurumu.sonAktiviteZamani': { $gte: son24Saat }
    });

    const istatistikler = {
      toplamOturum,
      aktifOturum,
      toplamMesaj: toplamMesaj[0]?.toplam || 0,
      kullaniciTipiDagilimi: {
        cocuk: cocukOturumlari,
        veli: veliOturumlari
      },
      son24SaatAktivite,
      ortalamaMesajPerOturum: toplamOturum > 0 ? (toplamMesaj[0]?.toplam || 0) / toplamOturum : 0
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

// Tüm oturumları getir (yönetim paneli için)
router.get('/tum-oturumlar', async (req, res) => {
  try {
    const { sayfa = 1, limit = 50, kullaniciTipi, aktif } = req.query;
    const skip = (parseInt(sayfa) - 1) * parseInt(limit);

    let filter = {};
    if (kullaniciTipi) filter.kullaniciTipi = kullaniciTipi;
    if (aktif !== undefined) filter['oturumDurumu.aktif'] = aktif === 'true';

    const oturumlar = await GercekZamanliSohbet.find(filter)
      .sort({ 'oturumDurumu.baslangicZamani': -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const toplam = await GercekZamanliSohbet.countDocuments(filter);

    res.json({
      success: true,
      data: {
        oturumlar,
        toplam,
        sayfa: parseInt(sayfa),
        limit: parseInt(limit),
        toplamSayfa: Math.ceil(toplam / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Tüm oturumlar API hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Oturumlar getirilemedi'
    });
  }
});

export default router; 