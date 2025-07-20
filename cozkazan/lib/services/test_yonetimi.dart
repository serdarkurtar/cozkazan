import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../data/test_verileri.dart';
import '../data/odul.dart';

class TestAyarlari {
  final int sinif;
  final List<String> kategoriler;
  final List<String> zorluklar;
  final int gunlukHedef;
  final int ekranSuresi;
  final bool serbestGun;

  TestAyarlari({
    required this.sinif,
    required this.kategoriler,
    required this.zorluklar,
    required this.gunlukHedef,
    required this.ekranSuresi,
    this.serbestGun = false,
  });

  Map<String, dynamic> toJson() {
    return {
      'sinif': sinif,
      'kategoriler': kategoriler,
      'zorluklar': zorluklar,
      'gunlukHedef': gunlukHedef,
      'ekranSuresi': ekranSuresi,
      'serbestGun': serbestGun,
    };
  }

  factory TestAyarlari.fromJson(Map<String, dynamic> json) {
    return TestAyarlari(
      sinif: json['sinif'] ?? 1,
      kategoriler: List<String>.from(json['kategoriler'] ?? json['dersler'] ?? ['Matematik']),
      zorluklar: List<String>.from(json['zorluklar'] ?? ['Kolay']),
      gunlukHedef: json['gunlukHedef'] ?? 10,
      ekranSuresi: json['ekranSuresi'] ?? 60,
      serbestGun: json['serbestGun'] ?? false,
    );
  }
}

class TestSonucu {
  final String ders;
  final String zorluk;
  final int dogruSayisi;
  final int toplamSoru;
  final int kazanilanXp;
  final DateTime tarih;

  TestSonucu({
    required this.ders,
    required this.zorluk,
    required this.dogruSayisi,
    required this.toplamSoru,
    required this.kazanilanXp,
    required this.tarih,
  });

  Map<String, dynamic> toJson() {
    return {
      'ders': ders,
      'zorluk': zorluk,
      'dogruSayisi': dogruSayisi,
      'toplamSoru': toplamSoru,
      'kazanilanXp': kazanilanXp,
      'tarih': tarih.toIso8601String(),
    };
  }

  factory TestSonucu.fromJson(Map<String, dynamic> json) {
    return TestSonucu(
      ders: json['ders'] ?? '',
      zorluk: json['zorluk'] ?? '',
      dogruSayisi: json['dogruSayisi'] ?? 0,
      toplamSoru: json['toplamSoru'] ?? 0,
      kazanilanXp: json['kazanilanXp'] ?? 0,
      tarih: DateTime.parse(json['tarih'] ?? DateTime.now().toIso8601String()),
    );
  }
}

class TestYonetimi {
  static const String _testAyarlariKey = 'test_ayarlari';
  static const String _testSonuclariKey = 'test_sonuclari';
  static const String _gunlukTestSayisiKey = 'gunluk_test_sayisi';
  static const String _toplamXpKey = 'toplam_xp';
  static const String _aktifOdulKey = 'aktif_odul';
  static const String _odulGecmisiKey = 'odul_gecmisi';

  // Test ayarlarını kaydetme
  static Future<void> testAyarlariniKaydet(TestAyarlari ayarlar) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_testAyarlariKey, jsonEncode(ayarlar.toJson()));
  }

  // Test ayarlarını getirme
  static Future<TestAyarlari> testAyarlariniGetir() async {
    final prefs = await SharedPreferences.getInstance();
    final ayarlarJson = prefs.getString(_testAyarlariKey);
    
    if (ayarlarJson != null) {
      return TestAyarlari.fromJson(jsonDecode(ayarlarJson));
    }
    
    // Varsayılan ayarlar
    return TestAyarlari(
      sinif: 1,
      kategoriler: ['Matematik'],
      zorluklar: ['Kolay'],
      gunlukHedef: 10,
      ekranSuresi: 60,
    );
  }

  // Test oluşturma
  static List<TestSorusu> testOlustur({
    required int sinif,
    required String ders,
    required String zorluk,
    int soruSayisi = 10,
  }) {
    return TestVerileri.getRastgeleSorular(
      sinif: sinif,
      ders: ders,
      zorluk: zorluk,
      soruSayisi: soruSayisi,
    );
  }

  // Karışık test oluşturma
  static List<TestSorusu> karisikTestOlustur({
    required int sinif,
    required List<String> kategoriler,
    required List<String> zorluklar,
    int soruSayisi = 10,
  }) {
    List<TestSorusu> tumSorular = [];
    
    for (String kategori in kategoriler) {
      for (String zorluk in zorluklar) {
        List<TestSorusu> kategoriSorulari = TestVerileri.getSorular(
          sinif: sinif,
          ders: kategori,
          zorluk: zorluk,
        );
        tumSorular.addAll(kategoriSorulari);
      }
    }
    
    // Eğer hiç soru bulunamazsa, varsayılan olarak 1. sınıf Matematik Kolay soruları ekle
    if (tumSorular.isEmpty) {
      tumSorular = TestVerileri.getSorular(
        sinif: 1,
        ders: "Matematik",
        zorluk: "Kolay",
      );
    }
    
    tumSorular.shuffle();
    
    if (tumSorular.length <= soruSayisi) {
      return tumSorular;
    } else {
      return tumSorular.take(soruSayisi).toList();
    }
  }

  // Test sonucunu kaydetme
  static Future<void> testSonucunuKaydet(TestSonucu sonuc) async {
    final prefs = await SharedPreferences.getInstance();
    
    // Mevcut sonuçları al
    List<TestSonucu> sonuclar = await testSonuclariniGetir();
    sonuclar.add(sonuc);
    
    // Sonuçları kaydet
    List<Map<String, dynamic>> sonuclarJson = sonuclar.map((s) => s.toJson()).toList();
    await prefs.setString(_testSonuclariKey, jsonEncode(sonuclarJson));
    
    // XP'yi güncelle
    await xpEkle(sonuc.kazanilanXp);
    
    // Günlük test sayısını güncelle
    await gunlukTestSayisiniGuncelle();
  }

  // Test sonuçlarını getirme
  static Future<List<TestSonucu>> testSonuclariniGetir() async {
    final prefs = await SharedPreferences.getInstance();
    final sonuclarJson = prefs.getString(_testSonuclariKey);
    
    if (sonuclarJson != null) {
      List<dynamic> jsonList = jsonDecode(sonuclarJson);
      return jsonList.map((json) => TestSonucu.fromJson(json)).toList();
    }
    
    return [];
  }

  // XP ekleme
  static Future<void> xpEkle(int xp) async {
    final prefs = await SharedPreferences.getInstance();
    int mevcutXp = prefs.getInt(_toplamXpKey) ?? 0;
    await prefs.setInt(_toplamXpKey, mevcutXp + xp);
  }

  // Toplam XP getirme
  static Future<int> toplamXpGetir() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(_toplamXpKey) ?? 0;
  }

  // Seviye hesaplama (her 100 XP = 1 seviye)
  static Future<int> seviyeGetir() async {
    int toplamXp = await toplamXpGetir();
    return (toplamXp / 100).floor() + 1;
  }

  // Günlük test sayısını güncelleme
  static Future<void> gunlukTestSayisiniGuncelle() async {
    final prefs = await SharedPreferences.getInstance();
    final bugun = DateTime.now().toIso8601String().split('T')[0];
    final gunlukTestSayisiKey = '${_gunlukTestSayisiKey}_$bugun';
    
    int mevcutSayi = prefs.getInt(gunlukTestSayisiKey) ?? 0;
    await prefs.setInt(gunlukTestSayisiKey, mevcutSayi + 1);
  }

  // Bugünkü test sayısını getirme
  static Future<int> bugunTestSayisiGetir() async {
    final prefs = await SharedPreferences.getInstance();
    final bugun = DateTime.now().toIso8601String().split('T')[0];
    final gunlukTestSayisiKey = '${_gunlukTestSayisiKey}_$bugun';
    
    return prefs.getInt(gunlukTestSayisiKey) ?? 0;
  }

  // Test istatistikleri
  static Future<Map<String, dynamic>> testIstatistikleriGetir() async {
    List<TestSonucu> sonuclar = await testSonuclariniGetir();
    
    if (sonuclar.isEmpty) {
      return {
        'toplamTest': 0,
        'toplamDogru': 0,
        'toplamYanlis': 0,
        'basariOrani': 0.0,
        'toplamXp': 0,
        'seviye': 1,
        'dersBazli': {},
      };
    }

    int toplamTest = sonuclar.length;
    int toplamDogru = sonuclar.fold(0, (sum, sonuc) => sum + sonuc.dogruSayisi);
    int toplamYanlis = sonuclar.fold(0, (sum, sonuc) => sum + (sonuc.toplamSoru - sonuc.dogruSayisi));
    double basariOrani = (toplamDogru / (toplamDogru + toplamYanlis)) * 100;
    int toplamXp = await toplamXpGetir();
    int seviye = await seviyeGetir();

    // Ders bazlı istatistikler
    Map<String, Map<String, dynamic>> dersBazli = {};
    for (TestSonucu sonuc in sonuclar) {
      if (!dersBazli.containsKey(sonuc.ders)) {
        dersBazli[sonuc.ders] = {
          'testSayisi': 0,
          'dogruSayisi': 0,
          'yanlisSayisi': 0,
          'basariOrani': 0.0,
        };
      }
      
      dersBazli[sonuc.ders]!['testSayisi'] = dersBazli[sonuc.ders]!['testSayisi'] + 1;
      dersBazli[sonuc.ders]!['dogruSayisi'] = dersBazli[sonuc.ders]!['dogruSayisi'] + sonuc.dogruSayisi;
      dersBazli[sonuc.ders]!['yanlisSayisi'] = dersBazli[sonuc.ders]!['yanlisSayisi'] + (sonuc.toplamSoru - sonuc.dogruSayisi);
    }

    // Ders bazlı başarı oranlarını hesapla
    for (String ders in dersBazli.keys) {
      int dogru = dersBazli[ders]!['dogruSayisi'];
      int yanlis = dersBazli[ders]!['yanlisSayisi'];
      dersBazli[ders]!['basariOrani'] = (dogru / (dogru + yanlis)) * 100;
    }

    return {
      'toplamTest': toplamTest,
      'toplamDogru': toplamDogru,
      'toplamYanlis': toplamYanlis,
      'basariOrani': basariOrani,
      'toplamXp': toplamXp,
      'seviye': seviye,
      'dersBazli': dersBazli,
    };
  }

  // XP hesaplama
  static int xpHesapla(int dogruSayisi, int toplamSoru, String zorluk) {
    double basariOrani = dogruSayisi / toplamSoru;
    
    int zorlukCarpani = 1;
    switch (zorluk) {
      case 'Kolay':
        zorlukCarpani = 1;
        break;
      case 'Orta':
        zorlukCarpani = 2;
        break;
      case 'Zor':
        zorlukCarpani = 3;
        break;
    }
    
    int baseXp = (basariOrani * 50).round();
    return baseXp * zorlukCarpani;
  }

  // Aktif ödül kaydetme
  static Future<void> aktifOdulKaydet(Odul? odul) async {
    final prefs = await SharedPreferences.getInstance();
    if (odul == null) {
      await prefs.remove(_aktifOdulKey);
    } else {
      await prefs.setString(_aktifOdulKey, jsonEncode(odul.toJson()));
    }
  }

  // Aktif ödül getirme
  static Future<Odul?> aktifOdulGetir() async {
    final prefs = await SharedPreferences.getInstance();
    final odulJson = prefs.getString(_aktifOdulKey);
    if (odulJson != null) {
      return Odul.fromJson(jsonDecode(odulJson));
    }
    return null;
  }

  // Ödül geçmişine ekleme
  static Future<void> odulGecmiseEkle(Odul odul) async {
    final prefs = await SharedPreferences.getInstance();
    final gecmisJson = prefs.getString(_odulGecmisiKey);
    List<Odul> gecmis = [];
    if (gecmisJson != null) {
      List<dynamic> jsonList = jsonDecode(gecmisJson);
      gecmis = jsonList.map((j) => Odul.fromJson(j)).toList();
    }
    gecmis.add(odul);
    await prefs.setString(_odulGecmisiKey, jsonEncode(gecmis.map((o) => o.toJson()).toList()));
  }

  // Ödül geçmişini getirme
  static Future<List<Odul>> odulGecmisiGetir() async {
    final prefs = await SharedPreferences.getInstance();
    final gecmisJson = prefs.getString(_odulGecmisiKey);
    if (gecmisJson != null) {
      List<dynamic> jsonList = jsonDecode(gecmisJson);
      return jsonList.map((j) => Odul.fromJson(j)).toList();
    }
    return [];
  }
} 