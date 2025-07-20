import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class GercekZamanliSohbetService {
  static const String baseUrl = 'http://localhost:3000/api/gercek-zamanli-sohbet';
  
  // Sohbet oturumu başlat
  static Future<Map<String, dynamic>> sohbetOturumuBaslat(String kullaniciId, String kullaniciTipi) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/oturum-baslat'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'kullaniciId': kullaniciId,
          'kullaniciTipi': kullaniciTipi,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success']) {
          // Oturum bilgilerini kaydet
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('sohbetOturumu', data['data']['sohbetOturumu']);
          await prefs.setString('kullaniciTipi', kullaniciTipi);
          
          return data['data'];
        } else {
          throw Exception(data['message']);
        }
      } else {
        throw Exception('Sunucu hatası: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Sohbet oturumu başlatılamadı: $e');
    }
  }

  // Mesaj gönder
  static Future<Map<String, dynamic>> mesajGonder(String mesaj) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final sohbetOturumu = prefs.getString('sohbetOturumu');
      
      if (sohbetOturumu == null) {
        throw Exception('Aktif sohbet oturumu bulunamadı');
      }

      final response = await http.post(
        Uri.parse('$baseUrl/mesaj-gonder'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'sohbetOturumu': sohbetOturumu,
          'mesaj': mesaj,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success']) {
          return data['data'];
        } else {
          throw Exception(data['message']);
        }
      } else {
        throw Exception('Sunucu hatası: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Mesaj gönderilemedi: $e');
    }
  }

  // Görev tamamla
  static Future<Map<String, dynamic>> gorevTamamla(String gorevId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final sohbetOturumu = prefs.getString('sohbetOturumu');
      
      if (sohbetOturumu == null) {
        throw Exception('Aktif sohbet oturumu bulunamadı');
      }

      final response = await http.post(
        Uri.parse('$baseUrl/gorev-tamamla'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'sohbetOturumu': sohbetOturumu,
          'gorevId': gorevId,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success']) {
          return data['data'];
        } else {
          throw Exception(data['message']);
        }
      } else {
        throw Exception('Sunucu hatası: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Görev tamamlanamadı: $e');
    }
  }

  // Oturum kapat
  static Future<bool> oturumKapat() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final sohbetOturumu = prefs.getString('sohbetOturumu');
      
      if (sohbetOturumu == null) {
        return true; // Zaten kapalı
      }

      final response = await http.post(
        Uri.parse('$baseUrl/oturum-kapat'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'sohbetOturumu': sohbetOturumu,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success']) {
          // Oturum bilgilerini temizle
          await prefs.remove('sohbetOturumu');
          await prefs.remove('kullaniciTipi');
          return true;
        } else {
          throw Exception(data['message']);
        }
      } else {
        throw Exception('Sunucu hatası: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Oturum kapatılamadı: $e');
    }
  }

  // Aktif oturum getir
  static Future<Map<String, dynamic>?> aktifOturumGetir(String kullaniciId, String kullaniciTipi) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/aktif-oturum/$kullaniciId/$kullaniciTipi'),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success']) {
          return data['data'];
        } else {
          return null; // Aktif oturum yok
        }
      } else {
        throw Exception('Sunucu hatası: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Aktif oturum getirilemedi: $e');
    }
  }

  // Kullanıcı oturumları getir
  static Future<List<Map<String, dynamic>>> kullaniciOturumlari(String kullaniciId, String kullaniciTipi, {int limit = 10}) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/kullanici-oturumlari/$kullaniciId/$kullaniciTipi?limit=$limit'),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success']) {
          return List<Map<String, dynamic>>.from(data['data']);
        } else {
          throw Exception(data['message']);
        }
      } else {
        throw Exception('Sunucu hatası: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Kullanıcı oturumları getirilemedi: $e');
    }
  }

  // Oturum detayı getir
  static Future<Map<String, dynamic>> oturumDetayi(String sohbetOturumu) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/oturum/$sohbetOturumu'),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success']) {
          return data['data'];
        } else {
          throw Exception(data['message']);
        }
      } else {
        throw Exception('Sunucu hatası: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Oturum detayı getirilemedi: $e');
    }
  }

  // Profil güncelle
  static Future<Map<String, dynamic>> profilGuncelle(Map<String, dynamic> profilGuncellemeleri) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final sohbetOturumu = prefs.getString('sohbetOturumu');
      
      if (sohbetOturumu == null) {
        throw Exception('Aktif sohbet oturumu bulunamadı');
      }

      final response = await http.put(
        Uri.parse('$baseUrl/profil-guncelle/$sohbetOturumu'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(profilGuncellemeleri),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success']) {
          return data['data'];
        } else {
          throw Exception(data['message']);
        }
      } else {
        throw Exception('Sunucu hatası: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Profil güncellenemedi: $e');
    }
  }

  // Sistem ayarlarını güncelle
  static Future<Map<String, dynamic>> ayarlarGuncelle(Map<String, dynamic> ayarGuncellemeleri) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final sohbetOturumu = prefs.getString('sohbetOturumu');
      
      if (sohbetOturumu == null) {
        throw Exception('Aktif sohbet oturumu bulunamadı');
      }

      final response = await http.put(
        Uri.parse('$baseUrl/ayarlar-guncelle/$sohbetOturumu'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(ayarGuncellemeleri),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success']) {
          return data['data'];
        } else {
          throw Exception(data['message']);
        }
      } else {
        throw Exception('Sunucu hatası: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Ayarlar güncellenemedi: $e');
    }
  }

  // Öneri uygula
  static Future<Map<String, dynamic>> oneriUygula(String oneriId, {double? etkinlikSkoru}) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final sohbetOturumu = prefs.getString('sohbetOturumu');
      
      if (sohbetOturumu == null) {
        throw Exception('Aktif sohbet oturumu bulunamadı');
      }

      final body = {
        'sohbetOturumu': sohbetOturumu,
        'oneriId': oneriId,
      };

      if (etkinlikSkoru != null) {
        body['etkinlikSkoru'] = etkinlikSkoru;
      }

      final response = await http.post(
        Uri.parse('$baseUrl/oneri-uygula'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(body),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success']) {
          return data['data'];
        } else {
          throw Exception(data['message']);
        }
      } else {
        throw Exception('Sunucu hatası: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Öneri uygulanamadı: $e');
    }
  }

  // İstatistikler getir
  static Future<Map<String, dynamic>> istatistiklerGetir() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/istatistikler'),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success']) {
          return data['data'];
        } else {
          throw Exception(data['message']);
        }
      } else {
        throw Exception('Sunucu hatası: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('İstatistikler getirilemedi: $e');
    }
  }

  // Aktif oturum var mı kontrol et
  static Future<bool> aktifOturumVarMi() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final sohbetOturumu = prefs.getString('sohbetOturumu');
      return sohbetOturumu != null;
    } catch (e) {
      return false;
    }
  }

  // Oturum bilgilerini getir
  static Future<Map<String, String?>> oturumBilgileriGetir() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return {
        'sohbetOturumu': prefs.getString('sohbetOturumu'),
        'kullaniciTipi': prefs.getString('kullaniciTipi'),
      };
    } catch (e) {
      return {'sohbetOturumu': null, 'kullaniciTipi': null};
    }
  }

  // Duygu skorunu renk sınıfına çevir
  static String duyguRenkSinifi(double skor) {
    if (skor > 0.2) return 'emotion-positive';
    if (skor < -0.2) return 'emotion-negative';
    return 'emotion-neutral';
  }

  // Duygu skorunu emoji ile göster
  static String duyguEmoji(double skor) {
    if (skor > 0.2) return '😊';
    if (skor < -0.2) return '😔';
    return '😐';
  }

  // Konu kategorisini Türkçe'ye çevir
  static String konuKategorisiTr(String kategori) {
    switch (kategori) {
      case 'development': return 'Gelişim';
      case 'behavior': return 'Davranış';
      case 'motivation': return 'Motivasyon';
      case 'health': return 'Sağlık';
      case 'academic': return 'Akademik';
      case 'social': return 'Sosyal';
      default: return kategori;
    }
  }

  // Kullanıcı tipini Türkçe'ye çevir
  static String kullaniciTipiTr(String tip) {
    switch (tip) {
      case 'child': return 'Çocuk';
      case 'parent': return 'Veli';
      default: return tip;
    }
  }

  // Öğrenme stilini Türkçe'ye çevir
  static String ogrenmeStiliTr(String stil) {
    switch (stil) {
      case 'görsel': return 'Görsel';
      case 'işitsel': return 'İşitsel';
      case 'kinestetik': return 'Kinestetik';
      case 'okuma-yazma': return 'Okuma-Yazma';
      default: return stil;
    }
  }

  // Görev kategorisini Türkçe'ye çevir
  static String gorevKategorisiTr(String kategori) {
    switch (kategori) {
      case 'akademik': return 'Akademik';
      case 'sosyal': return 'Sosyal';
      case 'duygusal': return 'Duygusal';
      case 'fiziksel': return 'Fiziksel';
      case 'yaratıcı': return 'Yaratıcı';
      default: return kategori;
    }
  }

  // Zorluk seviyesini Türkçe'ye çevir
  static String zorlukSeviyesiTr(String seviye) {
    switch (seviye) {
      case 'kolay': return 'Kolay';
      case 'orta': return 'Orta';
      case 'zor': return 'Zor';
      default: return seviye;
    }
  }

  // Oncelik seviyesini Türkçe'ye çevir
  static String oncelikSeviyesiTr(String oncelik) {
    switch (oncelik) {
      case 'düşük': return 'Düşük';
      case 'orta': return 'Orta';
      case 'yüksek': return 'Yüksek';
      default: return oncelik;
    }
  }
} 