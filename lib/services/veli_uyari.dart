class VeliUyari {
  static final Map<String, DateTime> _sonAktivite = {
    'bade': DateTime.now().subtract(const Duration(days: 2)),
    'ali': DateTime.now().subtract(const Duration(days: 1)),
    'ayse': DateTime.now(),
    'mehmet': DateTime.now().subtract(const Duration(days: 3)),
    'fatma': DateTime.now().subtract(const Duration(hours: 12)),
  };



  // Son aktiviteyi güncelle
  static void aktiviteGuncelle(String userId) {
    _sonAktivite[userId] = DateTime.now();
  }

  // Uyarı kontrolü
  static List<String> getUyarilar(String userId) {
    List<String> uyarilar = [];
    DateTime? sonAktivite = _sonAktivite[userId];
    
    if (sonAktivite == null) {
      uyarilar.add("$userId henüz hiç aktivite yapmamış.");
      return uyarilar;
    }

    int gunFarki = DateTime.now().difference(sonAktivite).inDays;
    
    if (gunFarki >= 7) {
      uyarilar.add("⚠️ $userId bir haftadır uygulamayı kullanmıyor!");
      uyarilar.add("📚 Yeni hikayeler onu motive edebilir.");
      uyarilar.add("🎮 Eğlenceli testler bekliyor.");
    } else if (gunFarki >= 3) {
      uyarilar.add("⚠️ $userId 3 gündür uygulamayı kullanmıyor.");
      uyarilar.add("🌟 Günlük ödüllerini kaçırıyor!");
    } else if (gunFarki >= 1) {
      uyarilar.add("ℹ️ $userId dün uygulamayı kullanmamış.");
      uyarilar.add("💡 Bugün kısa bir test çözebilir.");
    }

    // XP düşükse uyarı
    int xp = _getKullaniciXp(userId);
    if (xp < 500) {
      uyarilar.add("📊 $userId'nin XP'si düşük (${xp}XP).");
      uyarilar.add("🎯 Daha fazla aktivite ile XP kazanabilir.");
    }

    // Seviye düşükse uyarı
    int seviye = _getKullaniciSeviye(userId);
    if (seviye < 3) {
      uyarilar.add("📈 $userId henüz düşük seviyede (Seviye $seviye).");
      uyarilar.add("🚀 Daha fazla çalışarak seviye atlayabilir.");
    }

    return uyarilar;
  }

  // Tüm kullanıcılar için uyarıları getir
  static Map<String, List<String>> getTumUyarilar() {
    Map<String, List<String>> tumUyarilar = {};
    
    for (String userId in _sonAktivite.keys) {
      tumUyarilar[userId] = getUyarilar(userId);
    }
    
    return tumUyarilar;
  }

  // Acil uyarıları getir (3+ gün)
  static Map<String, List<String>> getAcilUyarilar() {
    Map<String, List<String>> acilUyarilar = {};
    
    for (String userId in _sonAktivite.keys) {
      List<String> uyarilar = getUyarilar(userId);
      if (uyarilar.any((u) => u.contains('3 gün') || u.contains('hafta'))) {
        acilUyarilar[userId] = uyarilar;
      }
    }
    
    return acilUyarilar;
  }

  // Motivasyon mesajları
  static String getMotivasyonMesaji(String userId) {
    DateTime? sonAktivite = _sonAktivite[userId];
    if (sonAktivite == null) return "Hoş geldin! İlk aktiviteni yapmaya ne dersin? 🌟";
    
    int gunFarki = DateTime.now().difference(sonAktivite).inDays;
    
    if (gunFarki == 0) {
      return "Harika! Bugün de aktifsin! Devam et! 🚀";
    } else if (gunFarki == 1) {
      return "Dünü kaçırdın ama bugün harika bir gün olabilir! 💪";
    } else if (gunFarki == 2) {
      return "Seni özledik! Yeni maceralar seni bekliyor! 🌟";
    } else {
      return "Uzun zamandır yoksun! Geri dönmeye ne dersin? 🎮";
    }
  }

  // Öneriler
  static List<String> getOneriler(String userId) {
    List<String> oneriler = [];
    DateTime? sonAktivite = _sonAktivite[userId];
    
    if (sonAktivite == null) {
      oneriler.addAll([
        "📖 Basit bir hikaye ile başla",
        "🧩 Kolay bir test çöz",
        "🎯 Günlük görevleri tamamla",
      ]);
      return oneriler;
    }

    int gunFarki = DateTime.now().difference(sonAktivite).inDays;
    
    if (gunFarki >= 3) {
      oneriler.addAll([
        "📚 Kısa ve eğlenceli hikayeler oku",
        "🎮 Oyun tarzı testler çöz",
        "🏆 Ödülleri keşfet",
        "🌟 Arkadaşlarınla yarış",
      ]);
    } else {
      oneriler.addAll([
        "📈 Seviye atlamaya odaklan",
        "🎯 Günlük hedefler belirle",
        "⭐ Yeni başarılar kazan",
      ]);
    }
    
    return oneriler;
  }

  // İstatistikler
  static Map<String, dynamic> getIstatistikler() {
    int aktifKullanici = 0;
    int pasifKullanici = 0;
    
    for (DateTime aktivite in _sonAktivite.values) {
      int gunFarki = DateTime.now().difference(aktivite).inDays;
      if (gunFarki <= 1) {
        aktifKullanici++;
      } else {
        pasifKullanici++;
      }
    }
    
    return {
      'aktifKullanici': aktifKullanici,
      'pasifKullanici': pasifKullanici,
      'toplamKullanici': _sonAktivite.length,
      'aktiflikOrani': (aktifKullanici / _sonAktivite.length * 100).toStringAsFixed(1),
    };
  }

  // Simülasyon verileri
  static int _getKullaniciXp(String userId) {
    Map<String, int> xpVerileri = {
      'bade': 1250,
      'ali': 980,
      'ayse': 1450,
      'mehmet': 750,
      'fatma': 1100,
    };
    return xpVerileri[userId] ?? 0;
  }

  static int _getKullaniciSeviye(String userId) {
    Map<String, int> seviyeVerileri = {
      'bade': 5,
      'ali': 4,
      'ayse': 6,
      'mehmet': 3,
      'fatma': 5,
    };
    return seviyeVerileri[userId] ?? 1;
  }
} 