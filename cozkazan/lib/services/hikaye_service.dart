import 'dart:convert';
import 'package:http/http.dart' as http;
import '../data/hikayeler.dart';
import '../constants.dart';

class HikayeService {
  static const Duration timeout = Duration(seconds: 10);

  // Tüm hikayeleri sunucudan getir
  static Future<List<Hikaye>> getHikayeler() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/hikayeler'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(timeout);

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => Hikaye.fromJson(json)).toList();
      } else {
        throw Exception('Hikayeler alınamadı: ${response.statusCode}');
      }
    } catch (e) {
      print('Hikaye getirme hatası: $e');
      throw Exception('Sunucudan hikaye verisi alınamadı');
    }
  }

  // Kategoriye göre hikayeleri getir
  static Future<List<Hikaye>> getHikayelerByKategori(String kategori) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/hikayeler?kategori=$kategori'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(timeout);

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => Hikaye.fromJson(json)).toList();
      } else {
        throw Exception('Kategori hikayeleri alınamadı: ${response.statusCode}');
      }
    } catch (e) {
      print('Kategori hikaye getirme hatası: $e');
      throw Exception('Sunucudan kategori hikayeleri alınamadı');
    }
  }

  // Seviyeye göre hikayeleri getir
  static Future<List<Hikaye>> getHikayelerBySeviye(int seviye) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/hikayeler?seviye=$seviye'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(timeout);

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => Hikaye.fromJson(json)).toList();
      } else {
        throw Exception('Seviye hikayeleri alınamadı: ${response.statusCode}');
      }
    } catch (e) {
      print('Seviye hikaye getirme hatası: $e');
      throw Exception('Sunucudan seviye hikayeleri alınamadı');
    }
  }

  // Tek hikaye getir
  static Future<Hikaye?> getHikayeById(String hikayeId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/hikayeler/$hikayeId'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(timeout);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return Hikaye.fromJson(data);
      } else if (response.statusCode == 404) {
        return null;
      } else {
        throw Exception('Hikaye alınamadı: ${response.statusCode}');
      }
    } catch (e) {
      print('Tek hikaye getirme hatası: $e');
      throw Exception('Sunucudan hikaye detayı alınamadı');
    }
  }

  // Hikaye arama
  static Future<List<Hikaye>> searchHikayeler(String query) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/hikayeler?search=$query'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(timeout);

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => Hikaye.fromJson(json)).toList();
      } else {
        throw Exception('Hikaye arama hatası: ${response.statusCode}');
      }
    } catch (e) {
      print('Hikaye arama hatası: $e');
      throw Exception('Sunucudan arama sonuçları alınamadı');
    }
  }

  // Popüler hikayeleri getir
  static Future<List<Hikaye>> getPopulerHikayeler() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/hikayeler?populer=true'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(timeout);

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => Hikaye.fromJson(json)).toList();
      } else {
        throw Exception('Popüler hikayeler alınamadı: ${response.statusCode}');
      }
    } catch (e) {
      print('Popüler hikaye getirme hatası: $e');
      throw Exception('Sunucudan popüler hikayeler alınamadı');
    }
  }

  // Yeni hikayeleri getir
  static Future<List<Hikaye>> getYeniHikayeler() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/hikayeler?yeni=true'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(timeout);

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => Hikaye.fromJson(json)).toList();
      } else {
        throw Exception('Yeni hikayeler alınamadı: ${response.statusCode}');
      }
    } catch (e) {
      print('Yeni hikaye getirme hatası: $e');
      throw Exception('Sunucudan yeni hikayeler alınamadı');
    }
  }
}