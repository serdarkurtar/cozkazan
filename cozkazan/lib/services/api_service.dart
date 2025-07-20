import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants.dart';

// SINIF VE DERS LİSTESİ
Future<Map<String, List<String>>> getSinifDersListesi() async {
  try {
    final response = await http.get(Uri.parse('$baseUrl/api/sinif-ders-listesi'));
    if (response.statusCode == 200) {
      final Map<String, dynamic> data = jsonDecode(response.body);
      Map<String, List<String>> result = {};
      data.forEach((key, value) {
        result[key] = List<String>.from(value);
      });
      return result;
    }
    print('❌ Sınıf ders listesi hatası: ${response.statusCode}');
    return {};
  } catch (e) {
    print('❌ Sınıf ders listesi exception: $e');
    return {};
  }
}

// TESTLERİ GETİR
Future<List<dynamic>> getTestler(String sinif, String ders) async {
  try {
    final response = await http.get(Uri.parse('$baseUrl/api/testler/$sinif/$ders'));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    print('❌ Test listesi hatası: ${response.statusCode}');
    return [];
  } catch (e) {
    print('❌ Test listesi exception: $e');
    return [];
  }
}

// TEST SONUCU KAYDET
Future<Map<String, dynamic>?> saveTestSonuc(Map<String, dynamic> testSonucData) async {
  try {
    final response = await http.post(
      Uri.parse('$baseUrl/api/test-sonuc'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(testSonucData),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    print('❌ Test sonucu kaydetme hatası: ${response.statusCode}');
    return null;
  } catch (e) {
    print('❌ Test sonucu kaydetme exception: $e');
    return null;
  }
}

// KULLANICININ TEST SONUÇLARI
Future<List<dynamic>> getTestSonuclari(String userId) async {
  try {
    final response = await http.get(Uri.parse('$baseUrl/api/test-sonuclari/$userId'));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    print('❌ Test sonuçları hatası: ${response.statusCode}');
    return [];
  } catch (e) {
    print('❌ Test sonuçları exception: $e');
    return [];
  }
}

// HİKAYELER
Future<List<dynamic>> getHikayeler() async {
  try {
    final response = await http.get(Uri.parse('$baseUrl/api/hikayeler'));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    print('❌ Hikaye listesi hatası: ${response.statusCode}');
    return [];
  } catch (e) {
    print('❌ Hikaye listesi exception: $e');
    return [];
  }
}

// ÖDÜLLER
Future<List<dynamic>> getOduller() async {
  try {
    final response = await http.get(Uri.parse('$baseUrl/api/oduls'));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    print('❌ Ödül listesi hatası: ${response.statusCode}');
    return [];
  } catch (e) {
    print('❌ Ödül listesi exception: $e');
    return [];
  }
}

// SOSYAL GÖREVLER
Future<List<dynamic>> getSosyalGorevler() async {
  try {
    final response = await http.get(Uri.parse('$baseUrl/api/sosyalgorevs'));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    print('❌ Sosyal görev listesi hatası: ${response.statusCode}');
    return [];
  } catch (e) {
    print('❌ Sosyal görev listesi exception: $e');
    return [];
  }
}

// AİLE NOTLARI
Future<List<dynamic>> getAileNotlari() async {
  try {
    final response = await http.get(Uri.parse('$baseUrl/api/ailenotus'));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    print('❌ Aile notu listesi hatası: ${response.statusCode}');
    return [];
  } catch (e) {
    print('❌ Aile notu listesi exception: $e');
    return [];
  }
}

// TEST SORULARI
Future<List<dynamic>> getTestSorulari() async {
  try {
    final response = await http.get(Uri.parse('$baseUrl/api/testsorusus'));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    print('❌ Test soruları listesi hatası: ${response.statusCode}');
    return [];
  } catch (e) {
    print('❌ Test soruları listesi exception: $e');
    return [];
  }
}

// KULLANICI GİRİŞİ (login) - ENDPOINT DÜZELTİLDİ
Future<Map<String, dynamic>?> login(String telefon, String sifre) async {
  try {
    final response = await http.post(
      Uri.parse('$baseUrl/api/kullanicilar/giris'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'telefon': telefon, 'sifre': sifre}),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    print('❌ Giriş hatası: ${response.statusCode} - ${response.body}');
    return null;
  } catch (e) {
    print('❌ Giriş exception: $e');
    return null;
  }
}

// KULLANICI KAYIT - ENDPOINT DÜZELTİLDİ
Future<Map<String, dynamic>?> register(String ad, String soyad, String telefon, String sifre, String sinif) async {
  try {
    final response = await http.post(
      Uri.parse('$baseUrl/api/kullanicilar/kayit'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'ad': ad,
        'soyad': soyad,
        'telefon': telefon,
        'sifre': sifre,
        'sinif': sinif,
      }),
    );
    if (response.statusCode == 201) {
      return jsonDecode(response.body);
    }
    print('❌ Kayıt hatası: ${response.statusCode} - ${response.body}');
    return null;
  } catch (e) {
    print('❌ Kayıt exception: $e');
    return null;
  }
}

// XP GETİRME
Future<int> getXP(String childId) async {
  try {
    final response = await http.get(Uri.parse('$baseUrl/api/xp/$childId'));
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['xp'] ?? 0;
    }
    print('❌ XP getirme hatası: ${response.statusCode}');
    return 0;
  } catch (e) {
    print('❌ XP getirme exception: $e');
    return 0;
  }
}

// KİŞİSELLEŞTİRİLMİŞ YANIT ÜRET
Future<Map<String, dynamic>> getPersonalizedResponse(String childId, String message, Map<String, dynamic> context) async {
  try {
    final response = await http.post(
      Uri.parse('$baseUrl/api/kisisel-yanit/yanit-uret'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'childId': childId,
        'message': message,
        'context': context,
      }),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    print('❌ Kişiselleştirilmiş yanıt hatası: ${response.statusCode}');
    return {'success': false, 'message': 'Yanıt üretilemedi'};
  } catch (e) {
    print('❌ Kişiselleştirilmiş yanıt exception: $e');
    return {'success': false, 'message': 'Bağlantı hatası'};
  }
}

// ÇOCUK PROFİLİ GETİR
Future<Map<String, dynamic>?> getChildProfile(String childId) async {
  try {
    final response = await http.get(Uri.parse('$baseUrl/api/kisisel-yanit/profil/$childId'));
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['success'] == true ? data['profile'] : null;
    }
    print('❌ Profil getirme hatası: ${response.statusCode}');
    return null;
  } catch (e) {
    print('❌ Profil getirme exception: $e');
    return null;
  }
}

// ÇOCUK PROFİLİ OLUŞTUR/GÜNCELLE
Future<bool> createOrUpdateChildProfile(Map<String, dynamic> profileData) async {
  try {
    final response = await http.post(
      Uri.parse('$baseUrl/api/kisisel-yanit/profil'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(profileData),
    );
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['success'] == true;
    }
    print('❌ Profil oluşturma hatası: ${response.statusCode}');
    return false;
  } catch (e) {
    print('❌ Profil oluşturma exception: $e');
    return false;
  }
}

// ÇOCUK İSTATİSTİKLERİ GETİR
Future<Map<String, dynamic>?> getChildStats(String childId) async {
  try {
    final response = await http.get(Uri.parse('$baseUrl/api/kisisel-yanit/istatistikler/$childId'));
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['success'] == true ? data['stats'] : null;
    }
    print('❌ İstatistik getirme hatası: ${response.statusCode}');
    return null;
  } catch (e) {
    print('❌ İstatistik getirme exception: $e');
    return null;
  }
}

// YAŞ GRUBU ÖNERİLERİ GETİR
Future<Map<String, dynamic>?> getAgeRecommendations(String ageGroup) async {
  try {
    final response = await http.get(Uri.parse('$baseUrl/api/kisisel-yanit/yas-onerileri/$ageGroup'));
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['success'] == true ? data['templates'] : null;
    }
    print('❌ Yaş önerileri hatası: ${response.statusCode}');
    return null;
  } catch (e) {
    print('❌ Yaş önerileri exception: $e');
    return null;
  }
}

// ÖĞRENME STİLİ ÖNERİLERİ GETİR
Future<Map<String, dynamic>?> getLearningStyleRecommendations(String style) async {
  try {
    final response = await http.get(Uri.parse('$baseUrl/api/kisisel-yanit/ogrenme-stili/$style'));
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['success'] == true ? data['strategies'] : null;
    }
    print('❌ Öğrenme stili önerileri hatası: ${response.statusCode}');
    return null;
  } catch (e) {
    print('❌ Öğrenme stili önerileri exception: $e');
    return null;
  }
}

// TÜM PROFİLLERİ GETİR
Future<List<Map<String, dynamic>>> getAllProfiles() async {
  try {
    final response = await http.get(Uri.parse('$baseUrl/api/kisisel-yanit/profiller'));
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['success'] == true ? List<Map<String, dynamic>>.from(data['profiles']) : [];
    }
    print('❌ Profiller getirme hatası: ${response.statusCode}');
    return [];
  } catch (e) {
    print('❌ Profiller getirme exception: $e');
    return [];
  }
}

// XP GÜNCELLEME
Future<bool> updateXP(String childId, int newXP) async {
  try {
    final response = await http.put(
      Uri.parse('$baseUrl/api/xp/$childId'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'xp': newXP}),
    );
    if (response.statusCode == 200) {
      print('✅ XP güncellendi: $newXP');
      return true;
    }
    print('❌ XP güncelleme hatası: ${response.statusCode}');
    return false;
  } catch (e) {
    print('❌ XP güncelleme exception: $e');
    return false;
  }
}

// AI CHAT GÖNDERME
Future<bool> sendAiChat(String childId, String message, String role) async {
  try {
    final response = await http.post(
      Uri.parse('$baseUrl/api/ai-chat'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'childId': childId,
        'message': message,
        'role': role,
      }),
    );
    if (response.statusCode == 201) {
      print('✅ AI Chat gönderildi');
      return true;
    }
    print('❌ AI Chat gönderme hatası: ${response.statusCode}');
    return false;
  } catch (e) {
    print('❌ AI Chat gönderme exception: $e');
    return false;
  }
}

// AI CHAT GETİRME
Future<List<dynamic>> getAiChats(String childId) async {
  try {
    final response = await http.get(Uri.parse('$baseUrl/api/ai-chat/$childId'));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    print('❌ AI Chat getirme hatası: ${response.statusCode}');
    return [];
  } catch (e) {
    print('❌ AI Chat getirme exception: $e');
    return [];
  }
}

// HİKAYE EKLEME
Future<bool> addHikaye(Map<String, dynamic> hikayeData) async {
  try {
    final response = await http.post(
      Uri.parse('$baseUrl/api/hikayeler'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(hikayeData),
    );
    if (response.statusCode == 201) {
      print('✅ Hikaye eklendi');
      return true;
    }
    print('❌ Hikaye ekleme hatası: ${response.statusCode}');
    return false;
  } catch (e) {
    print('❌ Hikaye ekleme exception: $e');
    return false;
  }
}

// TEST SORUSU EKLEME
Future<bool> addTestSorusu(Map<String, dynamic> soruData) async {
  try {
    final response = await http.post(
      Uri.parse('$baseUrl/api/testsorusus'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(soruData),
    );
    if (response.statusCode == 201) {
      print('✅ Test sorusu eklendi');
      return true;
    }
    print('❌ Test sorusu ekleme hatası: ${response.statusCode}');
    return false;
  } catch (e) {
    print('❌ Test sorusu ekleme exception: $e');
    return false;
  }
}