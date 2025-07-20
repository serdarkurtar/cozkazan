import 'dart:math';

class AiSimulasyon {
  final String userId;
  final Random _random = Random();

  AiSimulasyon({required this.userId});

  // Motivasyon Mesajı Motoru
  String getMotivasyonMesaji(int xp) {
    if (xp < 500) {
      return "Haydi $userId, bu hafta güzel bir başlangıç yap! 🌟";
    } else if (xp < 1000) {
      return "Harika gidiyorsun $userId! Devam et! 🚀";
    } else if (xp < 2000) {
      return "Muhteşem! $userId, gerçek bir kahraman oluyorsun! ⭐";
    } else if (xp < 3000) {
      return "İnanılmaz! $userId, haftanın kahramanı olmaya çok yakınsın! 🏆";
    } else {
      return "Tebrikler $userId! Sen gerçek bir süper kahramansın! 👑";
    }
  }

  // Hedef Önerici
  String getHedefOnerisi(int mevcutXp) {
    int hedefXp = mevcutXp + 500;
    int gerekliTest = (hedefXp - mevcutXp) ~/ 100;
    int gerekliHikaye = (hedefXp - mevcutXp) ~/ 50;
    
    return "Hedef: $hedefXp XP. $gerekliTest test + $gerekliHikaye hikaye ile bu hedefe ulaşabilirsin! 🎯";
  }

  // Veli Raporu Üretici
  String getVeliRaporu({
    required int testSayisi,
    required int hikayeSayisi,
    required int xp,
    required int seviye,
  }) {
    String performans = _getPerformansDegerlendirmesi(xp, testSayisi, hikayeSayisi);
    
    return """
Bu hafta $testSayisi test çözdün, $hikayeSayisi hikaye okudun.
Toplam XP: $xp - Seviye: $seviye
$performans
    """.trim();
  }

  // Performans Değerlendirmesi
  String _getPerformansDegerlendirmesi(int xp, int testSayisi, int hikayeSayisi) {
    if (xp > 2000 && testSayisi > 5 && hikayeSayisi > 3) {
      return "Mükemmel performans! 🌟";
    } else if (xp > 1000 && testSayisi > 3 && hikayeSayisi > 2) {
      return "Harika gidiyorsun! 🚀";
    } else if (xp > 500 && testSayisi > 1 && hikayeSayisi > 1) {
      return "İyi çalışıyorsun! 👍";
    } else {
      return "Biraz daha çaba göster! 💪";
    }
  }

  // Görev Başarı Önericisi
  String getGorevBasariMesaji(String gorevAdi) {
    List<String> mesajlar = [
      "Harika! $gorevAdi görevini tamamladın! Gerçek bir kahraman! 🦸‍♂️",
      "Tebrikler! $gorevAdi konusunda mükemmelsin! 🌟",
      "İnanılmaz! $gorevAdi görevini başarıyla tamamladın! 🎉",
      "Süper! $gorevAdi konusunda gerçekten iyisin! ⭐",
    ];
    
    return mesajlar[_random.nextInt(mesajlar.length)];
  }

  // AI Uyarı Sistemi
  String getUyariMesaji(int gunSayisi) {
    if (gunSayisi >= 7) {
      return "$userId'yi bir haftadır göremedik. Her şey yolunda mı? Yeni bir hikaye onu motive edebilir! 📚";
    } else if (gunSayisi >= 3) {
      return "$userId'yi birkaç gündür göremedik. Yeni bir test onu heyecanlandırabilir! 🧩";
    } else {
      return "$userId bugün harika görünüyor! Devam et! 🌟";
    }
  }

  // Akıllı İçerik Önerisi
  String getIcerikOnerisi(int seviye, String sonAktivite) {
    if (seviye < 3) {
      return "Başlangıç seviyesindesin! Basit hikayelerle başlayalım! 📖";
    } else if (seviye < 5) {
      return "Orta seviyedesin! Biraz daha zorlu testler deneyelim! 🧠";
    } else {
      return "İleri seviyedesin! Karmaşık hikayeler seni bekliyor! 🚀";
    }
  }

  // Haftalık Kahraman Analizi
  String getHaftalikKahramanAnalizi(int xp, int siralama) {
    if (siralama == 1) {
      return "🏆 TEBRİKLER! Bu haftanın kahramanı sensin!";
    } else if (siralama <= 3) {
      return "🥈 Harika! İlk 3'te yer alıyorsun!";
    } else if (siralama <= 5) {
      return "🥉 İyi gidiyorsun! İlk 5'te yer alıyorsun!";
    } else {
      return "💪 Devam et! Bir sonraki hafta daha iyi olacaksın!";
    }
  }
} 