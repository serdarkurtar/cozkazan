import 'package:shared_preferences/shared_preferences.dart';

class VeliKontrolService {
  static const String _sifreKey = 'veli_sifresi';
  static const String _ekranSuresiKey = 'ekran_suresi_dakika';
  static const String _cocukModuKey = 'cocuk_modu_aktif';
  static const String _varsayilanSifre = '123456'; // Varsayılan şifre

  // Veli şifresini kaydet
  static Future<void> veliSifresiKaydet(String sifre) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_sifreKey, sifre);
  }

  // Veli şifresini kontrol et
  static Future<bool> veliSifresiKontrol(String sifre) async {
    final prefs = await SharedPreferences.getInstance();
    final kayitliSifre = prefs.getString(_sifreKey);
    
    // Eğer kayıtlı şifre yoksa varsayılan şifreyi kullan
    if (kayitliSifre == null) {
      return sifre == _varsayilanSifre;
    }
    
    return kayitliSifre == sifre;
  }

  // Veli şifresini sıfırla (varsayılan şifreye döndür)
  static Future<void> veliSifresiSifirla() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_sifreKey);
  }

  // Varsayılan şifreyi al
  static String getVarsayilanSifre() {
    return _varsayilanSifre;
  }

  // Ekran süresini kaydet (dakika)
  static Future<void> ekranSuresiKaydet(int dakika) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(_ekranSuresiKey, dakika);
  }

  // Ekran süresini al
  static Future<int> ekranSuresiAl() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(_ekranSuresiKey) ?? 30; // Varsayılan 30 dakika
  }

  // Çocuk modunu aktif/pasif yap
  static Future<void> cocukModuAyarla(bool aktif) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_cocukModuKey, aktif);
  }

  // Çocuk modu aktif mi?
  static Future<bool> cocukModuAktifMi() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_cocukModuKey) ?? false;
  }
}