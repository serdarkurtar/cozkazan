class GelisimVerisi {
  final int xp;
  final int seviye;
  final int tamamlananTest;
  final int okunanHikaye;
  final int gunlukSeri;

  GelisimVerisi({
    required this.xp,
    required this.seviye,
    required this.tamamlananTest,
    required this.okunanHikaye,
    required this.gunlukSeri,
  });
}

class GelisimGrafik {
  static final List<GelisimVerisi> _haftalikVeri = [
    GelisimVerisi(xp: 800, seviye: 4, tamamlananTest: 2, okunanHikaye: 1, gunlukSeri: 1),
    GelisimVerisi(xp: 950, seviye: 4, tamamlananTest: 3, okunanHikaye: 2, gunlukSeri: 1),
    GelisimVerisi(xp: 1100, seviye: 5, tamamlananTest: 1, okunanHikaye: 3, gunlukSeri: 1),
    GelisimVerisi(xp: 1200, seviye: 5, tamamlananTest: 4, okunanHikaye: 1, gunlukSeri: 1),
    GelisimVerisi(xp: 1300, seviye: 5, tamamlananTest: 2, okunanHikaye: 2, gunlukSeri: 1),
    GelisimVerisi(xp: 1400, seviye: 5, tamamlananTest: 3, okunanHikaye: 1, gunlukSeri: 1),
    GelisimVerisi(xp: 1500, seviye: 6, tamamlananTest: 2, okunanHikaye: 3, gunlukSeri: 1),
  ];

  // Haftalık XP verilerini getir
  static List<GelisimVerisi> getHaftalikXpVerisi() {
    return _haftalikVeri;
  }

  // Günlük aktivite verilerini getir
  static List<Map<String, dynamic>> getGunlukAktiviteVerisi() {
    return _haftalikVeri.map((veri) => {
      'tarih': DateTime.now().subtract(const Duration(days: 6)), // Placeholder, actual date is not stored
      'test': veri.tamamlananTest,
      'hikaye': veri.okunanHikaye,
    }).toList();
  }

  // Seviye ilerleme verilerini getir
  static List<Map<String, dynamic>> getSeviyeIlerlemeVerisi() {
    return _haftalikVeri.map((veri) => {
      'tarih': DateTime.now().subtract(const Duration(days: 6)), // Placeholder, actual date is not stored
      'seviye': veri.seviye,
    }).toList();
  }

  // Haftalık özet istatistikler
  static Map<String, dynamic> getHaftalikOzet() {
    int toplamXp = _haftalikVeri.last.xp - _haftalikVeri.first.xp;
    int toplamTest = _haftalikVeri.fold(0, (sum, veri) => sum + veri.tamamlananTest);
    int toplamHikaye = _haftalikVeri.fold(0, (sum, veri) => sum + veri.okunanHikaye);
    int seviyeArtisi = _haftalikVeri.last.seviye - _haftalikVeri.first.seviye;

    return {
      'toplamXp': toplamXp,
      'toplamTest': toplamTest,
      'toplamHikaye': toplamHikaye,
      'seviyeArtisi': seviyeArtisi,
      'ortalamaGunlukXp': toplamXp ~/ 7,
      'ortalamaGunlukTest': toplamTest ~/ 7,
      'ortalamaGunlukHikaye': toplamHikaye ~/ 7,
    };
  }

  // En iyi günü bul
  static GelisimVerisi getEnIyiGun() {
    return _haftalikVeri.reduce((a, b) => a.xp > b.xp ? a : b);
  }

  // En aktif günü bul
  static GelisimVerisi getEnAktifGun() {
    return _haftalikVeri.reduce((a, b) {
      int aToplam = a.tamamlananTest + a.okunanHikaye;
      int bToplam = b.tamamlananTest + b.okunanHikaye;
      return aToplam > bToplam ? a : b;
    });
  }

  // Performans değerlendirmesi
  static String getPerformansDegerlendirmesi() {
    Map<String, dynamic> ozet = getHaftalikOzet();
    
    if (ozet['toplamXp'] > 1000 && ozet['toplamTest'] > 15 && ozet['toplamHikaye'] > 10) {
      return "Mükemmel hafta! 🌟";
    } else if (ozet['toplamXp'] > 500 && ozet['toplamTest'] > 10 && ozet['toplamHikaye'] > 5) {
      return "Harika performans! 🚀";
    } else if (ozet['toplamXp'] > 200 && ozet['toplamTest'] > 5 && ozet['toplamHikaye'] > 3) {
      return "İyi çalışma! 👍";
    } else {
      return "Biraz daha çaba göster! 💪";
    }
  }

  // Hedef önerisi
  static String getHedefOnerisi() {
    Map<String, dynamic> ozet = getHaftalikOzet();
    int hedefXp = ozet['toplamXp'] + 200;
    int hedefTest = ozet['toplamTest'] + 5;
    int hedefHikaye = ozet['toplamHikaye'] + 3;
    
    return "Gelecek hafta hedefin: $hedefXp XP, $hedefTest test, $hedefHikaye hikaye! 🎯";
  }

  // Yeni veri ekle
  static void yeniVeriEkle(int xp, int testSayisi, int hikayeSayisi, int seviye) {
    _haftalikVeri.add(GelisimVerisi(
      xp: xp,
      seviye: seviye,
      tamamlananTest: testSayisi,
      okunanHikaye: hikayeSayisi,
      gunlukSeri: 1, // Assuming a new day is added
    ));
    
    // En eski veriyi kaldır (7 günlük veri tut)
    if (_haftalikVeri.length > 7) {
      _haftalikVeri.removeAt(0);
    }
  }
} 