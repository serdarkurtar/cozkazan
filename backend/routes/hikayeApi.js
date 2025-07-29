import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import xlsx from 'xlsx';
import fs from 'fs';
import Hikaye from '../models/Hikaye.js';
import pdf from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer konfigürasyonu
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads/hikayeler');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        const allowedTypes = ['.docx', '.doc', '.pdf'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Sadece Word ve PDF dosyaları kabul edilir!'), false);
        }
    }
});

// Tüm hikayeleri getir
router.get('/', async (req, res) => {
    try {
        const hikayeler = await Hikaye.find().sort({ olusturmaTarihi: -1 });
        res.json(hikayeler);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Sınıfa göre hikayeleri getir
router.get('/:sinif', async (req, res) => {
    try {
        const { sinif } = req.params;
        const hikayeler = await Hikaye.find({ sinif }).sort({ olusturmaTarihi: -1 });
        res.json(hikayeler);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Tek hikaye getir
router.get('/id/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const hikaye = await Hikaye.findById(id);
        
        if (!hikaye) {
            return res.status(404).json({ success: false, message: 'Hikaye bulunamadı' });
        }
        
        res.json(hikaye);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Yeni hikaye ekle
router.post('/', async (req, res) => {
    try {
        const { baslik, konu, seviye, sinif, icerik } = req.body;
        
        const hikaye = new Hikaye({
            baslik,
            konu,
            seviye,
            sinif,
            icerik: icerik || '',
            dosyaTipi: 'manuel'
        });

        await hikaye.save();
        res.json({ success: true, message: 'Hikaye başarıyla eklendi', hikaye });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Hikaye güncelle
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const hikaye = await Hikaye.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        );
        
        if (!hikaye) {
            return res.status(404).json({ success: false, message: 'Hikaye bulunamadı' });
        }
        
        res.json({ success: true, message: 'Hikaye başarıyla güncellendi', hikaye });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Hikaye durumunu değiştir
router.put('/:id/toggle', async (req, res) => {
    try {
        const { id } = req.params;
        
        const hikaye = await Hikaye.findById(id);
        if (!hikaye) {
            return res.status(404).json({ success: false, message: 'Hikaye bulunamadı' });
        }
        
        hikaye.aktif = !hikaye.aktif;
        await hikaye.save();
        
        res.json({ success: true, message: 'Hikaye durumu değiştirildi', hikaye });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Hikaye sil
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const hikaye = await Hikaye.findByIdAndDelete(id);
        if (!hikaye) {
            return res.status(404).json({ success: false, message: 'Hikaye bulunamadı' });
        }
        
        // Eğer dosya varsa sil
        if (hikaye.dosyaYolu && fs.existsSync(hikaye.dosyaYolu)) {
            fs.unlinkSync(hikaye.dosyaYolu);
        }
        
        res.json({ success: true, message: 'Hikaye başarıyla silindi' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Word dosyasından hikaye yükle
router.post('/word-upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Dosya yüklenmedi' });
        }

        const { sinif } = req.body;
        const baslik = req.file.originalname.replace(/\.(docx|doc)$/i, '');
        
        const hikaye = new Hikaye({
            baslik: baslik,
            konu: 'Word Hikaye',
            seviye: 'Orta',
            sinif: sinif,
            icerik: '',
            dosyaYolu: req.file.path,
            dosyaTipi: 'word'
        });

        await hikaye.save();

        res.json({ 
            success: true, 
            message: 'Word hikaye başarıyla eklendi',
            hikaye
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PDF dosyasından hikaye yükle
router.post('/pdf-upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Dosya yüklenmedi' });
        }

        const { sinif } = req.body;
        const baslik = req.file.originalname.replace('.pdf', '');
        
        // PDF'den metin çıkar
        let icerik = '';
        try {
            console.log('PDF dosya yolu:', req.file.path);
            const dataBuffer = fs.readFileSync(req.file.path);
            console.log('PDF dosyası okundu, boyut:', dataBuffer.length);
            
            const data = await pdf(dataBuffer);
            icerik = data.text;
            console.log('PDF metni çıkarıldı, uzunluk:', icerik.length);
        } catch (pdfError) {
            console.log('PDF metin çıkarma hatası:', pdfError);
            icerik = 'PDF içeriği okunamadı. Lütfen manuel olarak düzenleyin. Hata: ' + pdfError.message;
        }
        
        const hikaye = new Hikaye({
            baslik: baslik,
            konu: 'PDF Hikaye',
            seviye: 'Orta',
            sinif: sinif,
            icerik: icerik,
            dosyaYolu: req.file.path,
            dosyaTipi: 'pdf'
        });

        await hikaye.save();

        res.json({ 
            success: true, 
            message: 'PDF hikaye başarıyla eklendi',
            hikaye
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PDF içeriğini yeniden çıkar
router.post('/pdf-extract/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const hikaye = await Hikaye.findById(id);
        
        if (!hikaye) {
            return res.status(404).json({ success: false, message: 'Hikaye bulunamadı' });
        }
        
        if (hikaye.dosyaTipi !== 'pdf' || !hikaye.dosyaYolu) {
            return res.status(400).json({ success: false, message: 'Bu hikaye PDF değil veya dosya yolu yok' });
        }
        
        // PDF'den metin çıkar
        let icerik = '';
        try {
            console.log('PDF dosya yolu:', hikaye.dosyaYolu);
            
            // Dosya var mı kontrol et
            if (!fs.existsSync(hikaye.dosyaYolu)) {
                console.log('PDF dosyası bulunamadı:', hikaye.dosyaYolu);
                return res.status(404).json({ success: false, message: 'PDF dosyası bulunamadı' });
            }
            
            const dataBuffer = fs.readFileSync(hikaye.dosyaYolu);
            console.log('PDF dosyası okundu, boyut:', dataBuffer.length);
            
            const data = await pdf(dataBuffer);
            icerik = data.text;
            console.log('PDF metni çıkarıldı, uzunluk:', icerik.length);
        } catch (pdfError) {
            console.log('PDF metin çıkarma hatası:', pdfError);
            return res.status(500).json({ success: false, message: 'PDF içeriği okunamadı: ' + pdfError.message });
        }
        
        // Hikayeyi güncelle
        hikaye.icerik = icerik;
        await hikaye.save();
        
        res.json({ 
            success: true, 
            message: 'PDF içeriği başarıyla çıkarıldı',
            hikaye
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Tüm hikayeleri getir
router.get('/api/hikaye', async (req, res) => {
  try {
    const hikayeler = await Hikaye.find();
    res.json(hikayeler);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router; 