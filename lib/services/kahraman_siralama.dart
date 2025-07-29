import 'dart:math';

class KahramanSiralama {
  static final List<KullaniciSiralama> _kullanicilar = [
    KullaniciSiralama(id: "bade", isim: "Bade", xp: 1250, seviye: 5),
    KullaniciSiralama(id: "ali", isim: "Ali", xp: 980, seviye: 4),
    KullaniciSiralama(id: "ayse", isim: "Ayşe", xp: 1450, seviye: 6),
    KullaniciSiralama(id: "mehmet", isim: "Mehmet", xp: 750, seviye: 3),
    KullaniciSiralama(id: "fatma", isim: "Fatma", xp: 1100, seviye: 5),
    KullaniciSiralama(id: "can", isim: "Can", xp: 890, seviye: 4),
    KullaniciSiralama(id: "zeynep", isim: "Zeynep", xp: 1350, seviye: 6),
    KullaniciSiralama(id: "deniz", isim: "Deniz", xp: 650, seviye: 3),
  ];

  // Haftalık sıralamayı getir
  static List<KullaniciSiralama> getHaftalikSiralama() {
    List<KullaniciSiralama> sirali = List.from(_kullanicilar);
    sirali.sort((a, b) => b.xp.compareTo(a.xp));
    
    // Sıralama numarasını ekle
    for (int i = 0; i < sirali.length; i++) {
      sirali[i] = sirali[i].copyWith(siralama: i + 1);
    }
    
    return sirali;
  }

  // Belirli kullanıcının sıralamasını getir
  static int getKullaniciSiralama(String userId) {
    List<KullaniciSiralama> sirali = getHaftalikSiralama();
    KullaniciSiralama? kullanici = sirali.firstWhere(
      (k) => k.id == userId,
      orElse: () => KullaniciSiralama(id: userId, isim: "Bilinmeyen", xp: 0, seviye: 1),
    );
    return kullanici.siralama;
  }

  // Kullanıcının XP'sini güncelle
  static void xpGuncelle(String userId, int yeniXp) {
    int index = _kullanicilar.indexWhere((k) => k.id == userId);
    if (index != -1) {
      _kullanicilar[index] = _kullanicilar[index].copyWith(xp: yeniXp);
    }
  }

  // Kullanıcının seviyesini güncelle
  static void seviyeGuncelle(String userId, int yeniSeviye) {
    int index = _kullanicilar.indexWhere((k) => k.id == userId);
    if (index != -1) {
      _kullanicilar[index] = _kullanicilar[index].copyWith(seviye: yeniSeviye);
    }
  }

  // İlk 3'ü getir
  static List<KullaniciSiralama> getIlkUc() {
    List<KullaniciSiralama> sirali = getHaftalikSiralama();
    return sirali.take(3).toList();
  }

  // Kullanıcının önceki sıralamasını getir (simülasyon)
  static int getOncekiSiralama(String userId) {
    Random random = Random();
    return random.nextInt(8) + 1; // 1-8 arası rastgele
  }

  // Sıralama değişimini hesapla
  static String getSiralamaDegisimi(String userId) {
    int simdiki = getKullaniciSiralama(userId);
    int onceki = getOncekiSiralama(userId);
    
    if (simdiki < onceki) {
      return "↑ ${onceki - simdiki} sıra yükseldin!";
    } else if (simdiki > onceki) {
      return "↓ ${simdiki - onceki} sıra düştün";
    } else {
      return "→ Sıralaman aynı kaldı";
    }
  }
}

class KullaniciSiralama {
  final String id;
  final String isim;
  final int xp;
  final int seviye;
  final int siralama;

  KullaniciSiralama({
    required this.id,
    required this.isim,
    required this.xp,
    required this.seviye,
    this.siralama = 0,
  });

  KullaniciSiralama copyWith({
    String? id,
    String? isim,
    int? xp,
    int? seviye,
    int? siralama,
  }) {
    return KullaniciSiralama(
      id: id ?? this.id,
      isim: isim ?? this.isim,
      xp: xp ?? this.xp,
      seviye: seviye ?? this.seviye,
      siralama: siralama ?? this.siralama,
    );
  }
} 