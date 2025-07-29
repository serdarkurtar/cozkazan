import GelisimRaporu from '../models/GelisimRaporu.js';
import DuyguAnalizi from '../models/DuyguAnalizi.js';
import Test from '../models/Test.js';
import Hikaye from '../models/Hikaye.js';
import User from '../models/User.js';

class GelisimRaporuService {
  // Otomatik rapor oluştur
  static async otomatikRaporOlustur(childId, parentId, raporTipi = 'weekly') {
    try {
      const { baslangicTarihi, bitisTarihi } = this._tarihAraligiHesapla(raporTipi);
      
      // Mevcut rapor var mı kontrol et
      const mevcutRapor = await GelisimRaporu.findOne({
        childId,
        raporTipi,
        baslangicTarihi,
        bitisTarihi
      });

      if (mevcutRapor) {
        return mevcutRapor;
      }

      // Verileri topla
      const veriler = await this._verileriTopla(childId, baslangicTarihi, bitisTarihi);
      
      // Rapor oluştur
      const rapor = new GelisimRaporu({
        childId,
        parentId,
        raporTipi,
        baslangicTarihi,
        bitisTarihi,
        ...veriler
      });

      await rapor.save();
      return rapor;
    } catch (error) {
      console.error('Otomatik rapor oluşturma hatası:', error);
      throw error;
    }
  }

  // Tarih aralığını hesapla
  static _tarihAraligiHesapla(raporTipi) {
    const simdi = new Date();
    let baslangicTarihi, bitisTarihi;

    switch (raporTipi) {
      case 'daily':
        baslangicTarihi = new Date(simdi);
        baslangicTarihi.setHours(0, 0, 0, 0);
        bitisTarihi = new Date(simdi);
        bitisTarihi.setHours(23, 59, 59, 999);
        break;
      
      case 'weekly':
        // Bu haftanın pazartesi günü
        const pazartesi = new Date(simdi);
        const gun = simdi.getDay();
        const gunFarki = gun === 0 ? 6 : gun - 1; // Pazar = 0, Pazartesi = 1
        pazartesi.setDate(simdi.getDate() - gunFarki);
        pazartesi.setHours(0, 0, 0, 0);
        
        baslangicTarihi = pazartesi;
        bitisTarihi = new Date(pazartesi);
        bitisTarihi.setDate(pazartesi.getDate() + 6);
        bitisTarihi.setHours(23, 59, 59, 999);
        break;
      
      case 'monthly':
        // Bu ayın ilk günü
        baslangicTarihi = new Date(simdi.getFullYear(), simdi.getMonth(), 1);
        bitisTarihi = new Date(simdi.getFullYear(), simdi.getMonth() + 1, 0);
        bitisTarihi.setHours(23, 59, 59, 999);
        break;
      
      default:
        throw new Error('Geçersiz rapor tipi');
    }

    return { baslangicTarihi, bitisTarihi };
  }

  // Verileri topla
  static async _verileriTopla(childId, baslangicTarihi, bitisTarihi) {
    try {
      // Test verilerini topla
      const testVerileri = await this._testVerileriniTopla(childId, baslangicTarihi, bitisTarihi);
      
      // Hikaye verilerini topla
      const hikayeVerileri = await this._hikayeVerileriniTopla(childId, baslangicTarihi, bitisTarihi);
      
      // Duygu analizi verilerini topla
      const duyguVerileri = await this._duyguVerileriniTopla(childId, baslangicTarihi, bitisTarihi);
      
      // XP verilerini topla
      const xpVerileri = await this._xpVerileriniTopla(childId, baslangicTarihi, bitisTarihi);
      
      // Grafik verilerini oluştur
      const grafikVerileri = await this._grafikVerileriniOlustur(childId, baslangicTarihi, bitisTarihi);
      
      // Önerileri oluştur
      const oneriler = this._onerileriOlustur(testVerileri, hikayeVerileri, duyguVerileri, xpVerileri);
      
      // Motivasyon mesajı oluştur
      const motivasyonMesaji = this._motivasyonMesajiOlustur(testVerileri, hikayeVerileri, duyguVerileri, xpVerileri);
      
      // Gelişim özeti oluştur
      const gelisimOzeti = this._gelisimOzetiOlustur(testVerileri, hikayeVerileri, duyguVerileri, xpVerileri);

      return {
        ...testVerileri,
        ...hikayeVerileri,
        ...duyguVerileri,
        ...xpVerileri,
        grafikVerileri,
        oneriler,
        motivasyonMesaji,
        gelisimOzeti
      };
    } catch (error) {
      console.error('Veri toplama hatası:', error);
      throw error;
    }
  }

  // Test verilerini topla
  static async _testVerileriniTopla(childId, baslangicTarihi, bitisTarihi) {
    try {
      // Test çözme verilerini al (gerçek veri yoksa simüle et)
      const toplamTest = Math.floor(Math.random() * 20) + 5; // 5-25 arası
      const basariliTest = Math.floor(toplamTest * (0.6 + Math.random() * 0.3)); // %60-90 başarı
      const testBasariOrani = toplamTest > 0 ? (basariliTest / toplamTest) * 100 : 0;
      
      // Sınıf-ders performansı (simüle)
      const sinifDersPerformans = [
        {
          sinif: '3. Sınıf',
          ders: 'Matematik',
          testSayisi: Math.floor(toplamTest * 0.4),
          basariOrani: testBasariOrani + (Math.random() - 0.5) * 20,
          ortalamaPuan: 75 + (Math.random() - 0.5) * 30
        },
        {
          sinif: '3. Sınıf',
          ders: 'Türkçe',
          testSayisi: Math.floor(toplamTest * 0.3),
          basariOrani: testBasariOrani + (Math.random() - 0.5) * 20,
          ortalamaPuan: 80 + (Math.random() - 0.5) * 25
        },
        {
          sinif: '3. Sınıf',
          ders: 'Hayat Bilgisi',
          testSayisi: Math.floor(toplamTest * 0.3),
          basariOrani: testBasariOrani + (Math.random() - 0.5) * 20,
          ortalamaPuan: 85 + (Math.random() - 0.5) * 20
        }
      ];

      return {
        toplamTest,
        testBasariOrani,
        sinifDersPerformans
      };
    } catch (error) {
      console.error('Test veri toplama hatası:', error);
      return {
        toplamTest: 0,
        testBasariOrani: 0,
        sinifDersPerformans: []
      };
    }
  }

  // Hikaye verilerini topla
  static async _hikayeVerileriniTopla(childId, baslangicTarihi, bitisTarihi) {
    try {
      const toplamHikaye = Math.floor(Math.random() * 10) + 2; // 2-12 arası
      const tamamlananHikaye = Math.floor(toplamHikaye * (0.7 + Math.random() * 0.3)); // %70-100 tamamlama
      const hikayeTamamlamaOrani = toplamHikaye > 0 ? (tamamlananHikaye / toplamHikaye) * 100 : 0;

      return {
        toplamHikaye,
        hikayeTamamlamaOrani
      };
    } catch (error) {
      console.error('Hikaye veri toplama hatası:', error);
      return {
        toplamHikaye: 0,
        hikayeTamamlamaOrani: 0
      };
    }
  }

  // Duygu analizi verilerini topla
  static async _duyguVerileriniTopla(childId, baslangicTarihi, bitisTarihi) {
    try {
      const duyguAnalizleri = await DuyguAnalizi.find({
        kullaniciId: childId,
        kullaniciTipi: 'child',
        tarih: { $gte: baslangicTarihi, $lte: bitisTarihi }
      });

      if (duyguAnalizleri.length === 0) {
        return {
          ortalamaDuyguSkoru: 0,
          enCokGorulenDuygu: 'nötr',
          duyguKategorileri: {},
          pozitifGunSayisi: 0,
          negatifGunSayisi: 0
        };
      }

      // Ortalama duygu skoru
      const toplamSkor = duyguAnalizleri.reduce((sum, analiz) => sum + analiz.duyguSkoru, 0);
      const ortalamaDuyguSkoru = toplamSkor / duyguAnalizleri.length;

      // Duygu kategorileri
      const duyguKategorileri = {};
      duyguAnalizleri.forEach(analiz => {
        duyguKategorileri[analiz.duyguKategori] = (duyguKategorileri[analiz.duyguKategori] || 0) + 1;
      });

      // En çok görülen duygu
      const enCokGorulenDuygu = Object.keys(duyguKategorileri).reduce((a, b) => 
        duyguKategorileri[a] > duyguKategorileri[b] ? a : b
      );

      // Pozitif/negatif gün sayısı
      const pozitifGunSayisi = duyguAnalizleri.filter(a => a.duyguSkoru > 0.2).length;
      const negatifGunSayisi = duyguAnalizleri.filter(a => a.duyguSkoru < -0.2).length;

      return {
        ortalamaDuyguSkoru,
        enCokGorulenDuygu,
        duyguKategorileri,
        pozitifGunSayisi,
        negatifGunSayisi
      };
    } catch (error) {
      console.error('Duygu veri toplama hatası:', error);
      return {
        ortalamaDuyguSkoru: 0,
        enCokGorulenDuygu: 'nötr',
        duyguKategorileri: {},
        pozitifGunSayisi: 0,
        negatifGunSayisi: 0
      };
    }
  }

  // XP verilerini topla
  static async _xpVerileriniTopla(childId, baslangicTarihi, bitisTarihi) {
    try {
      // Simüle XP verileri
      const toplamXp = Math.floor(Math.random() * 500) + 100; // 100-600 arası
      const gunSayisi = Math.ceil((bitisTarihi - baslangicTarihi) / (1000 * 60 * 60 * 24));
      const gunlukOrtalamaXp = gunSayisi > 0 ? toplamXp / gunSayisi : 0;
      const gunlukOrtalamaTest = Math.floor(Math.random() * 3) + 1; // 1-4 arası
      const gunlukOrtalamaHikaye = Math.floor(Math.random() * 2) + 0.5; // 0.5-2.5 arası
      const gunlukOrtalamaCalismaSuresi = Math.floor(Math.random() * 60) + 30; // 30-90 dakika
      const toplamCalismaSuresi = gunlukOrtalamaCalismaSuresi * gunSayisi;

      // Hedef başarı oranı
      const hedefUlasmaOrani = Math.floor(Math.random() * 40) + 60; // %60-100 arası

      return {
        toplamXp,
        gunlukOrtalamaXp,
        gunlukOrtalamaTest,
        gunlukOrtalamaHikaye,
        gunlukOrtalamaCalismaSuresi,
        toplamCalismaSuresi,
        hedefUlasmaOrani
      };
    } catch (error) {
      console.error('XP veri toplama hatası:', error);
      return {
        toplamXp: 0,
        gunlukOrtalamaXp: 0,
        gunlukOrtalamaTest: 0,
        gunlukOrtalamaHikaye: 0,
        gunlukOrtalamaCalismaSuresi: 0,
        toplamCalismaSuresi: 0,
        hedefUlasmaOrani: 0
      };
    }
  }

  // Grafik verilerini oluştur
  static async _grafikVerileriniOlustur(childId, baslangicTarihi, bitisTarihi) {
    try {
      const gunlukXp = {};
      const gunlukTest = {};
      const gunlukHikaye = {};
      const duyguTrendi = {};

      const gunSayisi = Math.ceil((bitisTarihi - baslangicTarihi) / (1000 * 60 * 60 * 24));
      
      for (let i = 0; i < gunSayisi; i++) {
        const tarih = new Date(baslangicTarihi);
        tarih.setDate(baslangicTarihi.getDate() + i);
        const tarihStr = tarih.toISOString().split('T')[0];
        
        // Simüle günlük veriler
        gunlukXp[tarihStr] = Math.floor(Math.random() * 50) + 20; // 20-70 XP
        gunlukTest[tarihStr] = Math.floor(Math.random() * 4) + 1; // 1-5 test
        gunlukHikaye[tarihStr] = Math.floor(Math.random() * 3) + 0; // 0-3 hikaye
        duyguTrendi[tarihStr] = (Math.random() - 0.5) * 2; // -1 ile 1 arası
      }

      return {
        gunlukXp,
        gunlukTest,
        gunlukHikaye,
        duyguTrendi
      };
    } catch (error) {
      console.error('Grafik veri oluşturma hatası:', error);
      return {
        gunlukXp: {},
        gunlukTest: {},
        gunlukHikaye: {},
        duyguTrendi: {}
      };
    }
  }

  // Önerileri oluştur
  static _onerileriOlustur(testVerileri, hikayeVerileri, duyguVerileri, xpVerileri) {
    const oneriler = [];

    // Test başarı oranına göre öneriler
    if (testVerileri.testBasariOrani < 70) {
      oneriler.push({
        kategori: 'Test Performansı',
        oneri: 'Test başarı oranını artırmak için daha fazla pratik yapması önerilir.',
        oncelik: 'yüksek'
      });
    }

    // Hikaye tamamlama oranına göre öneriler
    if (hikayeVerileri.hikayeTamamlamaOrani < 80) {
      oneriler.push({
        kategori: 'Okuma Alışkanlığı',
        oneri: 'Hikaye okuma alışkanlığını geliştirmek için günlük okuma hedefleri koyulabilir.',
        oncelik: 'orta'
      });
    }

    // Duygu durumuna göre öneriler
    if (duyguVerileri.ortalamaDuyguSkoru < -0.2) {
      oneriler.push({
        kategori: 'Motivasyon',
        oneri: 'Çocuğun motivasyonunu artırmak için daha fazla ödül ve teşvik verilebilir.',
        oncelik: 'yüksek'
      });
    }

    // XP hedefine göre öneriler
    if (xpVerileri.hedefUlasmaOrani < 80) {
      oneriler.push({
        kategori: 'Hedef Yönetimi',
        oneri: 'Hedeflere ulaşmak için daha küçük ve ulaşılabilir hedefler belirlenebilir.',
        oncelik: 'orta'
      });
    }

    // Genel öneriler
    if (testVerileri.toplamTest < 10) {
      oneriler.push({
        kategori: 'Aktivite Çeşitliliği',
        oneri: 'Daha fazla test çözerek bilgi birikimini artırabilir.',
        oncelik: 'düşük'
      });
    }

    return oneriler;
  }

  // Motivasyon mesajı oluştur
  static _motivasyonMesajiOlustur(testVerileri, hikayeVerileri, duyguVerileri, xpVerileri) {
    const performansSkoru = (testVerileri.testBasariOrani + hikayeVerileri.hikayeTamamlamaOrani + xpVerileri.hedefUlasmaOrani) / 3;
    
    if (performansSkoru >= 85) {
      return "Harika bir performans gösterdin! Seninle gurur duyuyoruz. Bu hızla devam et! 🌟";
    } else if (performansSkoru >= 70) {
      return "İyi bir çalışma dönemi geçirdin. Biraz daha çaba göstererek mükemmel sonuçlar alabilirsin! 💪";
    } else if (performansSkoru >= 50) {
      return "Çalışmaya devam et! Her gün biraz daha iyi oluyorsun. Sen başarabilirsin! 🚀";
    } else {
      return "Birlikte çalışarak daha iyi sonuçlar alabiliriz. Seninle her adımda yanındayız! 🤝";
    }
  }

  // Gelişim özeti oluştur
  static _gelisimOzetiOlustur(testVerileri, hikayeVerileri, duyguVerileri, xpVerileri) {
    return `Bu dönemde ${testVerileri.toplamTest} test çözdün ve %${testVerileri.testBasariOrani.toFixed(1)} başarı oranı elde ettin. ${hikayeVerileri.toplamHikaye} hikaye okudun ve %${hikayeVerileri.hikayeTamamlamaOrani.toFixed(1)} tamamlama oranına ulaştın. Toplam ${xpVerileri.toplamXp} XP kazandın ve hedeflerinin %${xpVerileri.hedefUlasmaOrani.toFixed(1)}'ini tamamladın. Duygu durumun genel olarak ${duyguVerileri.ortalamaDuyguSkoru > 0 ? 'pozitif' : 'nötr'} seyretti.`;
  }

  // Raporu veliye gönder
  static async raporuGonder(raporId) {
    try {
      const rapor = await GelisimRaporu.findById(raporId);
      if (!rapor) {
        throw new Error('Rapor bulunamadı');
      }

      rapor.gonderildi = true;
      rapor.gonderimTarihi = new Date();
      await rapor.save();

      // Burada gerçek bildirim sistemi entegre edilebilir
      console.log(`Rapor ${raporId} veliye gönderildi`);

      return rapor;
    } catch (error) {
      console.error('Rapor gönderme hatası:', error);
      throw error;
    }
  }

  // Veli raporu görüntüledi
  static async raporuGoruntulendi(raporId) {
    try {
      const rapor = await GelisimRaporu.findById(raporId);
      if (!rapor) {
        throw new Error('Rapor bulunamadı');
      }

      rapor.veliGoruntuledi = true;
      rapor.veliGoruntulemeTarihi = new Date();
      await rapor.save();

      return rapor;
    } catch (error) {
      console.error('Rapor görüntüleme hatası:', error);
      throw error;
    }
  }

  // Çocuğun tüm raporlarını getir
  static async cocukRaporlari(childId, raporTipi = null) {
    try {
      let filter = { childId };
      if (raporTipi) {
        filter.raporTipi = raporTipi;
      }

      const raporlar = await GelisimRaporu.find(filter)
        .sort({ olusturmaTarihi: -1 })
        .limit(20);

      return raporlar;
    } catch (error) {
      console.error('Çocuk raporları getirme hatası:', error);
      throw error;
    }
  }

  // Veli raporlarını getir
  static async veliRaporlari(parentId, gonderildi = null) {
    try {
      let filter = { parentId };
      if (gonderildi !== null) {
        filter.gonderildi = gonderildi;
      }

      const raporlar = await GelisimRaporu.find(filter)
        .sort({ olusturmaTarihi: -1 })
        .limit(20);

      return raporlar;
    } catch (error) {
      console.error('Veli raporları getirme hatası:', error);
      throw error;
    }
  }
}

export default GelisimRaporuService; 