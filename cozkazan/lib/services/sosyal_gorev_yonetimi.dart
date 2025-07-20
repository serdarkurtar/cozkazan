import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../data/sosyal_gorevler.dart';
import 'test_yonetimi.dart';

class SosyalGorevYonetimi {
  static const String _gorevlerKey = 'sosyal_gorevler';
  static const String _bekleyenOnaylarKey = 'bekleyen_onaylar';

  // Tüm görevleri getir
  static Future<List<SosyalGorev>> tumGorevleriGetir() async {
    final prefs = await SharedPreferences.getInstance();
    final gorevlerJson = prefs.getString(_gorevlerKey);
    
    if (gorevlerJson != null) {
      List<dynamic> jsonList = jsonDecode(gorevlerJson);
      return jsonList.map((json) => SosyalGorev.fromJson(json)).toList();
    }
    
    // İlk kez çalıştırılıyorsa varsayılan görevleri ekle
    List<SosyalGorev> varsayilanGorevler = SosyalGorevVerileri.varsayilanGorevler;
    await gorevleriKaydet(varsayilanGorevler);
    return varsayilanGorevler;
  }

  // Görevleri kaydet
  static Future<void> gorevleriKaydet(List<SosyalGorev> gorevler) async {
    final prefs = await SharedPreferences.getInstance();
    List<Map<String, dynamic>> gorevlerJson = gorevler.map((g) => g.toJson()).toList();
    await prefs.setString(_gorevlerKey, jsonEncode(gorevlerJson));
  }

  // Yeni görev ekle
  static Future<void> gorevEkle(SosyalGorev gorev) async {
    List<SosyalGorev> gorevler = await tumGorevleriGetir();
    gorevler.add(gorev);
    await gorevleriKaydet(gorevler);
  }

  // Görev güncelle
  static Future<void> gorevGuncelle(SosyalGorev guncelGorev) async {
    List<SosyalGorev> gorevler = await tumGorevleriGetir();
    int index = gorevler.indexWhere((g) => g.id == guncelGorev.id);
    
    if (index != -1) {
      gorevler[index] = guncelGorev;
      await gorevleriKaydet(gorevler);
    }
  }

  // Görev tamamla (çocuk tarafından)
  static Future<void> gorevTamamla(String gorevId) async {
    List<SosyalGorev> gorevler = await tumGorevleriGetir();
    int index = gorevler.indexWhere((g) => g.id == gorevId);
    
    if (index != -1) {
      SosyalGorev gorev = gorevler[index];
      SosyalGorev guncelGorev = gorev.copyWith(
        tamamlandi: true,
        tamamlanmaTarihi: DateTime.now(),
      );
      gorevler[index] = guncelGorev;
      await gorevleriKaydet(gorevler);
      
      // Bekleyen onaylar listesine ekle
      await bekleyenOnayaEkle(gorevId);
    }
  }

  // Veli onayı ver
  static Future<void> veliOnayiVer(String gorevId) async {
    List<SosyalGorev> gorevler = await tumGorevleriGetir();
    int index = gorevler.indexWhere((g) => g.id == gorevId);
    
    if (index != -1) {
      SosyalGorev gorev = gorevler[index];
      SosyalGorev guncelGorev = gorev.copyWith(
        veliOnayi: true,
      );
      gorevler[index] = guncelGorev;
      await gorevleriKaydet(gorevler);
      
      // XP ödülü ver
      await TestYonetimi.xpEkle(gorev.xpOdulu);
      
      // Bekleyen onaylar listesinden çıkar
      await bekleyenOnaydanCikar(gorevId);
    }
  }

  // Veli onayını reddet
  static Future<void> veliOnayiniReddet(String gorevId) async {
    List<SosyalGorev> gorevler = await tumGorevleriGetir();
    int index = gorevler.indexWhere((g) => g.id == gorevId);
    
    if (index != -1) {
      SosyalGorev gorev = gorevler[index];
      SosyalGorev guncelGorev = gorev.copyWith(
        tamamlandi: false,
        tamamlanmaTarihi: null,
      );
      gorevler[index] = guncelGorev;
      await gorevleriKaydet(gorevler);
      
      // Bekleyen onaylar listesinden çıkar
      await bekleyenOnaydanCikar(gorevId);
    }
  }

  // Bekleyen onayları getir
  static Future<List<String>> bekleyenOnaylariGetir() async {
    final prefs = await SharedPreferences.getInstance();
    final onaylarJson = prefs.getString(_bekleyenOnaylarKey);
    
    if (onaylarJson != null) {
      List<dynamic> jsonList = jsonDecode(onaylarJson);
      return jsonList.map((json) => json.toString()).toList();
    }
    
    return [];
  }

  // Bekleyen onaya ekle
  static Future<void> bekleyenOnayaEkle(String gorevId) async {
    List<String> bekleyenOnaylar = await bekleyenOnaylariGetir();
    if (!bekleyenOnaylar.contains(gorevId)) {
      bekleyenOnaylar.add(gorevId);
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_bekleyenOnaylarKey, jsonEncode(bekleyenOnaylar));
    }
  }

  // Bekleyen onaydan çıkar
  static Future<void> bekleyenOnaydanCikar(String gorevId) async {
    List<String> bekleyenOnaylar = await bekleyenOnaylariGetir();
    bekleyenOnaylar.remove(gorevId);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_bekleyenOnaylarKey, jsonEncode(bekleyenOnaylar));
  }

  // Kategoriye göre görevleri getir
  static Future<List<SosyalGorev>> kategoriyeGoreGorevlerGetir(String kategori) async {
    List<SosyalGorev> tumGorevler = await tumGorevleriGetir();
    return tumGorevler.where((g) => g.kategori == kategori).toList();
  }

  // Tamamlanan görevleri getir
  static Future<List<SosyalGorev>> tamamlananGorevleriGetir() async {
    List<SosyalGorev> tumGorevler = await tumGorevleriGetir();
    return tumGorevler.where((g) => g.tamamlandi && g.veliOnayi).toList();
  }

  // Bekleyen görevleri getir
  static Future<List<SosyalGorev>> bekleyenGorevleriGetir() async {
    List<SosyalGorev> tumGorevler = await tumGorevleriGetir();
    return tumGorevler.where((g) => g.tamamlandi && !g.veliOnayi).toList();
  }

  // Görev istatistikleri
  static Future<Map<String, dynamic>> gorevIstatistikleriGetir() async {
    List<SosyalGorev> tumGorevler = await tumGorevleriGetir();
    List<SosyalGorev> tamamlananGorevler = await tamamlananGorevleriGetir();
    List<SosyalGorev> bekleyenGorevler = await bekleyenGorevleriGetir();
    
    int toplamXp = tamamlananGorevler.fold(0, (sum, g) => sum + g.xpOdulu);
    
    return {
      'toplamGorev': tumGorevler.length,
      'tamamlananGorev': tamamlananGorevler.length,
      'bekleyenGorev': bekleyenGorevler.length,
      'toplamXp': toplamXp,
      'tamamlanmaOrani': tumGorevler.isNotEmpty ? (tamamlananGorevler.length / tumGorevler.length) * 100 : 0,
    };
  }

  // Manuel görev ekle (veli tarafından)
  static Future<void> manuelGorevEkle(String baslik, String aciklama, int xpOdulu, String kategori) async {
    String id = 'manuel_${DateTime.now().millisecondsSinceEpoch}';
    SosyalGorev yeniGorev = SosyalGorev(
      id: id,
      baslik: baslik,
      aciklama: aciklama,
      xpOdulu: xpOdulu,
      kategori: kategori,
      manuelGorev: true,
      olusturmaTarihi: DateTime.now(),
    );
    
    await gorevEkle(yeniGorev);
  }
} 