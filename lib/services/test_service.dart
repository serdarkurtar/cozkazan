import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../constants.dart';

class TestService {
  static const Duration timeout = Duration(seconds: 10);

  // Tüm testleri sunucudan getir
  static Future<List<TestSorusu>> getTestler() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/testler'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(timeout);

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => TestSorusu.fromJson(json)).toList();
      } else {
        throw Exception('Testler alınamadı: ${response.statusCode}');
      }
    } catch (e) {
      print('Test getirme hatası: $e');
      throw Exception('Sunucudan test verisi alınamadı');
    }
  }

  // Kategoriye göre testleri getir
  static Future<List<TestSorusu>> getTestlerByKategori(String kategori) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/testler?kategori=$kategori'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(timeout);

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => TestSorusu.fromJson(json)).toList();
      } else {
        throw Exception('Kategori testleri alınamadı: ${response.statusCode}');
      }
    } catch (e) {
      print('Kategori test getirme hatası: $e');
      throw Exception('Sunucudan kategori testleri alınamadı');
    }
  }

  // Seviyeye göre testleri getir
  static Future<List<TestSorusu>> getTestlerBySeviye(int seviye) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/testler?seviye=$seviye'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(timeout);

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => TestSorusu.fromJson(json)).toList();
      } else {
        throw Exception('Seviye testleri alınamadı: ${response.statusCode}');
      }
    } catch (e) {
      print('Seviye test getirme hatası: $e');
      throw Exception('Sunucudan seviye testleri alınamadı');
    }
  }

  // Zorluk seviyesine göre testleri getir
  static Future<List<TestSorusu>> getTestlerByZorluk(String zorluk) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/testler?zorluk=$zorluk'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(timeout);

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => TestSorusu.fromJson(json)).toList();
      } else {
        throw Exception('Zorluk testleri alınamadı: ${response.statusCode}');
      }
    } catch (e) {
      print('Zorluk test getirme hatası: $e');
      throw Exception('Sunucudan zorluk testleri alınamadı');
    }
  }

  // Test sonucunu sunucuya gönder
  static Future<bool> testSonucuGonder(Map<String, dynamic> sonuc) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/test-sonuclari'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(sonuc),
      ).timeout(timeout);

      return response.statusCode == 200 || response.statusCode == 201;
    } catch (e) {
      print('Test sonucu gönderme hatası: $e');
      return false;
    }
  }

  // Test sonucunu kaydet (eski metod adı için uyumluluk)
  static Future<bool> kaydetTestSonucu(Map<String, dynamic> sonuc) async {
    return await testSonucuGonder(sonuc);
  }

  // Test istatistiklerini getir
  static Future<Map<String, dynamic>> getTestIstatistikleri(String userId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/test-istatistikleri/$userId'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(timeout);

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Test istatistikleri alınamadı: ${response.statusCode}');
      }
    } catch (e) {
      print('Test istatistikleri getirme hatası: $e');
      throw Exception('Sunucudan test istatistikleri alınamadı');
    }
  }

  // Rastgele test soruları getir
  static Future<List<TestSorusu>> getRastgeleTestler({
    required int sinif,
    required String ders,
    required String zorluk,
    int soruSayisi = 10,
  }) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/testler/rastgele?sinif=$sinif&ders=$ders&zorluk=$zorluk&soruSayisi=$soruSayisi'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(timeout);

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => TestSorusu.fromJson(json)).toList();
      } else {
        throw Exception('Rastgele testler alınamadı: ${response.statusCode}');
      }
    } catch (e) {
      print('Rastgele test getirme hatası: $e');
      // Fallback olarak local verileri kullan
      return TestVerileri.getRastgeleSorular(
        sinif: sinif,
        ders: ders,
        zorluk: zorluk,
        soruSayisi: soruSayisi,
      );
    }
  }
} 