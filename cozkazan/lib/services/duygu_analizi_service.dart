import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants.dart';

class DuyguAnalizi {
  final String id;
  final String kullaniciId;
  final String kullaniciTipi;
  final String mesaj;
  final double duyguSkoru;
  final String duyguKategori;
  final List<String> anaDuygular;
  final TonAnalizi tonAnalizi;
  final String dil;
  final DateTime tarih;
  final String yanitToni;
  final bool yanitAyarlandi;

  DuyguAnalizi({
    required this.id,
    required this.kullaniciId,
    required this.kullaniciTipi,
    required this.mesaj,
    required this.duyguSkoru,
    required this.duyguKategori,
    required this.anaDuygular,
    required this.tonAnalizi,
    required this.dil,
    required this.tarih,
    required this.yanitToni,
    required this.yanitAyarlandi,
  });

  factory DuyguAnalizi.fromJson(Map<String, dynamic> json) {
    return DuyguAnalizi(
      id: json['_id'],
      kullaniciId: json['kullaniciId'],
      kullaniciTipi: json['kullaniciTipi'],
      mesaj: json['mesaj'],
      duyguSkoru: json['duyguSkoru'].toDouble(),
      duyguKategori: json['duyguKategori'],
      anaDuygular: List<String>.from(json['anaDuygular']),
      tonAnalizi: TonAnalizi.fromJson(json['tonAnalizi']),
      dil: json['dil'],
      tarih: DateTime.parse(json['tarih']),
      yanitToni: json['yanitToni'],
      yanitAyarlandi: json['yanitAyarlandi'],
    );
  }
}

class TonAnalizi {
  final double resmiyet;
  final double enerji;
  final double aciliyet;

  TonAnalizi({
    required this.resmiyet,
    required this.enerji,
    required this.aciliyet,
  });

  factory TonAnalizi.fromJson(Map<String, dynamic> json) {
    return TonAnalizi(
      resmiyet: json['resmiyet'].toDouble(),
      enerji: json['enerji'].toDouble(),
      aciliyet: json['aciliyet'].toDouble(),
    );
  }
}

class DuyguIstatistikleri {
  final int toplamMesaj;
  final double ortalamaDuyguSkoru;
  final Map<String, int> duyguKategorileri;
  final Map<String, int> enCokKullanilanDuygular;
  final TonAnalizi tonAnaliziOrtalamalari;

  DuyguIstatistikleri({
    required this.toplamMesaj,
    required this.ortalamaDuyguSkoru,
    required this.duyguKategorileri,
    required this.enCokKullanilanDuygular,
    required this.tonAnaliziOrtalamalari,
  });

  factory DuyguIstatistikleri.fromJson(Map<String, dynamic> json) {
    return DuyguIstatistikleri(
      toplamMesaj: json['toplamMesaj'],
      ortalamaDuyguSkoru: json['ortalamaDuyguSkoru'].toDouble(),
      duyguKategorileri: Map<String, int>.from(json['duyguKategorileri']),
      enCokKullanilanDuygular: Map<String, int>.from(json['enCokKullanilanDuygular']),
      tonAnaliziOrtalamalari: TonAnalizi.fromJson(json['tonAnaliziOrtalamalari']),
    );
  }
}

class DuyguAnaliziService {
  static const String baseUrl = 'http://91.99.187.116:3000';

  // Mesajın duygusal tonunu analiz et
  static Future<DuyguAnalizi> analizEt({
    required String mesaj,
    required String kullaniciId,
    required String kullaniciTipi,
    String dil = 'tr',
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/duygu-analizi/analiz'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'mesaj': mesaj,
          'kullaniciId': kullaniciId,
          'kullaniciTipi': kullaniciTipi,
          'dil': dil,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return DuyguAnalizi.fromJson(data['data']);
        } else {
          throw Exception('Duygu analizi başarısız: ${data['message']}');
        }
      } else {
        throw Exception('Duygu analizi hatası: ${response.statusCode}');
      }
    } catch (e) {
      print('Duygu analizi servis hatası: $e');
      // Fallback: Basit duygu analizi
      return _getFallbackAnaliz(mesaj, kullaniciId, kullaniciTipi);
    }
  }

  // Yanıtı duygu analizine göre ayarla
  static Future<String> yanitiAyarla({
    required String yanit,
    required String duyguAnaliziId,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/duygu-analizi/yanit-ayarla'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'yanit': yanit,
          'duyguAnaliziId': duyguAnaliziId,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return data['data']['ayarlanmisYanit'];
        } else {
          throw Exception('Yanıt ayarlama başarısız: ${data['message']}');
        }
      } else {
        throw Exception('Yanıt ayarlama hatası: ${response.statusCode}');
      }
    } catch (e) {
      print('Yanıt ayarlama servis hatası: $e');
      return yanit; // Fallback: Orijinal yanıtı döndür
    }
  }

  // Kullanıcının duygu geçmişini getir
  static Future<List<DuyguAnalizi>> kullaniciDuyguGecmisi({
    required String kullaniciId,
    required String kullaniciTipi,
    int gunSayisi = 7,
  }) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/duygu-analizi/gecmis/$kullaniciId?kullaniciTipi=$kullaniciTipi&gunSayisi=$gunSayisi'),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return (data['data'] as List)
              .map((json) => DuyguAnalizi.fromJson(json))
              .toList();
        } else {
          throw Exception('Duygu geçmişi getirme başarısız: ${data['message']}');
        }
      } else {
        throw Exception('Duygu geçmişi getirme hatası: ${response.statusCode}');
      }
    } catch (e) {
      print('Duygu geçmişi servis hatası: $e');
      return [];
    }
  }

  // Duygu istatistiklerini getir
  static Future<DuyguIstatistikleri?> duyguIstatistikleri({
    required String kullaniciId,
    required String kullaniciTipi,
    int gunSayisi = 30,
  }) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/duygu-analizi/istatistikler/$kullaniciId?kullaniciTipi=$kullaniciTipi&gunSayisi=$gunSayisi'),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return DuyguIstatistikleri.fromJson(data['data']);
        } else {
          throw Exception('İstatistik getirme başarısız: ${data['message']}');
        }
      } else {
        throw Exception('İstatistik getirme hatası: ${response.statusCode}');
      }
    } catch (e) {
      print('Duygu istatistikleri servis hatası: $e');
      return null;
    }
  }

  // Basit duygu analizi (fallback)
  static DuyguAnalizi _getFallbackAnaliz(String mesaj, String kullaniciId, String kullaniciTipi) {
    final lowerMesaj = mesaj.toLowerCase();
    double duyguSkoru = 0.0;
    List<String> anaDuygular = ['nötr'];

    // Basit kelime analizi
    final pozitifKelimeler = ['mutlu', 'sevinçli', 'harika', 'süper', 'güzel', 'iyi', 'başarılı'];
    final negatifKelimeler = ['üzgün', 'kızgın', 'kötü', 'berbat', 'yorgun', 'stresli', 'endişeli'];

    int pozitifSayisi = 0;
    int negatifSayisi = 0;

    for (final kelime in pozitifKelimeler) {
      if (lowerMesaj.contains(kelime)) {
        pozitifSayisi++;
        anaDuygular = ['mutlu'];
      }
    }

    for (final kelime in negatifKelimeler) {
      if (lowerMesaj.contains(kelime)) {
        negatifSayisi++;
        anaDuygular = ['üzgün'];
      }
    }

    if (pozitifSayisi > negatifSayisi) {
      duyguSkoru = 0.5;
    } else if (negatifSayisi > pozitifSayisi) {
      duyguSkoru = -0.5;
    }

    // Emoji analizi
    final pozitifEmojiler = ['😊', '😄', '😃', '😁', '😆', '😍', '🥰', '👍', '👏', '🎉', '✨', '🌟', '💪', '🔥', '❤️'];
    final negatifEmojiler = ['😢', '😭', '😤', '😠', '😡', '🤬', '😈', '👿', '💀', '☠️', '💩'];

    for (final emoji in pozitifEmojiler) {
      if (mesaj.contains(emoji)) {
        duyguSkoru += 0.3;
        anaDuygular = ['mutlu'];
      }
    }

    for (final emoji in negatifEmojiler) {
      if (mesaj.contains(emoji)) {
        duyguSkoru -= 0.3;
        anaDuygular = ['üzgün'];
      }
    }

    // Skoru sınırla
    duyguSkoru = duyguSkoru.clamp(-1.0, 1.0);

    // Duygu kategorisini belirle
    String duyguKategori;
    if (duyguSkoru <= -0.6) {
      duyguKategori = 'çok_negatif';
    } else if (duyguSkoru <= -0.2) {
      duyguKategori = 'negatif';
    } else if (duyguSkoru <= 0.2) {
      duyguKategori = 'nötr';
    } else if (duyguSkoru <= 0.6) {
      duyguKategori = 'pozitif';
    } else {
      duyguKategori = 'çok_pozitif';
    }

    // Ton analizi
    final tonAnalizi = TonAnalizi(
      resmiyet: 0.5, // Varsayılan orta
      enerji: duyguSkoru > 0 ? 0.7 : 0.3, // Pozitif ise yüksek enerji
      aciliyet: 0.3, // Varsayılan düşük
    );

    // Yanıt tonunu belirle
    String yanitToni;
    if (kullaniciTipi == 'child') {
      if (duyguSkoru < -0.3) {
        yanitToni = 'destekleyici';
      } else if (duyguSkoru < 0.2) {
        yanitToni = 'motivasyonel';
      } else {
        yanitToni = 'samimi';
      }
    } else {
      if (duyguSkoru < -0.2) {
        yanitToni = 'destekleyici';
      } else {
        yanitToni = 'eğitici';
      }
    }

    return DuyguAnalizi(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      kullaniciId: kullaniciId,
      kullaniciTipi: kullaniciTipi,
      mesaj: mesaj,
      duyguSkoru: duyguSkoru,
      duyguKategori: duyguKategori,
      anaDuygular: anaDuygular,
      tonAnalizi: tonAnalizi,
      dil: 'tr',
      tarih: DateTime.now(),
      yanitToni: yanitToni,
      yanitAyarlandi: false,
    );
  }

  // Duygu skoruna göre emoji önerisi
  static String getEmojiOnerisi(double duyguSkoru) {
    if (duyguSkoru > 0.5) {
      return '😊';
    } else if (duyguSkoru > 0.2) {
      return '🙂';
    } else if (duyguSkoru > -0.2) {
      return '😐';
    } else if (duyguSkoru > -0.5) {
      return '😔';
    } else {
      return '😢';
    }
  }

  // Duygu kategorisine göre renk
  static String getDuyguRengi(String duyguKategori) {
    switch (duyguKategori) {
      case 'çok_pozitif':
        return '#28a745'; // Yeşil
      case 'pozitif':
        return '#20c997'; // Açık yeşil
      case 'nötr':
        return '#6c757d'; // Gri
      case 'negatif':
        return '#fd7e14'; // Turuncu
      case 'çok_negatif':
        return '#dc3545'; // Kırmızı
      default:
        return '#6c757d';
    }
  }

  // Yanıt tonuna göre öneri
  static String getYanitToniOnerisi(String yanitToni) {
    switch (yanitToni) {
      case 'destekleyici':
        return 'Destekleyici ve anlayışlı bir ton kullanın';
      case 'motivasyonel':
        return 'Motivasyonel ve cesaretlendirici bir ton kullanın';
      case 'eğitici':
        return 'Eğitici ve bilgilendirici bir ton kullanın';
      case 'samimi':
        return 'Samimi ve arkadaşça bir ton kullanın';
      case 'profesyonel':
        return 'Profesyonel ve resmi bir ton kullanın';
      default:
        return 'Uygun bir ton seçin';
    }
  }
} 