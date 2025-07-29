import GercekZamanliSohbet from '../models/GercekZamanliSohbet.js';
import DuyguAnalizi from '../models/DuyguAnalizi.js';
import GelisimRaporu from '../models/GelisimRaporu.js';
import User from '../models/User.js';
import { v4 as uuidv4 } from 'uuid';

class GercekZamanliSohbetService {
  // Yeni sohbet oturumu başlat
  static async sohbetOturumuBaslat(kullaniciId, kullaniciTipi) {
    try {
      // Mevcut aktif oturum var mı kontrol et
      const mevcutOturum = await GercekZamanliSohbet.findOne({
        kullaniciId,
        kullaniciTipi,
        'oturumDurumu.aktif': true
      });

      if (mevcutOturum) {
        return mevcutOturum;
      }

      // Kullanıcı profilini al
      const kullanici = await User.findOne({ _id: kullaniciId });
      if (!kullanici) {
        throw new Error('Kullanıcı bulunamadı');
      }

      // Yeni oturum oluştur
      const yeniOturum = new GercekZamanliSohbet({
        kullaniciId,
        kullaniciTipi,
        sohbetOturumu: uuidv4(),
        kullaniciProfili: {
          yas: kullanici.age,
          sinif: kullanici.grade,
          ogrenmeStili: this._ogrenmeStiliBelirle(kullanici.age),
          ilgiAlanlari: this._varsayilanIlgiAlanlari(kullanici.age),
          zorlukAlanlari: [],
          hedefler: [],
          duygusalDurum: 'nötr'
        }
      });

      await yeniOturum.save();
      return yeniOturum;
    } catch (error) {
      console.error('Sohbet oturumu başlatma hatası:', error);
      throw error;
    }
  }

  // Mesaj gönder ve yanıt al
  static async mesajGonder(sohbetOturumu, mesaj, gonderen = 'user') {
    try {
      const oturum = await GercekZamanliSohbet.findOne({ sohbetOturumu });
      if (!oturum) {
        throw new Error('Sohbet oturumu bulunamadı');
      }

      // Duygu analizi yap
      const duyguSkoru = await this._duyguAnaliziYap(mesaj);
      const konuKategorisi = this._konuKategorisiBelirle(mesaj);

      // Kullanıcı mesajını kaydet
      const kullaniciMesaji = {
        gonderen: 'user',
        mesaj,
        zaman: new Date(),
        mesajTipi: 'text',
        metadata: {
          duyguSkoru,
          konuKategorisi,
          oncelik: this._oncelikBelirle(duyguSkoru, konuKategorisi)
        }
      };

      oturum.mesajlar.push(kullaniciMesaji);
      oturum.oturumDurumu.sonAktiviteZamani = new Date();
      oturum.oturumDurumu.toplamMesaj++;
      oturum.oturumDurumu.ortalamaDuyguSkoru = this._ortalamaDuyguSkoruHesapla(oturum.mesajlar);

      // Asistan yanıtını oluştur
      const asistanYaniti = await this._asistanYanitiOlustur(oturum, mesaj, duyguSkoru, konuKategorisi);
      
      oturum.mesajlar.push(asistanYaniti);

      // Günlük görevler ve öneriler ekle
      if (asistanYaniti.metadata.gorevId) {
        await this._gunlukGorevEkle(oturum, asistanYaniti.metadata.gorevId);
      }

      if (asistanYaniti.metadata.oneriId) {
        await this._oneriEkle(oturum, asistanYaniti.metadata.oneriId);
      }

      await oturum.save();
      return oturum;
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
      throw error;
    }
  }

  // Asistan yanıtı oluştur
  static async _asistanYanitiOlustur(oturum, kullaniciMesaji, duyguSkoru, konuKategorisi) {
    const kullaniciTipi = oturum.kullaniciTipi;
    const yas = oturum.kullaniciProfili.yas;
    const sinif = oturum.kullaniciProfili.sinif;

    let yanit = '';
    let mesajTipi = 'text';
    let gorevId = null;
    let oneriId = null;

    // Kullanıcı tipine göre yanıt oluştur
    if (kullaniciTipi === 'child') {
      const cocukYaniti = await this._cocukYanitiOlustur(oturum, kullaniciMesaji, duyguSkoru, konuKategorisi);
      yanit = cocukYaniti.yanit;
      mesajTipi = cocukYaniti.mesajTipi;
      gorevId = cocukYaniti.gorevId;
      oneriId = cocukYaniti.oneriId;
    } else {
      const veliYaniti = await this._veliYanitiOlustur(oturum, kullaniciMesaji, duyguSkoru, konuKategorisi);
      yanit = veliYaniti.yanit;
      mesajTipi = veliYaniti.mesajTipi;
      gorevId = veliYaniti.gorevId;
      oneriId = veliYaniti.oneriId;
    }

    return {
      gonderen: 'assistant',
      mesaj: yanit,
      zaman: new Date(),
      mesajTipi,
      metadata: {
        duyguSkoru: -duyguSkoru, // Asistan yanıtı kullanıcının duygusunu dengelemeli
        konuKategorisi,
        oncelik: 'orta',
        gorevId,
        oneriId
      }
    };
  }

  // Çocuk yanıtı oluştur
  static async _cocukYanitiOlustur(oturum, mesaj, duyguSkoru, konuKategorisi) {
    const yas = oturum.kullaniciProfili.yas;
    const sinif = oturum.kullaniciProfili.sinif;
    const ogrenmeStili = oturum.kullaniciProfili.ogrenmeStili;

    let yanit = '';
    let mesajTipi = 'text';
    let gorevId = null;
    let oneriId = null;

    // Duygu durumuna göre yanıt
    if (duyguSkoru < -0.3) {
      yanit = this._motivasyonMesajiOlustur(yas, 'negatif');
      mesajTipi = 'motivation';
    } else if (duyguSkoru > 0.3) {
      yanit = this._basarimMesajiOlustur(yas);
      mesajTipi = 'motivation';
    } else {
      // Konu kategorisine göre yanıt
      switch (konuKategorisi) {
        case 'development':
          const gelisimYaniti = this._gelisimYanitiOlustur(yas, sinif, ogrenmeStili);
          yanit = gelisimYaniti.yanit;
          gorevId = gelisimYaniti.gorevId;
          break;
        case 'behavior':
          yanit = this._davranisYanitiOlustur(yas, mesaj);
          break;
        case 'motivation':
          yanit = this._motivasyonYanitiOlustur(yas, mesaj);
          break;
        case 'health':
          yanit = this._saglikYanitiOlustur(yas, mesaj);
          break;
        case 'academic':
          const akademikYaniti = this._akademikYanitiOlustur(yas, sinif, ogrenmeStili);
          yanit = akademikYaniti.yanit;
          gorevId = akademikYaniti.gorevId;
          break;
        case 'social':
          yanit = this._sosyalYanitiOlustur(yas, mesaj);
          break;
        default:
          yanit = this._genelYanitOlustur(yas, mesaj);
      }
    }

    return { yanit, mesajTipi, gorevId, oneriId };
  }

  // Veli yanıtı oluştur
  static async _veliYanitiOlustur(oturum, mesaj, duyguSkoru, konuKategorisi) {
    let yanit = '';
    let mesajTipi = 'text';
    let gorevId = null;
    let oneriId = null;

    // Veli mesajlarına göre yanıt
    switch (konuKategorisi) {
      case 'development':
        const gelisimOnerisi = this._veliGelisimOnerisiOlustur(oturum);
        yanit = gelisimOnerisi.yanit;
        oneriId = gelisimOnerisi.oneriId;
        break;
      case 'behavior':
        yanit = this._veliDavranisOnerisiOlustur(oturum, mesaj);
        break;
      case 'motivation':
        yanit = this._veliMotivasyonOnerisiOlustur(oturum, mesaj);
        break;
      case 'health':
        yanit = this._veliSaglikOnerisiOlustur(oturum, mesaj);
        break;
      default:
        yanit = this._veliGenelOnerisiOlustur(oturum, mesaj);
    }

    return { yanit, mesajTipi, gorevId, oneriId };
  }

  // Gelişim yanıtı oluştur
  static _gelisimYanitiOlustur(yas, sinif, ogrenmeStili) {
    const gorevler = this._yasGorevleri(yas, sinif);
    const secilenGorev = gorevler[Math.floor(Math.random() * gorevler.length)];
    
    const yanit = `Harika! Senin yaşında çocuklar için özel bir görev hazırladım: ${secilenGorev.baslik}

${secilenGorev.aciklama}

Bu görev senin ${ogrenmeStili} öğrenme stiline uygun olarak hazırlandı. Tamamladığında ${secilenGorev.puan} puan kazanacaksın! 🎯

Başlamak ister misin?`;

    return {
      yanit,
      gorevId: secilenGorev.id
    };
  }

  // Yaş görevleri
  static _yasGorevleri(yas, sinif) {
    const gorevler = {
      7: [
        {
          id: 'gorev_7_1',
          baslik: 'Duygu Günlüğü',
          aciklama: 'Bugün nasıl hissettiğini çizerek anlat. Mutlu, üzgün, heyecanlı mısın?',
          kategori: 'duygusal',
          zorlukSeviyesi: 'kolay',
          sure: 10,
          puan: 15
        },
        {
          id: 'gorev_7_2',
          baslik: 'Hayal Kurma Zamanı',
          aciklama: 'En sevdiğin hayalini resimle. Ne olmak istiyorsun?',
          kategori: 'yaratıcı',
          zorlukSeviyesi: 'kolay',
          sure: 15,
          puan: 20
        }
      ],
      8: [
        {
          id: 'gorev_8_1',
          baslik: 'Arkadaş Hikayesi',
          aciklama: 'En iyi arkadaşınla yaşadığın güzel bir anıyı yaz.',
          kategori: 'sosyal',
          zorlukSeviyesi: 'orta',
          sure: 20,
          puan: 25
        },
        {
          id: 'gorev_8_2',
          baslik: 'Bilim Keşfi',
          aciklama: 'Evde basit bir deney yap. Su ve yağ karışımını gözlemle.',
          kategori: 'akademik',
          zorlukSeviyesi: 'orta',
          sure: 30,
          puan: 30
        }
      ],
      9: [
        {
          id: 'gorev_9_1',
          baslik: 'Hedef Belirleme',
          aciklama: 'Bu hafta ulaşmak istediğin 3 hedefi yaz ve planla.',
          kategori: 'akademik',
          zorlukSeviyesi: 'orta',
          sure: 25,
          puan: 35
        },
        {
          id: 'gorev_9_2',
          baslik: 'Yaratıcı Proje',
          aciklama: 'Atık malzemelerle bir sanat eseri yarat.',
          kategori: 'yaratıcı',
          zorlukSeviyesi: 'orta',
          sure: 45,
          puan: 40
        }
      ],
      10: [
        {
          id: 'gorev_10_1',
          baslik: 'Liderlik Görevi',
          aciklama: 'Küçük kardeşine veya arkadaşına bir şey öğret.',
          kategori: 'sosyal',
          zorlukSeviyesi: 'zor',
          sure: 30,
          puan: 50
        },
        {
          id: 'gorev_10_2',
          baslik: 'Problem Çözme',
          aciklama: 'Günlük hayatta karşılaştığın bir problemi çöz.',
          kategori: 'akademik',
          zorlukSeviyesi: 'zor',
          sure: 40,
          puan: 45
        }
      ]
    };

    return gorevler[yas] || gorevler[9];
  }

  // Motivasyon mesajları
  static _motivasyonMesajiOlustur(yas, durum) {
    const mesajlar = {
      negatif: [
        "Her zorluk seni daha güçlü yapar! 🌟 Bugün zor bir gün geçirdiğini anlıyorum, ama yarın daha iyi olacak.",
        "Sen harika bir çocuksun! 💪 Bazen üzgün hissetmek normal, ama bu geçici. Seninle gurur duyuyorum.",
        "Her başarısızlık bir öğrenme fırsatıdır! 🎯 Sen başarabilirsin, sadece biraz zamana ihtiyacın var."
      ],
      pozitif: [
        "Harika bir iş çıkardın! 🎉 Seninle gurur duyuyorum!",
        "Bu kadar çaba göstermen muhteşem! 🌟 Sen gerçekten özel bir çocuksun!",
        "Başarıların beni çok mutlu ediyor! 💫 Sen harika bir iş yapıyorsun!"
      ]
    };

    const secilenMesajlar = mesajlar[durum];
    return secilenMesajlar[Math.floor(Math.random() * secilenMesajlar.length)];
  }

  // Başarım mesajı
  static _basarimMesajiOlustur(yas) {
    const mesajlar = [
      "Muhteşem bir iş çıkardın! 🌟 Seninle gurur duyuyorum!",
      "Bu başarın beni çok mutlu etti! 🎉 Harika bir iş yapıyorsun!",
      "Sen gerçekten özel bir çocuksun! 💫 Bu başarınla herkesi etkiledin!"
    ];

    return mesajlar[Math.floor(Math.random() * mesajlar.length)];
  }

  // Diğer yanıt metodları
  static _davranisYanitiOlustur(yas, mesaj) {
    return "Davranışların hakkında konuşmak istemen harika! 🤗 Seninle bu konuyu daha detaylı konuşabiliriz. Nasıl hissettiğini anlatır mısın?";
  }

  static _motivasyonYanitiOlustur(yas, mesaj) {
    return "Motivasyon konusu çok önemli! 💪 Senin motivasyonunu artırmak için neler yapabiliriz? Hangi konularda zorlanıyorsun?";
  }

  static _saglikYanitiOlustur(yas, mesaj) {
    return "Sağlığın her şeyden önemli! 🏃‍♂️ Bugün nasıl hissediyorsun? Yeterince su içtin mi? Hareket ettin mi?";
  }

  static _akademikYanitiOlustur(yas, sinif, ogrenmeStili) {
    const gorevler = this._akademikGorevler(yas, sinif, ogrenmeStili);
    const secilenGorev = gorevler[Math.floor(Math.random() * gorevler.length)];
    
    return {
      yanit: `Akademik gelişimin için özel bir görev: ${secilenGorev.baslik}

${secilenGorev.aciklama}

Bu görev senin ${ogrenmeStili} öğrenme stiline uygun!`,
      gorevId: secilenGorev.id
    };
  }

  static _sosyalYanitiOlustur(yas, mesaj) {
    return "Sosyal becerilerin gelişimi çok önemli! 👥 Arkadaşlarınla nasıl geçiniyorsun? Yeni arkadaşlar edinmek ister misin?";
  }

  static _genelYanitOlustur(yas, mesaj) {
    return "Seninle konuşmak çok güzel! 😊 Bana daha fazla şey anlat, seni dinliyorum. Bugün neler yaptın?";
  }

  // Veli önerileri
  static _veliGelisimOnerisiOlustur(oturum) {
    const oneriler = [
      {
        id: 'oneri_veli_1',
        baslik: 'Günlük Rutin Oluşturma',
        aciklama: 'Çocuğunuz için günlük bir rutin oluşturun. Bu, onun güven duygusunu artırır ve sorumluluk bilincini geliştirir.',
        kategori: 'development'
      },
      {
        id: 'oneri_veli_2',
        baslik: 'Pozitif Pekiştirme',
        aciklama: 'Çocuğunuzun olumlu davranışlarını övün ve takdir edin. Bu, motivasyonunu artırır.',
        kategori: 'motivation'
      }
    ];

    const secilenOneri = oneriler[Math.floor(Math.random() * oneriler.length)];
    
    return {
      yanit: `Çocuğunuzun gelişimi için önerim: ${secilenOneri.baslik}

${secilenOneri.aciklama}

Bu öneriyi uygulamak ister misiniz?`,
      oneriId: secilenOneri.id
    };
  }

  static _veliDavranisOnerisiOlustur(oturum, mesaj) {
    return "Çocuğunuzun davranışları hakkında endişelenmeniz normal. Size bu konuda yardımcı olabilirim. Hangi davranışı değiştirmek istiyorsunuz?";
  }

  static _veliMotivasyonOnerisiOlustur(oturum, mesaj) {
    return "Çocuğunuzun motivasyonunu artırmak için birkaç önerim var. Önce onun ilgi alanlarını keşfedelim. Nelerden hoşlanıyor?";
  }

  static _veliSaglikOnerisiOlustur(oturum, mesaj) {
    return "Çocuğunuzun sağlığı çok önemli. Düzenli beslenme, uyku ve egzersiz alışkanlıkları geliştirmek için size yardımcı olabilirim.";
  }

  static _veliGenelOnerisiOlustur(oturum, mesaj) {
    return "Çocuğunuzla ilgili her konuda size destek olmaya hazırım. Hangi konuda yardıma ihtiyacınız var?";
  }

  // Yardımcı metodlar
  static async _duyguAnaliziYap(mesaj) {
    // Basit duygu analizi (gerçek uygulamada daha gelişmiş bir sistem kullanılır)
    const pozitifKelimeler = ['mutlu', 'güzel', 'harika', 'sevindim', 'başardım', 'güzel', 'iyi'];
    const negatifKelimeler = ['üzgün', 'kötü', 'zor', 'yapamıyorum', 'korkuyorum', 'sıkıldım'];
    
    const mesajKucuk = mesaj.toLowerCase();
    let skor = 0;
    
    pozitifKelimeler.forEach(kelime => {
      if (mesajKucuk.includes(kelime)) skor += 0.2;
    });
    
    negatifKelimeler.forEach(kelime => {
      if (mesajKucuk.includes(kelime)) skor -= 0.2;
    });
    
    return Math.max(-1, Math.min(1, skor));
  }

  static _konuKategorisiBelirle(mesaj) {
    const mesajKucuk = mesaj.toLowerCase();
    
    if (mesajKucuk.includes('ders') || mesajKucuk.includes('okul') || mesajKucuk.includes('ödev')) return 'academic';
    if (mesajKucuk.includes('arkadaş') || mesajKucuk.includes('sosyal')) return 'social';
    if (mesajKucuk.includes('sağlık') || mesajKucuk.includes('hasta') || mesajKucuk.includes('yemek')) return 'health';
    if (mesajKucuk.includes('motivasyon') || mesajKucuk.includes('istek') || mesajKucuk.includes('enerji')) return 'motivation';
    if (mesajKucuk.includes('davranış') || mesajKucuk.includes('kural') || mesajKucuk.includes('disiplin')) return 'behavior';
    
    return 'development';
  }

  static _oncelikBelirle(duyguSkoru, konuKategorisi) {
    if (duyguSkoru < -0.5 || konuKategorisi === 'health') return 'yüksek';
    if (duyguSkoru < -0.2 || konuKategorisi === 'behavior') return 'orta';
    return 'düşük';
  }

  static _ortalamaDuyguSkoruHesapla(mesajlar) {
    const kullaniciMesajlari = mesajlar.filter(m => m.gonderen === 'user');
    if (kullaniciMesajlari.length === 0) return 0;
    
    const toplamSkor = kullaniciMesajlari.reduce((sum, mesaj) => {
      return sum + (mesaj.metadata.duyguSkoru || 0);
    }, 0);
    
    return toplamSkor / kullaniciMesajlari.length;
  }

  static _ogrenmeStiliBelirle(yas) {
    const stiller = ['görsel', 'işitsel', 'kinestetik', 'okuma-yazma'];
    return stiller[Math.floor(Math.random() * stiller.length)];
  }

  static _varsayilanIlgiAlanlari(yas) {
    const ilgiAlanlari = {
      7: ['oyun', 'resim', 'müzik'],
      8: ['spor', 'bilim', 'sanat'],
      9: ['okuma', 'teknoloji', 'doğa'],
      10: ['müzik', 'spor', 'bilim']
    };
    
    return ilgiAlanlari[yas] || ilgiAlanlari[9];
  }

  static async _gunlukGorevEkle(oturum, gorevId) {
    // Görev zaten eklenmiş mi kontrol et
    const mevcutGorev = oturum.gunlukGorevler.find(g => g.gorevId === gorevId);
    if (mevcutGorev) return;

    // Görev bilgilerini al
    const gorevBilgileri = this._gorevBilgileriGetir(gorevId);
    if (!gorevBilgileri) return;

    oturum.gunlukGorevler.push({
      gorevId: gorevBilgileri.id,
      baslik: gorevBilgileri.baslik,
      aciklama: gorevBilgileri.aciklama,
      kategori: gorevBilgileri.kategori,
      zorlukSeviyesi: gorevBilgileri.zorlukSeviyesi,
      sure: gorevBilgileri.sure,
      puan: gorevBilgileri.puan,
      oncelik: 'orta'
    });
  }

  static async _oneriEkle(oturum, oneriId) {
    // Öneri zaten eklenmiş mi kontrol et
    const mevcutOneri = oturum.oneriler.find(o => o.oneriId === oneriId);
    if (mevcutOneri) return;

    // Öneri bilgilerini al
    const oneriBilgileri = this._oneriBilgileriGetir(oneriId);
    if (!oneriBilgileri) return;

    oturum.oneriler.push({
      oneriId: oneriBilgileri.id,
      kategori: oneriBilgileri.kategori,
      baslik: oneriBilgileri.baslik,
      aciklama: oneriBilgileri.aciklama,
      oncelik: 'orta'
    });
  }

  static _gorevBilgileriGetir(gorevId) {
    // Tüm yaş görevlerini birleştir
    const tumGorevler = [
      ...this._yasGorevleri(7, '2. Sınıf'),
      ...this._yasGorevleri(8, '3. Sınıf'),
      ...this._yasGorevleri(9, '4. Sınıf'),
      ...this._yasGorevleri(10, '5. Sınıf')
    ];

    return tumGorevler.find(g => g.id === gorevId);
  }

  static _oneriBilgileriGetir(oneriId) {
    const oneriler = [
      {
        id: 'oneri_veli_1',
        baslik: 'Günlük Rutin Oluşturma',
        aciklama: 'Çocuğunuz için günlük bir rutin oluşturun.',
        kategori: 'development'
      },
      {
        id: 'oneri_veli_2',
        baslik: 'Pozitif Pekiştirme',
        aciklama: 'Çocuğunuzun olumlu davranışlarını övün.',
        kategori: 'motivation'
      }
    ];

    return oneriler.find(o => o.id === oneriId);
  }

  static _akademikGorevler(yas, sinif, ogrenmeStili) {
    return [
      {
        id: 'akademik_1',
        baslik: 'Matematik Oyunu',
        aciklama: 'Günlük matematik pratiği yap. 10 soru çöz.',
        kategori: 'akademik',
        zorlukSeviyesi: 'orta',
        sure: 20,
        puan: 25
      },
      {
        id: 'akademik_2',
        baslik: 'Okuma Zamanı',
        aciklama: 'En sevdiğin kitaptan 15 dakika oku.',
        kategori: 'akademik',
        zorlukSeviyesi: 'kolay',
        sure: 15,
        puan: 20
      }
    ];
  }

  // Görev tamamlama
  static async gorevTamamla(sohbetOturumu, gorevId) {
    try {
      const oturum = await GercekZamanliSohbet.findOne({ sohbetOturumu });
      if (!oturum) {
        throw new Error('Sohbet oturumu bulunamadı');
      }

      const gorev = oturum.gunlukGorevler.find(g => g.gorevId === gorevId);
      if (!gorev) {
        throw new Error('Görev bulunamadı');
      }

      gorev.tamamlandi = true;
      gorev.tamamlanmaZamani = new Date();
      oturum.gelisimTakibi.gunlukAktiviteSayisi++;

      await oturum.save();
      return oturum;
    } catch (error) {
      console.error('Görev tamamlama hatası:', error);
      throw error;
    }
  }

  // Oturum kapat
  static async oturumKapat(sohbetOturumu) {
    try {
      const oturum = await GercekZamanliSohbet.findOne({ sohbetOturumu });
      if (!oturum) {
        throw new Error('Sohbet oturumu bulunamadı');
      }

      oturum.oturumDurumu.aktif = false;
      await oturum.save();
      return oturum;
    } catch (error) {
      console.error('Oturum kapatma hatası:', error);
      throw error;
    }
  }

  // Kullanıcının aktif oturumunu getir
  static async aktifOturumGetir(kullaniciId, kullaniciTipi) {
    try {
      return await GercekZamanliSohbet.findOne({
        kullaniciId,
        kullaniciTipi,
        'oturumDurumu.aktif': true
      });
    } catch (error) {
      console.error('Aktif oturum getirme hatası:', error);
      throw error;
    }
  }

  // Kullanıcının tüm oturumlarını getir
  static async kullaniciOturumlari(kullaniciId, kullaniciTipi, limit = 10) {
    try {
      return await GercekZamanliSohbet.find({
        kullaniciId,
        kullaniciTipi
      })
      .sort({ 'oturumDurumu.baslangicZamani': -1 })
      .limit(limit);
    } catch (error) {
      console.error('Kullanıcı oturumları getirme hatası:', error);
      throw error;
    }
  }
}

export default GercekZamanliSohbetService; 