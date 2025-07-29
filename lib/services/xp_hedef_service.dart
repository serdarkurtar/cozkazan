import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants.dart';

class XpHedefi {
  final String? id;
  final String childId;
  final int hedefXp;
  final String odulAd;
  final String aciklama;
  final bool tamamlandi;
  final DateTime? tamamlanmaTarihi;
  final DateTime? olusturmaTarihi;

  XpHedefi({
    this.id,
    required this.childId,
    required this.hedefXp,
    required this.odulAd,
    required this.aciklama,
    this.tamamlandi = false,
    this.tamamlanmaTarihi,
    this.olusturmaTarihi,
  });

  factory XpHedefi.fromJson(Map<String, dynamic> json) {
    return XpHedefi(
      id: json['_id'],
      childId: json['childId'],
      hedefXp: json['hedefXp'],
      odulAd: json['odulAd'],
      aciklama: json['aciklama'],
      tamamlandi: json['tamamlandi'] ?? false,
      tamamlanmaTarihi: json['tamamlanmaTarihi'] != null 
          ? DateTime.parse(json['tamamlanmaTarihi']) 
          : null,
      olusturmaTarihi: json['olusturmaTarihi'] != null 
          ? DateTime.parse(json['olusturmaTarihi']) 
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'childId': childId,
      'hedefXp': hedefXp,
      'odulAd': odulAd,
      'aciklama': aciklama,
      'tamamlandi': tamamlandi,
      'tamamlanmaTarihi': tamamlanmaTarihi?.toIso8601String(),
      'olusturmaTarihi': olusturmaTarihi?.toIso8601String(),
    };
  }
}

class XpHedefService {
  static const String baseUrl = 'http://localhost:3000';

  // Çocuğun hedeflerini getir
  static Future<List<XpHedefi>> hedefleriGetir(String childId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/xp-hedefleri?childId=$childId'),
      );
      if (response.statusCode == 200) {
        List<dynamic> data = json.decode(response.body);
        return data.map((json) => XpHedefi.fromJson(json)).toList();
      } else {
        throw Exception('Sunucu hatası: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Bağlantı hatası: $e');
    }
  }

  // Yeni hedef ekle
  static Future<XpHedefi> hedefEkle(XpHedefi hedef) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/xp-hedefleri'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(hedef.toJson()),
      );
      if (response.statusCode == 201) {
        return XpHedefi.fromJson(json.decode(response.body));
      } else {
        throw Exception('Hedef eklenemedi: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Bağlantı hatası: $e');
    }
  }

  // Hedef güncelle
  static Future<XpHedefi> hedefGuncelle(String id, XpHedefi hedef) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/api/xp-hedefleri/$id'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(hedef.toJson()),
      );
      if (response.statusCode == 200) {
        return XpHedefi.fromJson(json.decode(response.body));
      } else {
        throw Exception('Hedef güncellenemedi: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Bağlantı hatası: $e');
    }
  }

  // Hedef sil
  static Future<void> hedefSil(String id) async {
    try {
      final response = await http.delete(Uri.parse('$baseUrl/api/xp-hedefleri/$id'));
      if (response.statusCode != 200) {
        throw Exception('Hedef silinemedi: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Bağlantı hatası: $e');
    }
  }

  // İlerleme yüzdesini hesapla (örnek: çocuğun mevcut XP'si)
  static double ilerlemeHesapla(XpHedefi hedef, int mevcutXp) {
    if (hedef.hedefXp <= 0) return 0.0;
    double yuzde = (mevcutXp / hedef.hedefXp) * 100;
    return yuzde > 100 ? 100.0 : yuzde;
  }
} 