import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Statik dosyaları servis et
app.use(express.static(path.join(__dirname, 'public')));

// Yönetim paneli route'u
app.get('/yonetim', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'yonetim.html'));
});

// Ana sayfa
app.get('/', (req, res) => {
  res.send('ÇözKazan Backend Çalışıyor! <a href="/yonetim">Yönetim Paneli</a>');
});

app.listen(PORT, () => {
  console.log(`🚀 Basit sunucu http://localhost:${PORT} adresinde çalışıyor.`);
  console.log(`📊 Yönetim Paneli: http://localhost:${PORT}/yonetim`);
}); 