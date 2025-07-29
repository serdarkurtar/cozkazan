import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../data/aile_notlari.dart';

class AileNotlariServisi {
  static const String _notlarKey = 'aile_notlari';

  static Future<List<AileNotu>> tumNotlariGetir() async {
    final prefs = await SharedPreferences.getInstance();
    final notlarJson = prefs.getString(_notlarKey);
    if (notlarJson != null) {
      List<dynamic> jsonList = jsonDecode(notlarJson);
      return jsonList.map((json) => AileNotu.fromJson(json)).toList();
    }
    return [];
  }

  static Future<void> notEkle(String gonderen, String mesaj) async {
    List<AileNotu> notlar = await tumNotlariGetir();
    final yeniNot = AileNotu(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      gonderen: gonderen,
      mesaj: mesaj,
      tarih: DateTime.now(),
    );
    notlar.add(yeniNot);
    await _notlariKaydet(notlar);
  }

  static Future<void> _notlariKaydet(List<AileNotu> notlar) async {
    final prefs = await SharedPreferences.getInstance();
    List<Map<String, dynamic>> notlarJson = notlar.map((n) => n.toJson()).toList();
    await prefs.setString(_notlarKey, jsonEncode(notlarJson));
  }

  static Future<void> notSil(String id) async {
    List<AileNotu> notlar = await tumNotlariGetir();
    notlar.removeWhere((n) => n.id == id);
    await _notlariKaydet(notlar);
  }
} 