import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// AiEgitimVerisi modelini import et
import AiEgitimVerisi from '../models/AiEgitimVerisi.js';

dotenv.config();

// MongoDB bağlantısı
const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/cozkazan';

async function cocukMerakYukle() {
    try {
        console.log('🔗 MongoDB bağlantısı kuruluyor...');
        await mongoose.connect(mongoUrl);
        console.log('✅ MongoDB bağlantısı başarılı!');

        // JSON dosyasını oku
        const dosyaYolu = path.join(__dirname, '../../cocuk_merak_sorulari.json');
        
        if (!fs.existsSync(dosyaYolu)) {
            console.error('❌ Dosya bulunamadı:', dosyaYolu);
            return;
        }

        console.log('📖 Çocuk merak soruları JSON dosyası okunuyor...');
        const dosyaIcerigi = fs.readFileSync(dosyaYolu, 'utf8');
        const veriler = JSON.parse(dosyaIcerigi);

        console.log(`📊 Toplam ${veriler.length} çocuk merak sorusu bulundu`);

        // Verileri işle ve kaydet
        console.log('💾 Çocuk merak soruları kaydediliyor...');
        let basarili = 0;
        let hatali = 0;

        for (let i = 0; i < veriler.length; i++) {
            try {
                const veri = veriler[i];
                
                // JSON formatını kontrol et ve dönüştür
                let soru, cevap, kategori = 'çocuk';
                
                if (typeof veri === 'string') {
                    // Eğer veri string ise, soru olarak kabul et
                    soru = veri;
                    cevap = 'Bu merak sorusu için uygun cevap verilecek';
                } else if (veri.question && veri.answer) {
                    // Eğer question/answer formatında ise
                    soru = veri.question;
                    cevap = veri.answer;
                } else if (veri.soru && veri.cevap) {
                    // Eğer soru/cevap formatında ise
                    soru = veri.soru;
                    cevap = veri.cevap;
                } else if (veri.prompt && veri.response) {
                    // Eğer prompt/response formatında ise
                    soru = veri.prompt;
                    cevap = veri.response;
                } else if (veri.merak && veri.cevap) {
                    // Eğer merak/cevap formatında ise
                    soru = veri.merak;
                    cevap = veri.cevap;
                } else {
                    // Diğer formatlar için
                    const keys = Object.keys(veri);
                    if (keys.length >= 2) {
                        soru = veri[keys[0]];
                        cevap = veri[keys[1]];
                    } else {
                        soru = JSON.stringify(veri);
                        cevap = 'Bu merak sorusu için uygun cevap verilecek';
                    }
                }

                // Veriyi kaydet
                const yeniVeri = new AiEgitimVerisi({
                    kategori: 'çocuk',
                    soru: soru.toString().trim(),
                    cevap: cevap.toString().trim(),
                    zorlukSeviyesi: 'kolay', // Çocuk soruları genelde kolay
                    yasGrubu: '6-8', // Çocuk yaş grubu
                    aktif: true
                });

                await yeniVeri.save();
                basarili++;

                // İlerleme göster
                if (i % 100 === 0) {
                    console.log(`📈 İlerleme: ${i}/${veriler.length} (${((i/veriler.length)*100).toFixed(1)}%)`);
                }

            } catch (error) {
                hatali++;
                console.error(`❌ Veri ${i} hatası:`, error.message);
            }
        }

        console.log('\n🎉 Çocuk merak soruları yükleme tamamlandı!');
        console.log(`✅ Başarılı: ${basarili}`);
        console.log(`❌ Hatalı: ${hatali}`);
        console.log(`📊 Toplam: ${basarili + hatali}`);

        // İstatistikler
        const toplamVeri = await AiEgitimVerisi.countDocuments();
        const cocukVeri = await AiEgitimVerisi.countDocuments({ kategori: 'çocuk' });
        const kategoriIstatistikleri = await AiEgitimVerisi.aggregate([
            { $group: { _id: '$kategori', sayi: { $sum: 1 } } },
            { $sort: { sayi: -1 } }
        ]);

        console.log('\n📈 İstatistikler:');
        console.log(`📊 Toplam kayıtlı veri: ${toplamVeri}`);
        console.log(`👶 Çocuk kategorisi: ${cocukVeri}`);
        console.log('🏷️ Kategori dağılımı:');
        kategoriIstatistikleri.forEach(kat => {
            console.log(`   ${kat._id}: ${kat.sayi}`);
        });

    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 MongoDB bağlantısı kapatıldı');
    }
}

// Scripti çalıştır
cocukMerakYukle(); 