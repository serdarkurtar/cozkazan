import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants.dart';
import 'firebase_service.dart';

// SINIF VE DERS LİSTESİ
Future<Map<String, List<String>>> getSinifDersListesi() async {
  try {
    // FirebaseService kullan
    final result = await FirebaseService.getSinifDersListesi();
    print('✅ Sınıf ders listesi alındı: ${result.length} sınıf');
    return result;
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

// HİKAYE OKUMA TAMAMLAMA
Future<Map<String, dynamic>> okumaTamamla(String childId, String hikayeId) async {
  try {
    final response = await http.post(
      Uri.parse('$baseUrl/api/hikaye-okuma-tamamla'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'childId': childId,
        'hikayeId': hikayeId,
      }),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    print('❌ Hikaye okuma tamamla hatası: ${response.statusCode}');
    return {'basarili': false, 'hata': 'Sunucu hatası'};
  } catch (e) {
    print('❌ Hikaye okuma tamamla exception: $e');
    return {'basarili': false, 'hata': e.toString()};
  }
}

// VELİ İSTATİSTİKLERİ
Future<Map<String, dynamic>> veliIstatistikleri() async {
  final response = await http.get(Uri.parse('$baseUrl/api/veli-istatistikler'));
  if (response.statusCode == 200) {
    return jsonDecode(response.body);
  }
  throw Exception('Veli istatistikleri alınamadı');
}

Future<Map<String, dynamic>> sehirBazliKullanicilar() async {
  final response = await http.get(Uri.parse('$baseUrl/api/sehir-bazli-kullanicilar'));
  if (response.statusCode == 200) {
    return jsonDecode(response.body);
  }
  throw Exception('Şehir bazlı kullanıcılar alınamadı');
}

// Genel GET fonksiyonu
Future<dynamic> get(String url) async {
  final response = await http.get(Uri.parse('$baseUrl$url'));
  if (response.statusCode == 200) {
    return jsonDecode(response.body);
  }
  throw Exception('GET isteği başarısız: $url');
}

// Genel POST fonksiyonu
Future<dynamic> post(String url, dynamic data) async {
  final response = await http.post(
    Uri.parse('$baseUrl$url'),
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode(data),
  );
  if (response.statusCode == 200 || response.statusCode == 201) {
    return jsonDecode(response.body);
  }
  throw Exception('POST isteği başarısız: $url');
}

// AI Mentor için özel fonksiyonlar (örnek, backend API'ne göre düzenle)
Future<String> getAIMentorYaniti(String mesaj, {String? childId}) async {
  final response = await post('/ai-mentor/yanit', {
    'mesaj': mesaj,
    'childId': childId,
  });
  return response['yanit'] ?? '';
}

Future<void> kaydetAIMesaji(Map<String, dynamic> messageData) async {
  await post('/ai-mentor/mesaj-kaydet', messageData);
}

Future<void> postInsights(dynamic insights) async {
  await post('/ai-analiz/insights', insights);
}

Future<void> postFeedback(dynamic feedback) async {
  await post('/ai-analiz/feedback', feedback);
}



// SINIFLARI GETİR
Future<List<String>> getSiniflar() async {
  try {
    // FirebaseService kullan
    final sinifDersListesi = await FirebaseService.getSinifDersListesi();
    final siniflar = sinifDersListesi.keys.toList();
    print('✅ ${siniflar.length} sınıf bulundu');
    return siniflar;
  } catch (e) {
    print('❌ Sınıf listesi exception: $e');
    return [];
  }
}

// DERSLERİ GETİR
Future<List<String>> getDersler(String sinif) async {
  try {
    // FirebaseService kullan
    final sinifDersListesi = await FirebaseService.getSinifDersListesi();
    final dersler = sinifDersListesi[sinif] ?? [];
    print('✅ ${dersler.length} ders bulundu: $sinif');
    return dersler;
  } catch (e) {
    print('❌ Ders listesi exception: $e');
    return [];
  }
}

// KONULARI GETİR
Future<List<String>> getKonular(String sinif, String ders) async {
  try {
    // FirebaseService kullan
    final konular = await FirebaseService.getKonular(sinif, ders);
    print('✅ ${konular.length} konu bulundu: $sinif - $ders');
    return konular;
  } catch (e) {
    print('❌ Konu listesi exception: $e');
    return [];
  }
}

// VELİ TEST AYARLARINI GETİR
Future<Map<String, dynamic>?> getVeliTestAyarlari(String parentId) async {
  try {
    final response = await http.get(Uri.parse('$baseUrl/api/veli-test-ayarlari/$parentId'));
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data;
    }
    print('❌ Veli test ayarları hatası: ${response.statusCode}');
    return null;
  } catch (e) {
    print('❌ Veli test ayarları exception: $e');
    return null;
  }
}

// VELİ TEST AYARLARINI KAYDET
Future<void> saveVeliTestAyarlari(String parentId, Map<String, dynamic> ayarlar) async {
  try {
    final response = await http.post(
      Uri.parse('$baseUrl/api/veli-test-ayarlari'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(ayarlar),
    );
    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('Test ayarları kaydedilemedi: ${response.statusCode}');
    }
  } catch (e) {
    print('❌ Test ayarları kaydetme exception: $e');
    rethrow;
  }
}

// ÇOCUK İÇİN VELİNİN SEÇTİĞİ TESTLERİ GETİR
Future<List<dynamic>> getCocukTestleri(String childId) async {
  try {
    print('🌐 API çağrısı: $baseUrl/api/cocuk-testleri/$childId');
    final response = await http.get(Uri.parse('$baseUrl/api/cocuk-testleri/$childId'));
    print('📡 Response status: ${response.statusCode}');
    print('📄 Response body: ${response.body}');
    
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      print('✅ API basarili, donen veri: $data');
      return data;
    }
    print('❌ Cocuk testleri hatasi: ${response.statusCode}');
    print('❌ Hata detayi: ${response.body}');
    return [];
  } catch (e) {
    print('❌ Çocuk testleri exception: $e');
    return [];
  }
}

// KONUYA GÖRE TESTLERİ GETİR
Future<List<String>> getTestlerByKonu(String sinif, String ders, String konu) async {
  try {
    // FirebaseService kullan
    final testler = await FirebaseService.getTestler(sinif, ders, konu);
    print('✅ ${testler.length} test bulundu: $sinif - $ders - $konu');
    return testler;
  } catch (e) {
    print('❌ Test listesi exception: $e');
    return [];
  }
}