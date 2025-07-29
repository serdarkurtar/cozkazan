import DuyguAnalizi from '../models/DuyguAnalizi.js';

class DuyguAnaliziService {
  // Türkçe duygu kelimeleri sözlüğü
  static duyguKelimeleri = {
    pozitif: [
      'mutlu', 'sevinçli', 'heyecanlı', 'gururlu', 'başarılı', 'güvenli', 'huzurlu',
      'neşeli', 'coşkulu', 'enerjik', 'motivasyonlu', 'umutlu', 'içten', 'samimi',
      'harika', 'mükemmel', 'süper', 'fantastik', 'inanılmaz', 'muhteşem'
    ],
    negatif: [
      'üzgün', 'kızgın', 'endişeli', 'korkmuş', 'stresli', 'yorgun', 'bıkmış',
      'sıkılmış', 'kaygılı', 'panik', 'sinirli', 'öfkeli', 'hayal kırıklığı',
      'kötü', 'berbat', 'korkunç', 'dehşet', 'felaket', 'kabus'
    ],
    nötr: [
      'normal', 'sakin', 'dengeli', 'kararlı', 'sessiz', 'düşünceli', 'dikkatli'
    ]
  };

  // Tonlama kelimeleri
  static tonlamaKelimeleri = {
    resmiyet: {
      samimi: ['arkadaş', 'dost', 'sen', 'birlikte', 'beraber', 'hey', 'bak'],
      resmi: ['sayın', 'efendim', 'lütfen', 'rica ederim', 'memnuniyetle', 'önemli']
    },
    enerji: {
      düşük: ['yavaş', 'sakin', 'sessiz', 'durgun', 'sakinleş', 'dinlen'],
      yüksek: ['hızlı', 'enerjik', 'coşkulu', 'heyecanlı', 'hareketli', 'aktif']
    },
    aciliyet: {
      normal: ['zamanla', 'yavaşça', 'sakin', 'düşün', 'planla'],
      acil: ['hemen', 'şimdi', 'acil', 'hızlı', 'derhal', 'vakit kaybetme']
    }
  };

  // Mesajın duygusal tonunu analiz et
  static async analizEt(mesaj, kullaniciId, kullaniciTipi, dil = 'tr') {
    try {
      const duyguSkoru = await this._duyguSkoruHesapla(mesaj, dil);
      const anaDuygular = await this._anaDuygulariTespitEt(mesaj, dil);
      const tonAnalizi = await this._tonAnaliziYap(mesaj, dil);
      const yanitToni = await this._yanitTonuBelirle(duyguSkoru, tonAnalizi, kullaniciTipi);

      const duyguAnalizi = new DuyguAnalizi({
        kullaniciId,
        kullaniciTipi,
        mesaj,
        duyguSkoru,
        anaDuygular,
        tonAnalizi,
        dil,
        yanitToni
      });

      await duyguAnalizi.save();
      return duyguAnalizi;
    } catch (error) {
      console.error('Duygu analizi hatası:', error);
      throw error;
    }
  }

  // Duygu skorunu hesapla (-1 ile 1 arası)
  static async _duyguSkoruHesapla(mesaj, dil) {
    const lowerMesaj = mesaj.toLowerCase();
    let pozitifPuan = 0;
    let negatifPuan = 0;
    let toplamKelime = 0;

    // Pozitif kelimeleri say
    for (const kelime of this.duyguKelimeleri.pozitif) {
      const regex = new RegExp(`\\b${kelime}\\b`, 'gi');
      const eslesme = lowerMesaj.match(regex);
      if (eslesme) {
        pozitifPuan += eslesme.length;
      }
    }

    // Negatif kelimeleri say
    for (const kelime of this.duyguKelimeleri.negatif) {
      const regex = new RegExp(`\\b${kelime}\\b`, 'gi');
      const eslesme = lowerMesaj.match(regex);
      if (eslesme) {
        negatifPuan += eslesme.length;
      }
    }

    // Emoji analizi
    const pozitifEmojiler = ['😊', '😄', '😃', '😁', '😆', '😍', '🥰', '😘', '🤗', '👍', '👏', '🎉', '🎊', '✨', '🌟', '💪', '🔥', '💯', '❤️', '💖', '💕', '💗', '💓', '💝', '💞', '💟', '💌', '💋', '💍', '💎', '💐', '🌸', '🌺', '🌻', '🌼', '🌷', '🌹', '🌱', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🌍', '🌎', '🌏', '🌐', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌙', '🌚', '🌛', '🌜', '☀️', '🌝', '🌞', '⭐', '🌟', '🌠', '☁️', '⛅', '🌤️', '🌥️', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '☃️', '⛄', '🌬️', '💨', '🌪️', '🌫️', '🌊', '💧', '💦', '☔', '☂️', '🌈', '☀️', '🌤️', '🌥️', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '☃️', '⛄', '🌬️', '💨', '🌪️', '🌫️', '🌊', '💧', '💦', '☔', '☂️', '🌈'];
    const negatifEmojiler = ['😢', '😭', '😤', '😠', '😡', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🙈', '🙉', '🙊', '💌', '💘', '💔', '💕', '💖', '💗', '💙', '💚', '💛', '🧡', '💜', '🖤', '💝', '💞', '💟', '❣️', '💔', '❤️‍🔥', '❤️‍🩹', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'];

    for (const emoji of pozitifEmojiler) {
      const eslesme = mesaj.match(new RegExp(emoji, 'g'));
      if (eslesme) {
        pozitifPuan += eslesme.length * 0.5;
      }
    }

    for (const emoji of negatifEmojiler) {
      const eslesme = mesaj.match(new RegExp(emoji, 'g'));
      if (eslesme) {
        negatifPuan += eslesme.length * 0.5;
      }
    }

    // Büyük harf analizi (enerji göstergesi)
    const buyukHarfSayisi = (mesaj.match(/[A-ZĞÜŞİÖÇ]/g) || []).length;
    if (buyukHarfSayisi > mesaj.length * 0.3) {
      pozitifPuan += 0.3; // Enerji yüksek
    }

    // Ünlem işareti analizi
    const unlemSayisi = (mesaj.match(/!/g) || []).length;
    pozitifPuan += unlemSayisi * 0.2;

    // Soru işareti analizi
    const soruSayisi = (mesaj.match(/\?/g) || []).length;
    if (soruSayisi > 0) {
      pozitifPuan += 0.1; // İlgi göstergesi
    }

    // Toplam puan hesaplama
    const toplamPuan = pozitifPuan + negatifPuan;
    if (toplamPuan === 0) {
      return 0; // Nötr
    }

    const skor = (pozitifPuan - negatifPuan) / toplamPuan;
    return Math.max(-1, Math.min(1, skor)); // -1 ile 1 arasında sınırla
  }

  // Ana duyguları tespit et
  static async _anaDuygulariTespitEt(mesaj, dil) {
    const lowerMesaj = mesaj.toLowerCase();
    const duygular = [];

    // Temel duygu kategorileri
    const duyguKategorileri = {
      'mutlu': ['mutlu', 'sevinçli', 'neşeli', 'gülümseme', 'gülmek', 'eğlenceli', 'harika', 'süper'],
      'üzgün': ['üzgün', 'kederli', 'mutsuz', 'ağlamak', 'hüzün', 'keder', 'acı', 'yas'],
      'kızgın': ['kızgın', 'öfkeli', 'sinirli', 'kızmak', 'öfke', 'sinir', 'kudurmak', 'çıldırmak'],
      'endişeli': ['endişeli', 'kaygılı', 'stresli', 'panik', 'korku', 'endişe', 'kaygı', 'stres'],
      'heyecanlı': ['heyecanlı', 'coşkulu', 'enerjik', 'heyecan', 'coşku', 'enerji', 'canlı', 'dinamik'],
      'yorgun': ['yorgun', 'bitkin', 'tükenmiş', 'yorulmak', 'bitmek', 'tükenmek', 'halsiz'],
      'sakin': ['sakin', 'huzurlu', 'dingin', 'sessiz', 'huzur', 'dinginlik', 'sükunet'],
      'şaşkın': ['şaşkın', 'hayret', 'şaşırmak', 'inanılmaz', 'inanmak', 'hayret etmek']
    };

    for (const [duygu, kelimeler] of Object.entries(duyguKategorileri)) {
      for (const kelime of kelimeler) {
        if (lowerMesaj.includes(kelime)) {
          if (!duygular.includes(duygu)) {
            duygular.push(duygu);
          }
          break;
        }
      }
    }

    return duygular.length > 0 ? duygular : ['nötr'];
  }

  // Ton analizi yap
  static async _tonAnaliziYap(mesaj, dil) {
    const lowerMesaj = mesaj.toLowerCase();
    
    // Resmiyet analizi
    let resmiyetSkoru = 0.5; // Varsayılan orta
    for (const kelime of this.tonlamaKelimeleri.resmiyet.samimi) {
      if (lowerMesaj.includes(kelime)) {
        resmiyetSkoru -= 0.2;
      }
    }
    for (const kelime of this.tonlamaKelimeleri.resmiyet.resmi) {
      if (lowerMesaj.includes(kelime)) {
        resmiyetSkoru += 0.2;
      }
    }

    // Enerji analizi
    let enerjiSkoru = 0.5; // Varsayılan orta
    for (const kelime of this.tonlamaKelimeleri.enerji.düşük) {
      if (lowerMesaj.includes(kelime)) {
        enerjiSkoru -= 0.2;
      }
    }
    for (const kelime of this.tonlamaKelimeleri.enerji.yüksek) {
      if (lowerMesaj.includes(kelime)) {
        enerjiSkoru += 0.2;
      }
    }

    // Aciliyet analizi
    let aciliyetSkoru = 0.3; // Varsayılan düşük
    for (const kelime of this.tonlamaKelimeleri.aciliyet.acil) {
      if (lowerMesaj.includes(kelime)) {
        aciliyetSkoru += 0.3;
      }
    }

    // Büyük harf ve ünlem işareti analizi
    const buyukHarfOrani = (mesaj.match(/[A-ZĞÜŞİÖÇ]/g) || []).length / mesaj.length;
    const unlemSayisi = (mesaj.match(/!/g) || []).length;
    
    if (buyukHarfOrani > 0.3) {
      enerjiSkoru += 0.2;
      aciliyetSkoru += 0.1;
    }
    
    if (unlemSayisi > 0) {
      enerjiSkoru += unlemSayisi * 0.1;
      aciliyetSkoru += unlemSayisi * 0.05;
    }

    return {
      resmiyet: Math.max(0, Math.min(1, resmiyetSkoru)),
      enerji: Math.max(0, Math.min(1, enerjiSkoru)),
      aciliyet: Math.max(0, Math.min(1, aciliyetSkoru))
    };
  }

  // Yanıt tonunu belirle
  static async _yanitTonuBelirle(duyguSkoru, tonAnalizi, kullaniciTipi) {
    // Çocuklar için daha samimi ve motivasyonel
    if (kullaniciTipi === 'child') {
      if (duyguSkoru < -0.3) {
        return 'destekleyici'; // Üzgün/kızgın çocuk için destek
      } else if (duyguSkoru < 0.2) {
        return 'motivasyonel'; // Nötr çocuk için motivasyon
      } else {
        return 'samimi'; // Mutlu çocuk için samimi
      }
    }
    
    // Veliler için daha profesyonel
    if (kullaniciTipi === 'parent') {
      if (tonAnalizi.aciliyet > 0.6) {
        return 'profesyonel'; // Acil durumlar için profesyonel
      } else if (duyguSkoru < -0.2) {
        return 'destekleyici'; // Stresli veli için destek
      } else {
        return 'eğitici'; // Normal durumlar için eğitici
      }
    }

    return 'samimi'; // Varsayılan
  }

  // Yanıtı duygu analizine göre ayarla
  static async yanitiAyarla(yanit, duyguAnalizi) {
    if (!duyguAnalizi) return yanit;

    let ayarlanmisYanit = yanit;

    // Duygu skoruna göre emoji ekle
    if (duyguAnalizi.duyguSkoru > 0.5) {
      ayarlanmisYanit = `😊 ${ayarlanmisYanit}`;
    } else if (duyguAnalizi.duyguSkoru < -0.5) {
      ayarlanmisYanit = `🤗 ${ayarlanmisYanit}`;
    }

    // Ton analizine göre cümle yapısını ayarla
    if (duyguAnalizi.tonAnalizi.enerji > 0.7) {
      // Yüksek enerji için daha coşkulu
      ayarlanmisYanit = ayarlanmisYanit.replace(/\./g, '!');
    } else if (duyguAnalizi.tonAnalizi.enerji < 0.3) {
      // Düşük enerji için daha sakin
      ayarlanmisYanit = ayarlanmisYanit.replace(/!/g, '.');
    }

    // Resmiyet seviyesine göre hitap şeklini ayarla
    if (duyguAnalizi.tonAnalizi.resmiyet > 0.7) {
      // Resmi ton için daha formal
      ayarlanmisYanit = ayarlanmisYanit.replace(/sen/g, 'siz');
      ayarlanmisYanit = ayarlanmisYanit.replace(/Sen/g, 'Siz');
    }

    // Aciliyet seviyesine göre hız belirteci ekle
    if (duyguAnalizi.tonAnalizi.aciliyet > 0.7) {
      ayarlanmisYanit = `Hemen: ${ayarlanmisYanit}`;
    }

    return ayarlanmisYanit;
  }

  // Kullanıcının duygu geçmişini getir
  static async kullaniciDuyguGecmisi(kullaniciId, kullaniciTipi, gunSayisi = 7) {
    try {
      const baslangicTarihi = new Date();
      baslangicTarihi.setDate(baslangicTarihi.getDate() - gunSayisi);

      const gecmis = await DuyguAnalizi.find({
        kullaniciId,
        kullaniciTipi,
        tarih: { $gte: baslangicTarihi }
      }).sort({ tarih: -1 });

      return gecmis;
    } catch (error) {
      console.error('Duygu geçmişi getirme hatası:', error);
      return [];
    }
  }

  // Duygu istatistiklerini getir
  static async duyguIstatistikleri(kullaniciId, kullaniciTipi, gunSayisi = 30) {
    try {
      const baslangicTarihi = new Date();
      baslangicTarihi.setDate(baslangicTarihi.getDate() - gunSayisi);

      const analizler = await DuyguAnalizi.find({
        kullaniciId,
        kullaniciTipi,
        tarih: { $gte: baslangicTarihi }
      });

      const istatistikler = {
        toplamMesaj: analizler.length,
        ortalamaDuyguSkoru: 0,
        duyguKategorileri: {},
        enCokKullanilanDuygular: {},
        tonAnaliziOrtalamalari: {
          resmiyet: 0,
          enerji: 0,
          aciliyet: 0
        }
      };

      if (analizler.length > 0) {
        // Ortalama duygu skoru
        const toplamSkor = analizler.reduce((sum, analiz) => sum + analiz.duyguSkoru, 0);
        istatistikler.ortalamaDuyguSkoru = toplamSkor / analizler.length;

        // Duygu kategorileri
        analizler.forEach(analiz => {
          istatistikler.duyguKategorileri[analiz.duyguKategori] = 
            (istatistikler.duyguKategorileri[analiz.duyguKategori] || 0) + 1;
        });

        // En çok kullanılan duygular
        analizler.forEach(analiz => {
          analiz.anaDuygular.forEach(duygu => {
            istatistikler.enCokKullanilanDuygular[duygu] = 
              (istatistikler.enCokKullanilanDuygular[duygu] || 0) + 1;
          });
        });

        // Ton analizi ortalamaları
        const toplamResmiyet = analizler.reduce((sum, analiz) => sum + analiz.tonAnalizi.resmiyet, 0);
        const toplamEnerji = analizler.reduce((sum, analiz) => sum + analiz.tonAnalizi.enerji, 0);
        const toplamAciliyet = analizler.reduce((sum, analiz) => sum + analiz.tonAnalizi.aciliyet, 0);

        istatistikler.tonAnaliziOrtalamalari = {
          resmiyet: toplamResmiyet / analizler.length,
          enerji: toplamEnerji / analizler.length,
          aciliyet: toplamAciliyet / analizler.length
        };
      }

      return istatistikler;
    } catch (error) {
      console.error('Duygu istatistikleri hatası:', error);
      return null;
    }
  }
}

export default DuyguAnaliziService; 