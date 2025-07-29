import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants.dart';

class GelisimRaporu {
  final String id;
  final String childId;
  final String parentId;
  final String raporTipi;
  final DateTime baslangicTarihi;
  final DateTime bitisTarihi;
  final DateTime olusturmaTarihi;
  
  // Genel İstatistikler
  final int toplamXp;
  final int toplamTest;
  final int toplamHikaye;
  final int toplamCalismaSuresi;
  
  // Günlük Ortalamalar
  final double gunlukOrtalamaXp;
  final double gunlukOrtalamaTest;
  final double gunlukOrtalamaHikaye;
  final double gunlukOrtalamaCalismaSuresi;
  
  // Başarı Oranları
  final double testBasariOrani;
  final double hikayeTamamlamaOrani;
  final double hedefUlasmaOrani;
  
  // Duygu Analizi
  final DuyguAnalizi duyguAnalizi;
  
  // Sınıf-Ders Performansı
  final List<SinifDersPerformans> sinifDersPerformans;
  
  // Hedefler
  final List<Hedef> hedefler;
  
  // Öneriler
  final List<Oneri> oneriler;
  
  // Motivasyon ve Özet
  final String motivasyonMesaji;
  final String gelisimOzeti;
  
  // Rapor Durumu
  final bool gonderildi;
  final DateTime? gonderimTarihi;
  final bool veliGoruntuledi;
  final DateTime? veliGoruntulemeTarihi;
  
  // Grafik Verileri
  final Map<String, int> gunlukXp;
  final Map<String, int> gunlukTest;
  final Map<String, int> gunlukHikaye;
  final Map<String, double> duyguTrendi;
  
  // Sanal Alanlar
  final int raporSuresi;
  final int genelPerformansSkoru;
  final String performansSeviyesi;

  GelisimRaporu({
    required this.id,
    required this.childId,
    required this.parentId,
    required this.raporTipi,
    required this.baslangicTarihi,
    required this.bitisTarihi,
    required this.olusturmaTarihi,
    required this.toplamXp,
    required this.toplamTest,
    required this.toplamHikaye,
    required this.toplamCalismaSuresi,
    required this.gunlukOrtalamaXp,
    required this.gunlukOrtalamaTest,
    required this.gunlukOrtalamaHikaye,
    required this.gunlukOrtalamaCalismaSuresi,
    required this.testBasariOrani,
    required this.hikayeTamamlamaOrani,
    required this.hedefUlasmaOrani,
    required this.duyguAnalizi,
    required this.sinifDersPerformans,
    required this.hedefler,
    required this.oneriler,
    required this.motivasyonMesaji,
    required this.gelisimOzeti,
    required this.gonderildi,
    this.gonderimTarihi,
    required this.veliGoruntuledi,
    this.veliGoruntulemeTarihi,
    required this.gunlukXp,
    required this.gunlukTest,
    required this.gunlukHikaye,
    required this.duyguTrendi,
    required this.raporSuresi,
    required this.genelPerformansSkoru,
    required this.performansSeviyesi,
  });

  factory GelisimRaporu.fromJson(Map<String, dynamic> json) {
    return GelisimRaporu(
      id: json['_id'],
      childId: json['childId'],
      parentId: json['parentId'],
      raporTipi: json['raporTipi'],
      baslangicTarihi: DateTime.parse(json['baslangicTarihi']),
      bitisTarihi: DateTime.parse(json['bitisTarihi']),
      olusturmaTarihi: DateTime.parse(json['olusturmaTarihi']),
      toplamXp: json['toplamXp'] ?? 0,
      toplamTest: json['toplamTest'] ?? 0,
      toplamHikaye: json['toplamHikaye'] ?? 0,
      toplamCalismaSuresi: json['toplamCalismaSuresi'] ?? 0,
      gunlukOrtalamaXp: (json['gunlukOrtalamaXp'] ?? 0).toDouble(),
      gunlukOrtalamaTest: (json['gunlukOrtalamaTest'] ?? 0).toDouble(),
      gunlukOrtalamaHikaye: (json['gunlukOrtalamaHikaye'] ?? 0).toDouble(),
      gunlukOrtalamaCalismaSuresi: (json['gunlukOrtalamaCalismaSuresi'] ?? 0).toDouble(),
      testBasariOrani: (json['testBasariOrani'] ?? 0).toDouble(),
      hikayeTamamlamaOrani: (json['hikayeTamamlamaOrani'] ?? 0).toDouble(),
      hedefUlasmaOrani: (json['hedefUlasmaOrani'] ?? 0).toDouble(),
      duyguAnalizi: DuyguAnalizi.fromJson(json['duyguAnalizi'] ?? {}),
      sinifDersPerformans: (json['sinifDersPerformans'] as List? ?? [])
          .map((item) => SinifDersPerformans.fromJson(item))
          .toList(),
      hedefler: (json['hedefler'] as List? ?? [])
          .map((item) => Hedef.fromJson(item))
          .toList(),
      oneriler: (json['oneriler'] as List? ?? [])
          .map((item) => Oneri.fromJson(item))
          .toList(),
      motivasyonMesaji: json['motivasyonMesaji'] ?? '',
      gelisimOzeti: json['gelisimOzeti'] ?? '',
      gonderildi: json['gonderildi'] ?? false,
      gonderimTarihi: json['gonderimTarihi'] != null ? DateTime.parse(json['gonderimTarihi']) : null,
      veliGoruntuledi: json['veliGoruntuledi'] ?? false,
      veliGoruntulemeTarihi: json['veliGoruntulemeTarihi'] != null ? DateTime.parse(json['veliGoruntulemeTarihi']) : null,
      gunlukXp: Map<String, int>.from(json['grafikVerileri']?['gunlukXp'] ?? {}),
      gunlukTest: Map<String, int>.from(json['grafikVerileri']?['gunlukTest'] ?? {}),
      gunlukHikaye: Map<String, int>.from(json['grafikVerileri']?['gunlukHikaye'] ?? {}),
      duyguTrendi: Map<String, double>.from(json['grafikVerileri']?['duyguTrendi'] ?? {}),
      raporSuresi: json['raporSuresi'] ?? 0,
      genelPerformansSkoru: json['genelPerformansSkoru'] ?? 0,
      performansSeviyesi: json['performansSeviyesi'] ?? 'Orta',
    );
  }
}

class DuyguAnalizi {
  final double ortalamaDuyguSkoru;
  final String enCokGorulenDuygu;
  final Map<String, int> duyguKategorileri;
  final int pozitifGunSayisi;
  final int negatifGunSayisi;

  DuyguAnalizi({
    required this.ortalamaDuyguSkoru,
    required this.enCokGorulenDuygu,
    required this.duyguKategorileri,
    required this.pozitifGunSayisi,
    required this.negatifGunSayisi,
  });

  factory DuyguAnalizi.fromJson(Map<String, dynamic> json) {
    return DuyguAnalizi(
      ortalamaDuyguSkoru: (json['ortalamaDuyguSkoru'] ?? 0).toDouble(),
      enCokGorulenDuygu: json['enCokGorulenDuygu'] ?? 'nötr',
      duyguKategorileri: Map<String, int>.from(json['duyguKategorileri'] ?? {}),
      pozitifGunSayisi: json['pozitifGunSayisi'] ?? 0,
      negatifGunSayisi: json['negatifGunSayisi'] ?? 0,
    );
  }
}

class SinifDersPerformans {
  final String sinif;
  final String ders;
  final int testSayisi;
  final double basariOrani;
  final double ortalamaPuan;

  SinifDersPerformans({
    required this.sinif,
    required this.ders,
    required this.testSayisi,
    required this.basariOrani,
    required this.ortalamaPuan,
  });

  factory SinifDersPerformans.fromJson(Map<String, dynamic> json) {
    return SinifDersPerformans(
      sinif: json['sinif'],
      ders: json['ders'],
      testSayisi: json['testSayisi'] ?? 0,
      basariOrani: (json['basariOrani'] ?? 0).toDouble(),
      ortalamaPuan: (json['ortalamaPuan'] ?? 0).toDouble(),
    );
  }
}

class Hedef {
  final String hedefAdi;
  final String hedefTipi;
  final int hedefDegeri;
  final int ulasilanDeger;
  final double tamamlanmaOrani;
  final bool tamamlandi;

  Hedef({
    required this.hedefAdi,
    required this.hedefTipi,
    required this.hedefDegeri,
    required this.ulasilanDeger,
    required this.tamamlanmaOrani,
    required this.tamamlandi,
  });

  factory Hedef.fromJson(Map<String, dynamic> json) {
    return Hedef(
      hedefAdi: json['hedefAdi'],
      hedefTipi: json['hedefTipi'],
      hedefDegeri: json['hedefDegeri'] ?? 0,
      ulasilanDeger: json['ulasilanDeger'] ?? 0,
      tamamlanmaOrani: (json['tamamlanmaOrani'] ?? 0).toDouble(),
      tamamlandi: json['tamamlandi'] ?? false,
    );
  }
}

class Oneri {
  final String kategori;
  final String oneri;
  final String oncelik;

  Oneri({
    required this.kategori,
    required this.oneri,
    required this.oncelik,
  });

  factory Oneri.fromJson(Map<String, dynamic> json) {
    return Oneri(
      kategori: json['kategori'],
      oneri: json['oneri'],
      oncelik: json['oncelik'],
    );
  }
}

class GelisimRaporuService {
  static const String baseUrl = 'http://localhost:3000';

  // Otomatik rapor oluştur
  static Future<GelisimRaporu> otomatikRaporOlustur({
    required String childId,
    required String parentId,
    String raporTipi = 'weekly',
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/gelisim-raporu/otomatik-olustur'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'childId': childId,
          'parentId': parentId,
          'raporTipi': raporTipi,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return GelisimRaporu.fromJson(data['data']);
        } else {
          throw Exception('Rapor oluşturulamadı: ${data['message']}');
        }
      } else {
        throw Exception('Rapor oluşturma hatası: ${response.statusCode}');
      }
    } catch (e) {
      print('Otomatik rapor oluşturma hatası: $e');
      rethrow;
    }
  }

  // Manuel rapor oluştur
  static Future<GelisimRaporu> manuelRaporOlustur({
    required String childId,
    required String parentId,
    required String raporTipi,
    required DateTime baslangicTarihi,
    required DateTime bitisTarihi,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/gelisim-raporu/manuel-olustur'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'childId': childId,
          'parentId': parentId,
          'raporTipi': raporTipi,
          'baslangicTarihi': baslangicTarihi.toIso8601String(),
          'bitisTarihi': bitisTarihi.toIso8601String(),
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return GelisimRaporu.fromJson(data['data']);
        } else {
          throw Exception('Rapor oluşturulamadı: ${data['message']}');
        }
      } else {
        throw Exception('Rapor oluşturma hatası: ${response.statusCode}');
      }
    } catch (e) {
      print('Manuel rapor oluşturma hatası: $e');
      rethrow;
    }
  }

  // Çocuğun raporlarını getir
  static Future<List<GelisimRaporu>> cocukRaporlari({
    required String childId,
    String? raporTipi,
  }) async {
    try {
      String url = '$baseUrl/api/gelisim-raporu/cocuk/$childId';
      if (raporTipi != null) {
        url += '?raporTipi=$raporTipi';
      }

      final response = await http.get(Uri.parse(url));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return (data['data'] as List)
              .map((json) => GelisimRaporu.fromJson(json))
              .toList();
        } else {
          throw Exception('Raporlar getirilemedi: ${data['message']}');
        }
      } else {
        throw Exception('Raporlar getirme hatası: ${response.statusCode}');
      }
    } catch (e) {
      print('Çocuk raporları getirme hatası: $e');
      return [];
    }
  }

  // Veli raporlarını getir
  static Future<List<GelisimRaporu>> veliRaporlari({
    required String parentId,
    bool? gonderildi,
  }) async {
    try {
      String url = '$baseUrl/api/gelisim-raporu/veli/$parentId';
      if (gonderildi != null) {
        url += '?gonderildi=$gonderildi';
      }

      final response = await http.get(Uri.parse(url));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return (data['data'] as List)
              .map((json) => GelisimRaporu.fromJson(json))
              .toList();
        } else {
          throw Exception('Raporlar getirilemedi: ${data['message']}');
        }
      } else {
        throw Exception('Raporlar getirme hatası: ${response.statusCode}');
      }
    } catch (e) {
      print('Veli raporları getirme hatası: $e');
      return [];
    }
  }

  // Rapor detayını getir
  static Future<GelisimRaporu?> raporDetayi(String raporId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/gelisim-raporu/$raporId'),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return GelisimRaporu.fromJson(data['data']);
        } else {
          throw Exception('Rapor getirilemedi: ${data['message']}');
        }
      } else {
        throw Exception('Rapor getirme hatası: ${response.statusCode}');
      }
    } catch (e) {
      print('Rapor detay getirme hatası: $e');
      return null;
    }
  }

  // Raporu veliye gönder
  static Future<bool> raporuGonder(String raporId) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/gelisim-raporu/gonder/$raporId'),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['success'] == true;
      } else {
        throw Exception('Rapor gönderme hatası: ${response.statusCode}');
      }
    } catch (e) {
      print('Rapor gönderme hatası: $e');
      return false;
    }
  }

  // Raporu görüntüle (veli tarafından)
  static Future<bool> raporuGoruntulendi(String raporId) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/gelisim-raporu/goruntulendi/$raporId'),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['success'] == true;
      } else {
        throw Exception('Görüntüleme kaydetme hatası: ${response.statusCode}');
      }
    } catch (e) {
      print('Rapor görüntüleme hatası: $e');
      return false;
    }
  }

  // Performans seviyesine göre renk
  static String getPerformansRengi(String performansSeviyesi) {
    switch (performansSeviyesi) {
      case 'Mükemmel':
        return '#28a745'; // Yeşil
      case 'İyi':
        return '#17a2b8'; // Mavi
      case 'Orta':
        return '#ffc107'; // Sarı
      case 'Geliştirilmeli':
        return '#fd7e14'; // Turuncu
      case 'Dikkat Gerekli':
        return '#dc3545'; // Kırmızı
      default:
        return '#6c757d'; // Gri
    }
  }

  // Rapor tipine göre emoji
  static String getRaporTipiEmoji(String raporTipi) {
    switch (raporTipi) {
      case 'daily':
        return '📅';
      case 'weekly':
        return '📊';
      case 'monthly':
        return '📈';
      default:
        return '📋';
    }
  }

  // Rapor tipine göre Türkçe ad
  static String getRaporTipiAdi(String raporTipi) {
    switch (raporTipi) {
      case 'daily':
        return 'Günlük';
      case 'weekly':
        return 'Haftalık';
      case 'monthly':
        return 'Aylık';
      default:
        return 'Rapor';
    }
  }

  // Öncelik seviyesine göre renk
  static String getOncelikRengi(String oncelik) {
    switch (oncelik) {
      case 'yüksek':
        return '#dc3545'; // Kırmızı
      case 'orta':
        return '#ffc107'; // Sarı
      case 'düşük':
        return '#28a745'; // Yeşil
      default:
        return '#6c757d'; // Gri
    }
  }

  // Grafik verilerini hazırla
  static Map<String, dynamic> grafikVerileriniHazirla(GelisimRaporu rapor) {
    return {
      'gunlukXp': rapor.gunlukXp,
      'gunlukTest': rapor.gunlukTest,
      'gunlukHikaye': rapor.gunlukHikaye,
      'duyguTrendi': rapor.duyguTrendi,
    };
  }

  // Özet istatistikler
  static Map<String, dynamic> ozetIstatistikler(GelisimRaporu rapor) {
    return {
      'toplamXp': rapor.toplamXp,
      'toplamTest': rapor.toplamTest,
      'toplamHikaye': rapor.toplamHikaye,
      'testBasariOrani': rapor.testBasariOrani,
      'hikayeTamamlamaOrani': rapor.hikayeTamamlamaOrani,
      'hedefUlasmaOrani': rapor.hedefUlasmaOrani,
      'genelPerformansSkoru': rapor.genelPerformansSkoru,
      'performansSeviyesi': rapor.performansSeviyesi,
    };
  }
} 