import express from 'express';
import DavranisOnerileri from '../models/DavranisOnerileri.js';

const router = express.Router();

// Tüm davranış önerilerini getir
router.get('/davranis-onerileri', async (req, res) => {
    try {
        const { kategori, yas_grubu, zorluk_seviyesi, aktif, limit = 50, sayfa = 1 } = req.query;
        
        let filter = {};
        
        if (kategori) filter.kategori = kategori;
        if (yas_grubu) filter.yas_grubu = yas_grubu;
        if (zorluk_seviyesi) filter.zorluk_seviyesi = zorluk_seviyesi;
        if (aktif !== undefined) filter.aktif = aktif === 'true';
        
        const skip = (parseInt(sayfa) - 1) * parseInt(limit);
        
        const davranislar = await DavranisOnerileri.find(filter)
            .sort({ kullanım_sayisi: -1, createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
            
        const toplam = await DavranisOnerileri.countDocuments(filter);
        
        res.json({
            success: true,
            data: davranislar,
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

// Davranış türüne göre öneri getir
router.get('/davranis-onerileri/:davranis_turu', async (req, res) => {
    try {
        const { davranis_turu } = req.params;
        
        const davranis = await DavranisOnerileri.findOne({ 
            davranis_turu: { $regex: new RegExp(davranis_turu, 'i') },
            aktif: true 
        });
        
        if (!davranis) {
            return res.status(404).json({ 
                success: false, 
                error: 'Davranış türü bulunamadı' 
            });
        }
        
        // Kullanım sayısını artır
        davranis.kullanım_sayisi += 1;
        await davranis.save();
        
        res.json({
            success: true,
            data: davranis
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Yeni davranış önerisi ekle
router.post('/davranis-onerileri', async (req, res) => {
    try {
        const { davranis_turu, oneriler, kategori, yas_grubu, zorluk_seviyesi } = req.body;
        
        if (!davranis_turu || !oneriler || !Array.isArray(oneriler)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Davranış türü ve öneriler gerekli' 
            });
        }
        
        const yeniDavranis = new DavranisOnerileri({
            davranis_turu,
            oneriler,
            kategori: kategori || 'genel',
            yas_grubu: yas_grubu || 'genel',
            zorluk_seviyesi: zorluk_seviyesi || 'orta'
        });
        
        await yeniDavranis.save();
        
        res.status(201).json({
            success: true,
            data: yeniDavranis
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Davranış önerisini güncelle
router.put('/davranis-onerileri/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const davranis = await DavranisOnerileri.findByIdAndUpdate(
            id,
            { ...updateData, son_guncelleme: new Date() },
            { new: true, runValidators: true }
        );
        
        if (!davranis) {
            return res.status(404).json({ 
                success: false, 
                error: 'Davranış önerisi bulunamadı' 
            });
        }
        
        res.json({
            success: true,
            data: davranis
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Davranış önerisini sil
router.delete('/davranis-onerileri/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const davranis = await DavranisOnerileri.findByIdAndDelete(id);
        
        if (!davranis) {
            return res.status(404).json({ 
                success: false, 
                error: 'Davranış önerisi bulunamadı' 
            });
        }
        
        res.json({
            success: true,
            message: 'Davranış önerisi silindi'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// İstatistikler
router.get('/davranis-onerileri-istatistikler', async (req, res) => {
    try {
        const toplam = await DavranisOnerileri.countDocuments();
        const aktif = await DavranisOnerileri.countDocuments({ aktif: true });
        
        const kategoriIstatistikleri = await DavranisOnerileri.aggregate([
            { $group: { _id: '$kategori', sayi: { $sum: 1 } } },
            { $sort: { sayi: -1 } }
        ]);
        
        const yasGrubuIstatistikleri = await DavranisOnerileri.aggregate([
            { $group: { _id: '$yas_grubu', sayi: { $sum: 1 } } },
            { $sort: { sayi: -1 } }
        ]);
        
        const enCokKullanilan = await DavranisOnerileri.find()
            .sort({ kullanım_sayisi: -1 })
            .limit(10);
        
        res.json({
            success: true,
            data: {
                toplam,
                aktif,
                kategoriIstatistikleri,
                yasGrubuIstatistikleri,
                enCokKullanilan
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Toplu davranış önerisi ekle
router.post('/davranis-onerileri-toplu', async (req, res) => {
    try {
        const { davranislar } = req.body;
        
        if (!Array.isArray(davranislar)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Davranışlar array olmalı' 
            });
        }
        
        const sonuclar = [];
        let basarili = 0;
        let hatali = 0;
        
        for (const davranis of davranislar) {
            try {
                const yeniDavranis = new DavranisOnerileri(davranis);
                await yeniDavranis.save();
                sonuclar.push({ davranis_turu: davranis.davranis_turu, durum: 'başarılı' });
                basarili++;
            } catch (error) {
                sonuclar.push({ 
                    davranis_turu: davranis.davranis_turu, 
                    durum: 'hatalı', 
                    hata: error.message 
                });
                hatali++;
            }
        }
        
        res.json({
            success: true,
            data: {
                toplam: davranislar.length,
                basarili,
                hatali,
                sonuclar
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router; 