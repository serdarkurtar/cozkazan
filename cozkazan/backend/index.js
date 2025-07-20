import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import xlsx from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

import apiRouter from './routes/api.js';
import pdfRouter from './routes/pdfProcessor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API router'larını kullan
app.use('/api', apiRouter);
app.use('/api/pdf', pdfRouter);

// Statik dosyaları servis et
app.use(express.static(path.join(__dirname, 'public')));

// Yönetim paneli route'ları
app.get('/yonetim', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'yonetim.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-panel.html'));
});

app.get('/toplu-test-yukle', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'toplu-test-yukle.html'));
});

// Test düzenleme path'ini otomatik olarak HTML sayfasına yönlendir
app.get('/yonetim/test/:id/duzenle', (req, res) => {
  const testId = req.params.id;
  res.redirect(`/test-duzenle.html?id=${testId}`);
});

// Test yönetimi sayfası
app.get('/test-yonetim.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'test-yonetim.html'));
});

// PDF test yükleme sayfası
app.get('/pdf-test-yukle.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pdf-test-yukle.html'));
});

// Ana sayfa
app.get('/', (req, res) => {
  res.send('ÇözKazan Backend Çalışıyor! <a href="/yonetim">Yönetim Paneli</a>');
});

// Sunucu başlatma
const run = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/cozkazan';
    
    // MongoDB bağlantısını dene
    try {
      await mongoose.connect(mongoUrl);
      console.log("✅ Veritabanı bağlantısı başarılı.");
    } catch (dbError) {
      console.log("⚠️ MongoDB bağlantısı başarısız, sunucu veritabanı olmadan çalışacak.");
      console.log("📝 Hata:", dbError.message);
    }

    app.listen(PORT, () => {
      console.log(`\n🚀 Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
      console.log(`📊 Yönetim Paneli: http://localhost:${PORT}/yonetim`);
    });
  } catch (error) {
    console.error("❌ Sunucu başlatılırken hata:", error);
  }
};

run(); 