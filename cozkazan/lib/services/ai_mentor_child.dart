import 'ai_memory.dart';
import 'ai_learner.dart';
import 'api_service.dart';
import 'duygu_analizi_service.dart';

class AiMentorChild {
  static Future<String> cevapVer(String mesaj, {int? currentXp, String? childId}) async {
    mesaj = mesaj.toLowerCase();
    childId ??= 'default_child';

    try {
      // Duygu analizi yap
      final duyguAnalizi = await DuyguAnaliziService.analizEt(
        mesaj: mesaj,
        kullaniciId: childId,
        kullaniciTipi: 'child',
      );

      // Kişiselleştirilmiş yanıt üret
      final yanit = await _getPersonalizedResponse(mesaj, childId, currentXp);
      
      // Yanıtı duygu analizine göre ayarla
      final ayarlanmisYanit = await DuyguAnaliziService.yanitiAyarla(
        yanit: yanit,
        duyguAnaliziId: duyguAnalizi.id,
      );
      
      // Hafızaya kaydet
      _saveToMemory(mesaj, childId, currentXp, ayarlanmisYanit, duyguAnalizi);

      return ayarlanmisYanit;
    } catch (e) {
      print('Kişiselleştirilmiş yanıt hatası: $e');
      // Fallback: Eski sistemi kullan
      return await _getFallbackResponse(mesaj, currentXp, childId);
    }
  }

  // Kişiselleştirilmiş yanıt al
  static Future<String> _getPersonalizedResponse(String mesaj, String childId, int? currentXp) async {
    try {
      final context = {
        'currentXp': currentXp ?? 0,
        'currentActivity': _detectActivity(mesaj),
        'timestamp': DateTime.now().toIso8601String(),
      };

      final response = await ApiService.post('/kisisel-yanit/yanit-uret', {
        'childId': childId,
        'message': mesaj,
        'context': context,
      });

      if (response['success'] == true) {
        return response['response'] as String;
      } else {
        throw Exception('Yanıt üretilemedi: ${response['message']}');
      }
    } catch (e) {
      print('Kişiselleştirilmiş yanıt API hatası: $e');
      rethrow;
    }
  }

  // Fallback yanıt (eski sistem)
  static Future<String> _getFallbackResponse(String mesaj, int? currentXp, String childId) async {
    try {
      // Sunucudan AI yanıtı al
      final yanit = await ApiService.getAIMentorYaniti(mesaj, childId: childId);
      return yanit;
    } catch (e) {
      print('Fallback yanıt hatası: $e');
      return _getMotivationalResponse(currentXp, 'general');
    }
  }

  // Çocuk profili oluştur/güncelle
  static Future<bool> createOrUpdateProfile({
    required String childId,
    required String childName,
    required String ageGroup,
    required String learningStyle,
    List<String>? parentPreferences,
    int? currentXp,
  }) async {
    try {
      final response = await ApiService.post('/kisisel-yanit/profil', {
        'childId': childId,
        'childName': childName,
        'ageGroup': ageGroup,
        'learningStyle': learningStyle,
        'parentPreferences': parentPreferences ?? ['motivation_focus'],
        'currentXp': currentXp ?? 0,
      });

      return response['success'] == true;
    } catch (e) {
      print('Profil oluşturma hatası: $e');
      return false;
    }
  }

  // Çocuk profili getir
  static Future<Map<String, dynamic>?> getChildProfile(String childId) async {
    try {
      final response = await ApiService.get('/kisisel-yanit/profil/$childId');
      if (response['success'] == true) {
        return response['profile'] as Map<String, dynamic>;
      }
      return null;
    } catch (e) {
      print('Profil getirme hatası: $e');
      return null;
    }
  }

  // Çocuk istatistiklerini getir
  static Future<Map<String, dynamic>?> getChildStats(String childId) async {
    try {
      final response = await ApiService.get('/kisisel-yanit/istatistikler/$childId');
      if (response['success'] == true) {
        return response['stats'] as Map<String, dynamic>;
      }
      return null;
    } catch (e) {
      print('İstatistik getirme hatası: $e');
      return null;
    }
  }

  // Yaş grubu önerilerini getir
  static Future<Map<String, dynamic>?> getAgeRecommendations(String ageGroup) async {
    try {
      final response = await ApiService.get('/kisisel-yanit/yas-onerileri/$ageGroup');
      if (response['success'] == true) {
        return response['templates'] as Map<String, dynamic>;
      }
      return null;
    } catch (e) {
      print('Yaş önerileri hatası: $e');
      return null;
    }
  }

  // Öğrenme stili önerilerini getir
  static Future<Map<String, dynamic>?> getLearningStyleRecommendations(String style) async {
    try {
      final response = await ApiService.get('/kisisel-yanit/ogrenme-stili/$style');
      if (response['success'] == true) {
        return response['strategies'] as Map<String, dynamic>;
      }
      return null;
    } catch (e) {
      print('Öğrenme stili önerileri hatası: $e');
      return null;
    }
  }

  static String _getMotivationalResponse(int? currentXp, String situation) {
    final xp = currentXp ?? 0;
    
    switch (situation) {
      case "yorgunluk":
        if (xp < 100) {
          return "Biraz dinlen, sonra devam edelim. Küçük adımlarla büyük başarılar elde ederiz!";
        } else if (xp < 500) {
          return "Yorgunluğunu anlıyorum. Ama bak, ${xp} XP toplamışsın! Bu harika bir başarı.";
        } else {
          return "Yorgun olsan da ${xp} XP'lik bir kahramansın! Biraz mola ver, sonra devam ederiz.";
        }
      case "zorluk":
        if (xp < 100) {
          return "Zorluklar seni güçlendirir! Her zorluğu aştığında daha güçlü oluyorsun.";
        } else {
          return "${xp} XP toplamışsın, bu kadar güçlüsün! Bu zorluğu da aşarsın.";
        }
      case "sıkılma":
        return "Sıkıldığını anlıyorum. Farklı aktiviteler dene! Kitap oku, test çöz, yeni şeyler öğren.";
      case "başarısızlık":
        return "Başarısızlık yoktur, sadece öğrenme fırsatları vardır. Her deneme seni daha güçlü yapar!";
      default:
        return "Sen harika bir çocuksun! Her gün daha iyi oluyorsun.";
    }
  }

  static String _getTestMotivation(int? currentXp) {
    final xp = currentXp ?? 0;
    
    if (xp < 50) {
      return "Test çözmeye başlamak için harika bir zaman! Her test seni daha akıllı yapıyor.";
    } else if (xp < 200) {
      return "${xp} XP'n var! Test çözmeye devam et, daha fazla puan kazanacaksın.";
    } else {
      return "Sen bir test kahramanısın! ${xp} XP ile çok güçlüsün. Yeni testler seni bekliyor!";
    }
  }

  static String _getXpMotivation(int? currentXp) {
    final xp = currentXp ?? 0;
    
    if (xp < 100) {
      return "XP'lerini toplamaya devam et! Her aktivite sana puan kazandırıyor.";
    } else if (xp < 500) {
      return "Harika! ${xp} XP toplamışsın. Bu çok güzel bir başarı!";
    } else if (xp < 1000) {
      return "İnanılmaz! ${xp} XP'lik bir kahramansın! Seninle gurur duyuyorum.";
    } else {
      return "Efsane! ${xp} XP ile gerçek bir süper kahramansın! Sen muhteşemsin!";
    }
  }

  static String _getReadingMotivation(int? currentXp) {
    final xp = currentXp ?? 0;
    
    if (xp < 100) {
      return "Kitap okumak seni daha akıllı yapar! Her sayfa yeni bir macera.";
    } else {
      return "${xp} XP'lik bir okuyucu olmuşsun! Kitaplar senin en iyi arkadaşların.";
    }
  }

  static String _getGameMotivation(int? currentXp) {
    final xp = currentXp ?? 0;
    
    if (xp < 100) {
      return "Oyun oynamak güzel ama önce biraz çalışalım! XP kazan, sonra oyna.";
    } else {
      return "${xp} XP kazandığın için oyun oynamayı hak ettin! Ama dengeli ol.";
    }
  }

  static String _getHomeworkMotivation(int? currentXp) {
    final xp = currentXp ?? 0;
    
    if (xp < 100) {
      return "Ödevler seni güçlendirir! Her ödev bitirdiğinde XP kazanırsın.";
    } else {
      return "${xp} XP'lik bir öğrencisin! Ödevler senin için kolay olmalı.";
    }
  }

  static String _getSchoolMotivation(int? currentXp) {
    final xp = currentXp ?? 0;
    
    if (xp < 100) {
      return "Okul senin geleceğin! Her ders yeni bir bilgi öğretir.";
    } else {
      return "${xp} XP'lik bir öğrencisin! Okulda çok başarılı olmalısın.";
    }
  }

  static String _getGoalMotivation(int? currentXp) {
    final xp = currentXp ?? 0;
    
    if (xp < 100) {
      return "Hedeflerin için çalış! Her hedef seni daha güçlü yapar.";
    } else {
      return "${xp} XP'lik bir kahramansın! Hedeflerin için mükemmel hazırsın.";
    }
  }

  static String _getGeneralMotivation(int? currentXp) {
    final xp = currentXp ?? 0;
    
    final motivations = [
      "Sen harika bir çocuksun! Her gün daha iyi oluyorsun.",
      "Seninle gurur duyuyorum! Çok çalışıyorsun.",
      "Sen bir kahramansın! Her şeyi başarabilirsin.",
      "Sen muhteşemsin! Seninle tanıştığım için mutluyum.",
      "Sen çok özelsin! Seni çok seviyorum.",
    ];
    
    if (xp > 500) {
      return "Sen bir süper kahramansın! ${xp} XP ile gerçekten muhteşemsin!";
    } else if (xp > 100) {
      return "${xp} XP'lik bir kahramansın! Sen harikasın!";
    } else {
      return motivations[DateTime.now().millisecond % motivations.length];
    }
  }

  static Future<void> _saveToMemory(String message, String childId, int? xp, String response, DuyguAnalizi duyguAnalizi) async {
    try {
      // Sunucuya AI mesajını kaydet
      final messageData = {
        'userType': 'child',
        'userId': childId,
        'message': message,
        'response': response,
        'xp': xp,
        'additionalData': {
          'duyguSkoru': duyguAnalizi.duyguSkoru,
          'duyguKategori': duyguAnalizi.duyguKategori,
          'anaDuygular': duyguAnalizi.anaDuygular,
          'yanitToni': duyguAnalizi.yanitToni,
          'activity': _detectActivity(message),
        },
        'timestamp': DateTime.now().toIso8601String(),
      };

      await ApiService.kaydetAIMesaji(messageData);
      
      // Local hafızaya da kaydet
      await AiMemory.saveMessage(
        userType: 'child',
        userId: childId,
        message: message,
        response: response,
        xp: xp,
        additionalData: {
          'duyguSkoru': duyguAnalizi.duyguSkoru,
          'duyguKategori': duyguAnalizi.duyguKategori,
          'anaDuygular': duyguAnalizi.anaDuygular,
          'yanitToni': duyguAnalizi.yanitToni,
          'activity': _detectActivity(message),
        },
      );
    } catch (e) {
      print('Save Child Message Error: $e');
    }
  }

  static String _detectMood(String message) {
    final lowerMessage = message.toLowerCase();
    
    if (lowerMessage.contains('yorgun') || lowerMessage.contains('bıktım')) {
      return 'tired';
    } else if (lowerMessage.contains('zor') || lowerMessage.contains('yapamıyorum')) {
      return 'frustrated';
    } else if (lowerMessage.contains('sıkıldım') || lowerMessage.contains('sıkıcı')) {
      return 'bored';
    } else if (lowerMessage.contains('başarısız') || lowerMessage.contains('kötü')) {
      return 'sad';
    } else if (lowerMessage.contains('harika') || lowerMessage.contains('güzel')) {
      return 'happy';
    } else {
      return 'neutral';
    }
  }

  static String _detectActivity(String message) {
    final lowerMessage = message.toLowerCase();
    
    if (lowerMessage.contains('test')) return 'test';
    if (lowerMessage.contains('kitap')) return 'reading';
    if (lowerMessage.contains('oyun')) return 'gaming';
    if (lowerMessage.contains('ödev')) return 'homework';
    if (lowerMessage.contains('okul')) return 'school';
    if (lowerMessage.contains('hedef')) return 'goal';
    if (lowerMessage.contains('xp') || lowerMessage.contains('puan')) return 'xp';
    
    return 'general';
  }

  // Çocuğun geçmiş mesajlarını getir
  static Future<List<Map<String, dynamic>>> getChildHistory(String childId) async {
    return await AiMemory.getUserHistory(
      userType: 'child',
      userId: childId,
      limit: 10,
    );
  }

  // Çocuğun ruh halini analiz et
  static Future<String> analyzeChildMood(String childId) async {
    try {
      final history = await getChildHistory(childId);
      if (history.isEmpty) return 'neutral';
      
      final recentMessages = history.take(5);
      final moods = recentMessages.map((msg) {
        final additionalData = msg['additionalData'] as Map<String, dynamic>?;
        return additionalData?['mood'] ?? 'neutral';
      }).toList();
      
      // En çok tekrar eden ruh hali
      final moodCount = <String, int>{};
      for (final mood in moods) {
        moodCount[mood] = (moodCount[mood] ?? 0) + 1;
      }
      
      final mostFrequentMood = moodCount.entries
          .reduce((a, b) => a.value > b.value ? a : b)
          .key;
      
      return mostFrequentMood;
    } catch (e) {
      print('Analyze Child Mood Error: $e');
      return 'neutral';
    }
  }

  // Kişiselleştirilmiş öneri getir
  static Future<String> getPersonalizedAdvice(String childId, int? currentXp) async {
    try {
      final mood = await analyzeChildMood(childId);
      final xp = currentXp ?? 0;
      
      switch (mood) {
        case 'tired':
          return "Biraz dinlenmeye ihtiyacın var. Kısa bir mola ver, sonra devam ederiz.";
        case 'frustrated':
          return "Zorlukları birlikte aşarız. Her zorluk seni daha güçlü yapar.";
        case 'bored':
          return "Sıkıldığını anlıyorum. Farklı aktiviteler dene! Kitap oku, test çöz.";
        case 'sad':
          return "Sen harika bir çocuksun! Her gün daha iyi oluyorsun.";
        case 'happy':
          return "Mutlu olduğunu görmek harika! Bu enerjiyle devam et!";
        default:
          return _getGeneralMotivation(xp);
      }
    } catch (e) {
      print('Personalized Advice Error: $e');
      return _getGeneralMotivation(currentXp);
    }
  }
} 