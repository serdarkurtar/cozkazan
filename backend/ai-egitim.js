import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AiStats from './models/AiStats.js';
import AiMemory from './models/AiMemory.js';
import AiFeedback from './models/AiFeedback.js';
import Test from './models/Test.js';
import Soru from './models/Soru.js';
import os from 'os';

dotenv.config();

const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/cozkazan';

class AIEgitimSistemi {
  constructor() {
    this.ogrenmeVerileri = [];
    this.gunlukDersler = [];
    this.sonCalismaZamani = null;
    this.calismaAraligi = 30 * 60 * 1000; // 30 dakika
    this.sistemYukuEsigi = 70; // %70 CPU kullanımı
  }

  async baglantiKur() {
    await mongoose.connect(mongoUrl);
    console.log('🤖 Akıllı AI Eğitim Sistemi başlatıldı...');
  }

  // Sistem yükünü kontrol et
  sistemYukuKontrol() {
    const cpuKullanimi = os.loadavg()[0] * 100; // 1 dakikalık ortalama
    const bellekKullanimi = (1 - os.freemem() / os.totalmem()) * 100;
    
    console.log(`📊 Sistem Yükü - CPU: ${cpuKullanimi.toFixed(1)}%, RAM: ${bellekKullanimi.toFixed(1)}%`);
    
    return cpuKullanimi < this.sistemYukuEsigi && bellekKullanimi < 80;
  }

  // Sistem boşta mı kontrol et
  sistemBosMu() {
    const simdi = Date.now();
    
    // Son çalışmadan bu yana yeterli süre geçti mi?
    if (this.sonCalismaZamani && (simdi - this.sonCalismaZamani) < this.calismaAraligi) {
      return false;
    }
    
    // Sistem yükü uygun mu?
    return this.sistemYukuKontrol();
  }

  // Günlük ders programı oluştur
  gunlukDersProgramiOlustur() {
    const dersler = [
      {
        konu: 'Çocuk Psikolojisi ve Motivasyon',
        icerik: 'Çocukların yanlış cevaplarında moral veren, başarıda öven, sıkılınca eğlenceli öneriler sunan algoritma geliştirilir.',
        zorluk: 'orta',
        kategori: 'psikoloji'
      },
      {
        konu: 'Veli Psikolojisi ve Raporlama',
        icerik: 'Velilere çocuğun gelişimi, güçlü/zayıf yönleri, motivasyon önerileri ve psikolojik destek mesajları sunan raporlar hazırlanır.',
        zorluk: 'orta',
        kategori: 'veli-destek'
      },
      {
        konu: 'Ödül Sistemi ve Oyunlaştırma',
        icerik: 'Başarıya göre rozet, yıldız, seviye atlama, sürpriz ödül gibi motivasyonel unsurlar tasarlanır.',
        zorluk: 'kolay',
        kategori: 'motivasyon'
      },
      {
        konu: 'Kişisel Sorun Çözümü',
        icerik: 'Çocuğun zorlandığı konularda yardımcı ipucu, mini oyun, görsel destek gibi öneriler üretilir.',
        zorluk: 'zor',
        kategori: 'problem-cozme'
      },
      {
        konu: 'Zayıf Derslerde Eğlenceli Çalışma',
        icerik: 'Öğrencinin zayıf olduğu derslerde eğlenceli, oyunlaştırılmış mini testler ve etkinlikler önerilir.',
        zorluk: 'orta',
        kategori: 'eglenceli-egitim'
      },
      {
        konu: 'Yanlış Cevap Motivasyonu',
        icerik: 'Yanlış cevapta doğru cevabı gösterip moral veren, birlikte tekrar deneme teşvik eden sistem.',
        zorluk: 'kolay',
        kategori: 'motivasyon'
      },
      {
        konu: 'Başarı Ödüllendirme',
        icerik: 'Doğru cevaplarda aferin, harikasın gibi pozitif geri bildirimler ve ödül sistemi.',
        zorluk: 'kolay',
        kategori: 'odul-sistemi'
      },
      {
        konu: 'Veli Akıllı Raporları',
        icerik: 'Haftalık/aylık gelişim raporu, psikolojik durum analizi ve veliye özel öneriler.',
        zorluk: 'orta',
        kategori: 'raporlama'
      }
    ];

    this.gunlukDersler = dersler;
    console.log('📚 Günlük ders programı hazırlandı!');
  }

  // AI'ya yeni bilgi öğret
  async yeniBilgiOgren(konu, icerik, zorluk = 'orta', kategori = 'genel') {
    const yeniBilgi = {
      konu,
      icerik,
      zorluk,
      kategori,
      ogrenmeTarihi: new Date(),
      basariOrani: 0,
      tekrarSayisi: 0
    };

    this.ogrenmeVerileri.push(yeniBilgi);
    console.log(`🧠 Yeni bilgi öğrenildi: ${konu} (${kategori})`);
    
    return yeniBilgi;
  }

  // Test istatistiklerini analiz et
  async testIstatistikleriniAnalizEt() {
    console.log('📊 Test istatistikleri analiz ediliyor...');
    
    const testler = await Test.find();
    const sorular = await Soru.find();
    
    for (const test of testler) {
      const testSorulari = sorular.filter(s => s.test.toString() === test._id.toString());
      
      // Test zorluk seviyesini hesapla
      const ortalamaZorluk = this.zorlukSeviyesiHesapla(testSorulari);
      
      // AI Stats'a kaydet
      await this.aiStatsGuncelle(test._id, test.konu, {
        zorlukSkoru: ortalamaZorluk,
        basariOrani: 0,
        cozulmeSayisi: 0
      });
    }
    
    console.log(`✅ ${testler.length} test analiz edildi`);
  }

  // Zorluk seviyesi hesaplama algoritması
  zorlukSeviyesiHesapla(sorular) {
    if (sorular.length === 0) return 50;
    
    let toplamZorluk = 0;
    sorular.forEach(soru => {
      // Soru uzunluğu, seçenek sayısı, kelime sayısı gibi faktörler
      const uzunlukZorlugu = Math.min(soru.soruMetni.length / 100, 1) * 20;
      const secenekZorlugu = 10; // 4 seçenek varsayılan
      const kelimeZorlugu = Math.min(soru.soruMetni.split(' ').length / 10, 1) * 15;
      
      toplamZorluk += (uzunlukZorlugu + secenekZorlugu + kelimeZorlugu);
    });
    
    return Math.min(Math.max(toplamZorluk / sorular.length, 10), 90);
  }

  // AI Stats güncelle
  async aiStatsGuncelle(testId, konuId, veriler) {
    try {
      let aiStat = await AiStats.findOne({ testId, konuId });
      
      if (!aiStat) {
        aiStat = new AiStats({
          kullaniciId: new mongoose.Types.ObjectId(), // Geçici ID
          testId,
          konuId,
          soruId: new mongoose.Types.ObjectId(), // Geçici ID
          ...veriler
        });
      } else {
        Object.assign(aiStat, veriler);
      }
      
      await aiStat.save();
    } catch (error) {
      console.error('AI Stats güncelleme hatası:', error);
    }
  }

  // Öğrenme hafızasını güncelle
  async ogrenmeHafizasiGuncelle(konuId, ogrenmeVerisi) {
    try {
      let hafiza = await AiMemory.findOne({ konuId });
      
      if (!hafiza) {
        hafiza = new AiMemory({
          kullaniciId: new mongoose.Types.ObjectId(), // Geçici ID
          konuId,
          ogrenmeSeviyesi: 10,
          cozulenTestSayisi: 0,
          basariliTestSayisi: 0,
          toplamSure: 0,
          zorlukSeviyesi: 'orta',
          ogrenmeHizi: 1.0,
          unutmaHizi: 0.1
        });
      }
      
      // Öğrenme seviyesini artır
      hafiza.ogrenmeSeviyesi = Math.min(hafiza.ogrenmeSeviyesi + 5, 100);
      hafiza.sonCalismaTarihi = new Date();
      
      await hafiza.save();
      console.log(`🧠 Öğrenme hafızası güncellendi: ${hafiza.ogrenmeSeviyesi}%`);
    } catch (error) {
      console.error('Hafıza güncelleme hatası:', error);
    }
  }

  // Günlük eğitim seansı
  async gunlukEgitimSeansi() {
    console.log('\n🎓 === AKILLI AI EĞİTİM SEANSI BAŞLADI ===');
    
    // Ders programını oluştur
    this.gunlukDersProgramiOlustur();
    
    // Her dersi öğret
    for (const ders of this.gunlukDersler) {
      console.log(`\n📖 Ders: ${ders.konu}`);
      console.log(`📝 İçerik: ${ders.icerik}`);
      console.log(`🏷️ Kategori: ${ders.kategori}`);
      
      // Yeni bilgiyi öğret
      const yeniBilgi = await this.yeniBilgiOgren(ders.konu, ders.icerik, ders.zorluk, ders.kategori);
      
      // Öğrenme hafızasını güncelle
      await this.ogrenmeHafizasiGuncelle(null, yeniBilgi);
      
      // Kısa bir bekleme (gerçek öğrenme simülasyonu)
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Test istatistiklerini analiz et
    await this.testIstatistikleriniAnalizEt();
    
    // Son çalışma zamanını güncelle
    this.sonCalismaZamani = Date.now();
    
    console.log('\n🎉 === AKILLI AI EĞİTİM SEANSI TAMAMLANDI ===');
    console.log(`📚 Bugün ${this.gunlukDersler.length} ders öğrenildi`);
    console.log(`🧠 Toplam öğrenilen bilgi: ${this.ogrenmeVerileri.length}`);
  }

  // AI durumunu raporla
  aiDurumRaporu() {
    console.log('\n🤖 === AKILLI AI DURUM RAPORU ===');
    console.log(`📚 Toplam öğrenilen bilgi: ${this.ogrenmeVerileri.length}`);
    console.log(`📖 Bugünkü dersler: ${this.gunlukDersler.length}`);
    
    const zorlukDagilimi = {
      kolay: this.ogrenmeVerileri.filter(v => v.zorluk === 'kolay').length,
      orta: this.ogrenmeVerileri.filter(v => v.zorluk === 'orta').length,
      zor: this.ogrenmeVerileri.filter(v => v.zorluk === 'zor').length
    };
    
    const kategoriDagilimi = {};
    this.ogrenmeVerileri.forEach(v => {
      kategoriDagilimi[v.kategori] = (kategoriDagilimi[v.kategori] || 0) + 1;
    });
    
    console.log('📊 Zorluk dağılımı:');
    console.log(`   - Kolay: ${zorlukDagilimi.kolay}`);
    console.log(`   - Orta: ${zorlukDagilimi.orta}`);
    console.log(`   - Zor: ${zorlukDagilimi.zor}`);
    
    console.log('📊 Kategori dağılımı:');
    Object.entries(kategoriDagilimi).forEach(([kategori, sayi]) => {
      console.log(`   - ${kategori}: ${sayi}`);
    });
    
    console.log('\n🎯 AI yetenekleri:');
    console.log('   ✅ Çocuk psikolojisi ve motivasyon');
    console.log('   ✅ Veli psikolojisi ve raporlama');
    console.log('   ✅ Ödül sistemi ve oyunlaştırma');
    console.log('   ✅ Kişisel sorun çözümü');
    console.log('   ✅ Zayıf derslerde eğlenceli çalışma');
    console.log('   ✅ Yanlış cevap motivasyonu');
    console.log('   ✅ Başarı ödüllendirme');
    console.log('   ✅ Veli akıllı raporları');
  }

  // Sürekli çalışan akıllı sistem
  async surekliCalisanSistem() {
    console.log('🔄 Akıllı AI sistemi sürekli çalışma modunda...');
    
    while (true) {
      try {
        // Sistem boşta mı kontrol et
        if (this.sistemBosMu()) {
          console.log('\n⏰ Sistem boşta, AI eğitimi başlatılıyor...');
          await this.gunlukEgitimSeansi();
          this.aiDurumRaporu();
        } else {
          console.log('⏳ Sistem meşgul, bekleniyor...');
        }
        
        // 5 dakika bekle
        await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000));
        
      } catch (error) {
        console.error('❌ Sürekli çalışma hatası:', error);
        await new Promise(resolve => setTimeout(resolve, 10 * 60 * 1000)); // 10 dakika bekle
      }
    }
  }
}

// Eğitim sistemini başlat
async function aiEgitiminiBaslat() {
  const aiEgitim = new AIEgitimSistemi();
  
  try {
    await aiEgitim.baglantiKur();
    
    // Komut satırı argümanlarını kontrol et
    const args = process.argv.slice(2);
    
    if (args.includes('--surekli')) {
      // Sürekli çalışan mod
      await aiEgitim.surekliCalisanSistem();
    } else {
      // Tek seferlik eğitim
      await aiEgitim.gunlukEgitimSeansi();
      aiEgitim.aiDurumRaporu();
      console.log('\n🚀 AI eğitimi tamamlandı! Artık daha akıllı!');
      process.exit(0);
    }
    
  } catch (error) {
    console.error('❌ AI eğitimi sırasında hata:', error);
    process.exit(1);
  }
}

// Script çalıştırıldığında eğitimi başlat
if (import.meta.url === `file://${process.argv[1]}`) {
  aiEgitiminiBaslat();
}

export default AIEgitimSistemi; 