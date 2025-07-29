import express from 'express';
import DinamikSoruCevap from '../models/DinamikSoruCevap.js';
import DinamikQAService from '../services/dinamikQAService.js';

const router = express.Router();
const qaService = new DinamikQAService();

// GENERATE_DYNAMIC_QA komutu
router.post('/generate-dynamic-qa', async (req, res) => {
    try {
        const {
            difficulty_levels = ['easy', 'medium', 'hard'],
            categories = ['education', 'psychology', 'health', 'motivation', 'behavior'],
            max_per_category = 1000,
            yas_grubu = 'genel'
        } = req.body;

        console.log('🚀 Dinamik soru-cevap üretimi başlatılıyor...');
        console.log(`📊 Parametreler: ${categories.join(', ')} kategorileri, ${difficulty_levels.join(', ')} zorluk seviyeleri, ${max_per_category} maksimum/kategori`);

        const sonuc = await qaService.topluSoruCevapUret({
            difficulty_levels,
            categories,
            max_per_category,
            yas_grubu
        });

        console.log(`✅ Üretim tamamlandı: ${sonuc.toplam_uretilen} soru-cevap üretildi`);

        res.json({
            success: true,
            message: 'Dinamik soru-cevap üretimi tamamlandı',
            data: sonuc
        });
    } catch (error) {
        console.error('❌ Dinamik QA üretim hatası:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Tek soru-cevap üret
router.post('/generate-single-qa', async (req, res) => {
    try {
        const {
            kategori = 'general',
            zorluk_seviyesi = 'medium',
            yas_grubu = 'genel'
        } = req.body;

        const soruCevap = await qaService.tekSoruCevapUret(kategori, zorluk_seviyesi, yas_grubu);
        
        // Veritabanına kaydet
        const yeniSoruCevap = new DinamikSoruCevap(soruCevap);
        await yeniSoruCevap.save();

        res.json({
            success: true,
            data: yeniSoruCevap
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Varyasyon üret
router.post('/generate-variations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { varyasyon_sayisi = 5 } = req.body;

        const varyasyonlar = await qaService.varyasyonUret(id, varyasyon_sayisi);

        res.json({
            success: true,
            data: varyasyonlar
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Tüm dinamik soru-cevapları getir
router.get('/dynamic-qa', async (req, res) => {
    try {
        const {
            kategori,
            zorluk_seviyesi,
            yas_grubu,
            soru_tipi,
            aktif,
            limit = 50,
            sayfa = 1,
            siralama = 'kalite' // kalite, kullanım, tarih
        } = req.query;

        let filter = {};
        
        if (kategori) filter.kategori = kategori;
        if (zorluk_seviyesi) filter.zorluk_seviyesi = zorluk_seviyesi;
        if (yas_grubu) filter.yas_grubu = yas_grubu;
        if (soru_tipi) filter.soru_tipi = soru_tipi;
        if (aktif !== undefined) filter.aktif = aktif === 'true';

        const skip = (parseInt(sayfa) - 1) * parseInt(limit);
        
        let sortOptions = {};
        switch (siralama) {
            case 'kalite':
                sortOptions = { kalite_puani: -1, kullanım_sayisi: -1 };
                break;
            case 'kullanım':
                sortOptions = { kullanım_sayisi: -1, kalite_puani: -1 };
                break;
            case 'tarih':
                sortOptions = { createdAt: -1 };
                break;
            default:
                sortOptions = { kalite_puani: -1, kullanım_sayisi: -1 };
        }

        const soruCevaplar = await DinamikSoruCevap.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));
            
        const toplam = await DinamikSoruCevap.countDocuments(filter);
        
        res.json({
            success: true,
            data: soruCevaplar,
            pagination: {
                toplam,
                sayfa: parseInt(sayfa),
                limit: parseInt(limit),
                toplam_sayfa: Math.ceil(toplam / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Tek soru-cevap getir
router.get('/dynamic-qa/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const soruCevap = await DinamikSoruCevap.findById(id);
        
        if (!soruCevap) {
            return res.status(404).json({ 
                success: false, 
                error: 'Soru-cevap bulunamadı' 
            });
        }
        
        // Kullanım sayısını artır
        soruCevap.kullanım_sayisi += 1;
        await soruCevap.save();
        
        res.json({
            success: true,
            data: soruCevap
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Soru-cevap güncelle
router.put('/dynamic-qa/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const soruCevap = await DinamikSoruCevap.findByIdAndUpdate(
            id,
            { ...updateData, son_guncelleme: new Date() },
            { new: true, runValidators: true }
        );
        
        if (!soruCevap) {
            return res.status(404).json({ 
                success: false, 
                error: 'Soru-cevap bulunamadı' 
            });
        }
        
        res.json({
            success: true,
            data: soruCevap
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Soru-cevap sil
router.delete('/dynamic-qa/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const soruCevap = await DinamikSoruCevap.findByIdAndDelete(id);
        
        if (!soruCevap) {
            return res.status(404).json({ 
                success: false, 
                error: 'Soru-cevap bulunamadı' 
            });
        }
        
        res.json({
            success: true,
            message: 'Soru-cevap silindi'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Kalite kontrolü
router.post('/quality-check/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const kalitePuani = await qaService.kaliteKontrol(id);
        
        res.json({
            success: true,
            data: { kalite_puani: kalitePuani }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Toplu kalite kontrolü
router.post('/bulk-quality-check', async (req, res) => {
    try {
        const { limit = 100 } = req.body;
        
        const soruCevaplar = await DinamikSoruCevap.find()
            .limit(parseInt(limit))
            .sort({ kalite_puani: 1 }); // En düşük kaliteden başla
        
        const sonuclar = [];
        for (const soruCevap of soruCevaplar) {
            try {
                const kalitePuani = await qaService.kaliteKontrol(soruCevap._id);
                sonuclar.push({
                    id: soruCevap._id,
                    eski_puan: soruCevap.kalite_puani,
                    yeni_puan: kalitePuani
                });
            } catch (error) {
                console.error(`Kalite kontrol hatası (${soruCevap._id}):`, error.message);
            }
        }
        
        res.json({
            success: true,
            data: {
                kontrol_edilen: sonuclar.length,
                sonuclar
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// İstatistikler
router.get('/dynamic-qa-stats', async (req, res) => {
    try {
        const istatistikler = await qaService.istatistikler();
        
        res.json({
            success: true,
            data: istatistikler
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Arama
router.get('/dynamic-qa-search', async (req, res) => {
    try {
        const { q, limit = 20 } = req.query;
        
        if (!q) {
            return res.status(400).json({
                success: false,
                error: 'Arama terimi gerekli'
            });
        }
        
        const soruCevaplar = await DinamikSoruCevap.find(
            { $text: { $search: q } },
            { score: { $meta: "textScore" } }
        )
        .sort({ score: { $meta: "textScore" } })
        .limit(parseInt(limit));
        
        res.json({
            success: true,
            data: soruCevaplar
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Toplu silme
router.delete('/bulk-delete', async (req, res) => {
    try {
        const { ids } = req.body;
        
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Silinecek ID\'ler gerekli'
            });
        }
        
        const sonuc = await DinamikSoruCevap.deleteMany({ _id: { $in: ids } });
        
        res.json({
            success: true,
            data: {
                silinen_sayi: sonuc.deletedCount
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router; 