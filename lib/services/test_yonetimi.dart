import 'dart:convert';
// import '../data/test_verileri.dart'; // Eski test verileri kaldırıldı
import 'package:shared_preferences/shared_preferences.dart';
import 'firebase_service.dart';

class TestSorusu {
  final String soru;
  final List<String> secenekler;
  final int dogruCevap;
  final String ders;
  final String zorluk;
  final int sinif;
  final int xp;

  TestSorusu({
    required this.soru,
    required this.secenekler,
    required this.dogruCevap,
    required this.ders,
    required this.zorluk,
    required this.sinif,
    required this.xp,
  });

  Map<String, dynamic> toJson() {
    return {
      'soru': soru,
      'secenekler': secenekler,
      'dogruCevap': dogruCevap,
      'ders': ders,
      'zorluk': zorluk,
      'sinif': sinif,
      'xp': xp,
    };
  }

  factory TestSorusu.fromJson(Map<String, dynamic> json) {
    return TestSorusu(
      soru: json['soru'] ?? '',
      secenekler: List<String>.from(json['secenekler'] ?? []),
      dogruCevap: json['dogruCevap'] ?? 0,
      ders: json['ders'] ?? '',
      zorluk: json['zorluk'] ?? 'orta',
      sinif: json['sinif'] ?? 1,
      xp: json['xp'] ?? 10,
    );
  }
}

class TestSonucu {
  final String testAdi;
  final int dogruSayisi;
  final int toplamSoru;
  final int kazanilanXp;
  final String ders;
  final String zorluk;
  final DateTime tarih;

  TestSonucu({
    required this.testAdi,
    required this.dogruSayisi,
    required this.toplamSoru,
    required this.kazanilanXp,
    required this.ders,
    required this.zorluk,
    required this.tarih,
  });

  Map<String, dynamic> toJson() {
    return {
      'testAdi': testAdi,
      'dogruSayisi': dogruSayisi,
      'toplamSoru': toplamSoru,
      'kazanilanXp': kazanilanXp,
      'ders': ders,
      'zorluk': zorluk,
      'tarih': tarih.toIso8601String(),
    };
  }

  factory TestSonucu.fromJson(Map<String, dynamic> json) {
    return TestSonucu(
      testAdi: json['testAdi'] ?? '',
      dogruSayisi: json['dogruSayisi'] ?? 0,
      toplamSoru: json['toplamSoru'] ?? 0,
      kazanilanXp: json['kazanilanXp'] ?? 0,
      ders: json['ders'] ?? '',
      zorluk: json['zorluk'] ?? 'orta',
      tarih: DateTime.parse(json['tarih'] ?? DateTime.now().toIso8601String()),
    );
  }
}

class TestYonetimi {
  static const String _testSonuclariKey = 'test_sonuclari';
  static const String _toplamXpKey = 'toplam_xp';
  static const String _gunlukTestSayisiKey = 'gunluk_test_sayisi';

  // Test oluşturma - Firebase'den test çek
  static Future<List<TestSorusu>> testOlustur({
    required int sinif,
    required String ders,
    required String zorluk,
    int soruSayisi = 10,
  }) async {
    try {
      // Firebase'den test çek
      final testler = await FirebaseService.getTestler('$sinif. Sınıf', ders, 'Genel');
      
      if (testler.isEmpty) {
        // Test bulunamazsa boş liste döndür
        return [];
      }
      
      // Şimdilik basit test soruları oluştur
      List<TestSorusu> sorular = [];
      for (int i = 0; i < soruSayisi; i++) {
        sorular.add(TestSorusu(
          soru: '$ders dersi ${i + 1}. soru',
          secenekler: ['A', 'B', 'C', 'D'],
          dogruCevap: i % 4,
          ders: ders,
          zorluk: zorluk,
          sinif: sinif,
          xp: 10,
        ));
      }
      
      return sorular;
    } catch (e) {
      print('❌ Test oluşturma hatası: $e');
      return [];
    }
  }

  // Karışık test oluşturma
  static Future<List<TestSorusu>> karisikTestOlustur({
    required int sinif,
    required List<String> kategoriler,
    required List<String> zorluklar,
    int soruSayisi = 10,
  }) async {
    List<TestSorusu> tumSorular = [];
    
    for (String kategori in kategoriler) {
      for (String zorluk in zorluklar) {
        List<TestSorusu> kategoriSorulari = await testOlustur(
          sinif: sinif,
          ders: kategori,
          zorluk: zorluk,
          soruSayisi: soruSayisi ~/ kategoriler.length,
        );
        tumSorular.addAll(kategoriSorulari);
      }
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
  static Future<void> aktifOdulKaydet(Map<String, dynamic>? odul) async {
    final prefs = await SharedPreferences.getInstance();
    if (odul == null) {
      await prefs.remove('aktifOdul');
    } else {
      await prefs.setString('aktifOdul', jsonEncode(odul));
    }
  }

  // Aktif ödül getirme
  static Future<Map<String, dynamic>?> aktifOdulGetir() async {
    final prefs = await SharedPreferences.getInstance();
    final odulJson = prefs.getString('aktifOdul');
    if (odulJson != null) {
      return jsonDecode(odulJson);
    }
    return null;
  }

  // Ödül geçmişine ekleme
  static Future<void> odulGecmiseEkle(Map<String, dynamic> odul) async {
    final prefs = await SharedPreferences.getInstance();
    final gecmisJson = prefs.getString('odulGecmisi');
    List<Map<String, dynamic>> gecmis = [];
    if (gecmisJson != null) {
      List<dynamic> jsonList = jsonDecode(gecmisJson);
      gecmis = jsonList.cast<Map<String, dynamic>>();
    }
    gecmis.add(odul);
    await prefs.setString('odulGecmisi', jsonEncode(gecmis));
  }

  // Ödül geçmişini getirme
  static Future<List<Map<String, dynamic>>> odulGecmisiGetir() async {
    final prefs = await SharedPreferences.getInstance();
    final gecmisJson = prefs.getString('odulGecmisi');
    if (gecmisJson != null) {
      List<dynamic> jsonList = jsonDecode(gecmisJson);
      return jsonList.cast<Map<String, dynamic>>();
    }
    return [];
  }
} 