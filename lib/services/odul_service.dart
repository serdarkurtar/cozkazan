import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants.dart';

class Odul {
  final String? id;
  final String ad;
  final String aciklama;
  final int hedefXp;
  final bool tamamlandi;
  final DateTime? tamamlanmaTarihi;

  Odul({
    this.id,
    required this.ad,
    required this.aciklama,
    required this.hedefXp,
    this.tamamlandi = false,
    this.tamamlanmaTarihi,
  });

  factory Odul.fromJson(Map<String, dynamic> json) {
    return Odul(
      id: json['_id'],
      ad: json['ad'],
      aciklama: json['aciklama'],
      hedefXp: json['hedefXp'],
      tamamlandi: json['tamamlandi'] ?? false,
      tamamlanmaTarihi: json['tamamlanmaTarihi'] != null 
          ? DateTime.parse(json['tamamlanmaTarihi']) 
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'ad': ad,
      'aciklama': aciklama,
      'hedefXp': hedefXp,
      'tamamlandi': tamamlandi,
      'tamamlanmaTarihi': tamamlanmaTarihi?.toIso8601String(),
    };
  }
}

class OdulService {
  // Tüm ödülleri getir
  static Future<List<Odul>> odulleriGetir() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/api/oduls'));
      if (response.statusCode == 200) {
        List<dynamic> data = json.decode(response.body);
        return data.map((json) => Odul.fromJson(json)).toList();
      } else {
        throw Exception('Sunucu hatası: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Bağlantı hatası: $e');
    }
  }

  // Yeni ödül ekle
  static Future<Odul> odulEkle(Odul odul) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/oduls'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(odul.toJson()),
      );
      if (response.statusCode == 201) {
        return Odul.fromJson(json.decode(response.body));
      } else {
        throw Exception('Ödül eklenemedi: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Bağlantı hatası: $e');
    }
  }

  // Ödül güncelle
  static Future<Odul> odulGuncelle(String id, Odul odul) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/api/oduls/$id'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(odul.toJson()),
      );
      if (response.statusCode == 200) {
        return Odul.fromJson(json.decode(response.body));
      } else {
        throw Exception('Ödül güncellenemedi: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Bağlantı hatası: $e');
    }
  }

  // Ödül sil
  static Future<void> odulSil(String id) async {
    try {
      final response = await http.delete(Uri.parse('$baseUrl/api/oduls/$id'));
      if (response.statusCode != 200) {
        throw Exception('Ödül silinemedi: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Bağlantı hatası: $e');
    }
  }
} 