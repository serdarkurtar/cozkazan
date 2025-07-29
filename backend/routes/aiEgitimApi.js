import express from 'express';
import AiEgitimVerisi from '../models/AiEgitimVerisi.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Tüm eğitim verilerini getir
router.get('/egitim-verileri', async (req, res) => {
    try {
        const { kategori, zorlukSeviyesi, yasGrubu, aktif, limit = 50, skip = 0 } = req.query;
        
        let filter = {};
        
        if (kategori) filter.kategori = kategori;
        if (zorlukSeviyesi) filter.zorlukSeviyesi = zorlukSeviyesi;
        if (yasGrubu) filter.yasGrubu = yasGrubu;
        if (aktif !== undefined) filter.aktif = aktif === 'true';
        
        const veriler = await AiEgitimVerisi.find(filter)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));
            
        const toplam = await AiEgitimVerisi.countDocuments(filter);
        
        res.json({
            success: true,
            data: veriler,
            toplam,
            sayfa: Math.floor(skip / limit) + 1,
            toplamSayfa: Math.ceil(toplam / limit)
        });
    } catch (error) {
        console.error('Eğitim verileri getirme hatası:', error);
        res.status(500).json({ error: 'Eğitim verileri getirilemedi' });
    }
});

// Yeni eğitim verisi ekle
router.post('/egitim-verisi', async (req, res) => {
    try {
        const { kategori, soru, cevap, aciklama, zorlukSeviyesi, yasGrubu, etiketler } = req.body;
        
        if (!kategori || !soru || !cevap) {
            return res.status(400).json({ error: 'Kategori, soru ve cevap zorunludur' });
        }
        
        const yeniVeri = new AiEgitimVerisi({
            kategori,
            soru: soru.trim(),
            cevap: cevap.trim(),
            aciklama: aciklama?.trim(),
            zorlukSeviyesi: zorlukSeviyesi || 'orta',
            yasGrubu: yasGrubu || '9-11',
            etiketler: etiketler || []
        });
        
        await yeniVeri.save();
        
        res.json({
            success: true,
            message: 'Eğitim verisi başarıyla eklendi',
            data: yeniVeri
        });
    } catch (error) {
        console.error('Eğitim verisi ekleme hatası:', error);
        res.status(500).json({ error: 'Eğitim verisi eklenemedi' });
    }
});

// Eğitim verisi güncelle
router.put('/egitim-verisi/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const guncellenenVeri = await AiEgitimVerisi.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: new Date() },
            { new: true, runValidators: true }
        );
        
        if (!guncellenenVeri) {
            return res.status(404).json({ error: 'Eğitim verisi bulunamadı' });
        }
        
        res.json({
            success: true,
            message: 'Eğitim verisi başarıyla güncellendi',
            data: guncellenenVeri
        });
    } catch (error) {
        console.error('Eğitim verisi güncelleme hatası:', error);
        res.status(500).json({ error: 'Eğitim verisi güncellenemedi' });
    }
});

// Eğitim verisi sil
router.delete('/egitim-verisi/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const silinenVeri = await AiEgitimVerisi.findByIdAndDelete(id);
        
        if (!silinenVeri) {
            return res.status(404).json({ error: 'Eğitim verisi bulunamadı' });
        }
        
        res.json({
            success: true,
            message: 'Eğitim verisi başarıyla silindi'
        });
    } catch (error) {
        console.error('Eğitim verisi silme hatası:', error);
        res.status(500).json({ error: 'Eğitim verisi silinemedi' });
    }
});

// Dosyadan toplu veri yükleme
router.post('/toplu-yukle', async (req, res) => {
    try {
        const { dosyaYolu, kategori } = req.body;
        
        if (!dosyaYolu || !kategori) {
            return res.status(400).json({ error: 'Dosya yolu ve kategori zorunludur' });
        }
        
        // Dosya var mı kontrol et
        if (!fs.existsSync(dosyaYolu)) {
            return res.status(404).json({ error: 'Dosya bulunamadı' });
        }
        
        // Dosya içeriğini oku
        const dosyaIcerigi = fs.readFileSync(dosyaYolu, 'utf8');
        const satirlar = dosyaIcerigi.split('\n').filter(satir => satir.trim());
        
        const yuklenenVeriler = [];
        let hataSayisi = 0;
        
        for (let i = 0; i < satirlar.length; i += 2) {
            if (i + 1 < satirlar.length) {
                const soru = satirlar[i].trim();
                const cevap = satirlar[i + 1].trim();
                
                if (soru && cevap) {
                    try {
                        const yeniVeri = new AiEgitimVerisi({
                            kategori,
                            soru,
                            cevap,
                            zorlukSeviyesi: 'orta',
                            yasGrubu: '9-11'
                        });
                        
                        await yeniVeri.save();
                        yuklenenVeriler.push(yeniVeri);
                    } catch (error) {
                        hataSayisi++;
                        console.error(`Satır ${i + 1} hatası:`, error);
                    }
                }
            }
        }
        
        res.json({
            success: true,
            message: `${yuklenenVeriler.length} eğitim verisi başarıyla yüklendi`,
            yuklenenSayi: yuklenenVeriler.length,
            hataSayisi,
            data: yuklenenVeriler
        });
        
    } catch (error) {
        console.error('Toplu yükleme hatası:', error);
        res.status(500).json({ error: 'Toplu yükleme başarısız' });
    }
});

// AI için rastgele eğitim verisi getir
router.get('/rastgele-egitim', async (req, res) => {
    try {
        const { kategori, zorlukSeviyesi, yasGrubu, limit = 10 } = req.query;
        
        let filter = { aktif: true };
        
        if (kategori) filter.kategori = kategori;
        if (zorlukSeviyesi) filter.zorlukSeviyesi = zorlukSeviyesi;
        if (yasGrubu) filter.yasGrubu = yasGrubu;
        
        const veriler = await AiEgitimVerisi.aggregate([
            { $match: filter },
            { $sample: { size: parseInt(limit) } }
        ]);
        
        res.json({
            success: true,
            data: veriler
        });
    } catch (error) {
        console.error('Rastgele eğitim verisi getirme hatası:', error);
        res.status(500).json({ error: 'Eğitim verisi getirilemedi' });
    }
});

// İstatistikler
router.get('/istatistikler', async (req, res) => {
    try {
        const toplamVeri = await AiEgitimVerisi.countDocuments();
        const aktifVeri = await AiEgitimVerisi.countDocuments({ aktif: true });
        
        const kategoriIstatistikleri = await AiEgitimVerisi.aggregate([
            { $group: { _id: '$kategori', sayi: { $sum: 1 } } },
            { $sort: { sayi: -1 } }
        ]);
        
        const zorlukIstatistikleri = await AiEgitimVerisi.aggregate([
            { $group: { _id: '$zorlukSeviyesi', sayi: { $sum: 1 } } },
            { $sort: { sayi: -1 } }
        ]);
        
        res.json({
            success: true,
            data: {
                toplamVeri,
                aktifVeri,
                kategoriIstatistikleri,
                zorlukIstatistikleri
            }
        });
    } catch (error) {
        console.error('İstatistik hatası:', error);
        res.status(500).json({ error: 'İstatistikler getirilemedi' });
    }
});

export default router; 