import 'ai_memory.dart';
import 'ai_learner.dart';
import 'api_service.dart';
import 'duygu_analizi_service.dart';

class AiMentorParent {
  static Future<String> cevapVer(String mesaj, {String? parentId}) async {
    mesaj = mesaj.toLowerCase();
    parentId ??= 'default_parent';

    try {
      // Duygu analizi yap
      final duyguAnalizi = await DuyguAnaliziService.analizEt(
        mesaj: mesaj,
        kullaniciId: parentId,
        kullaniciTipi: 'parent',
      );

      // Kişiselleştirilmiş yanıt üret
      final yanit = await _getPersonalizedResponse(mesaj, parentId);
      
      // Yanıtı duygu analizine göre ayarla
      final ayarlanmisYanit = await DuyguAnaliziService.yanitiAyarla(
        yanit: yanit,
        duyguAnaliziId: duyguAnalizi.id,
      );
      
      // Hafızaya kaydet
      _saveToMemory(mesaj, parentId, ayarlanmisYanit, duyguAnalizi);

      return ayarlanmisYanit;
    } catch (e) {
      print('Kişiselleştirilmiş veli yanıt hatası: $e');
      // Fallback: Eski sistemi kullan
      return _getFallbackResponse(mesaj);
    }
  }

  // Kişiselleştirilmiş yanıt al
  static Future<String> _getPersonalizedResponse(String mesaj, String parentId) async {
    try {
      final context = {
        'userType': 'parent',
        'timestamp': DateTime.now().toIso8601String(),
      };

      final response = await ApiService.getPersonalizedResponse(parentId, mesaj, context);

      if (response['success'] == true) {
        return response['response'] as String;
      } else {
        throw Exception('Yanıt üretilemedi: ${response['message']}');
      }
    } catch (e) {
      print('Kişiselleştirilmiş veli yanıt API hatası: $e');
      rethrow;
    }
  }

  // Fallback yanıt (eski sistem)
  static String _getFallbackResponse(String mesaj) {
    if (mesaj.contains("ekran")) {
      if (mesaj.contains("çok") || mesaj.contains("bağımlı")) {
        return "Ekran süresini başarıya bağlamayı deneyin. Örneğin: 3 test = 1 saat ekran.";
      } else if (mesaj.contains("süresi")) {
        return "ÇözKazan'da ekran süresi, veli tarafından test hedefiyle orantılı şekilde belirlenebilir.";
      }
      return "Ekran süresini yönetmenin en etkili yolu, süreyi ödüle dönüştürmektir.";
    }

    if (mesaj.contains("kitap")) {
      if (mesaj.contains("okumuyor")) {
        return "Kitap okuma alışkanlığı için küçük hedefler koyun. 10 sayfa = 10 XP gibi.";
      }
      return "Kitap okuma alışkanlığını ekran süresiyle ödüllendirmek etkili olabilir.";
    }

    if (mesaj.contains("motivasyon")) {
      return "Motivasyon için hedefleri çocuğunuzla birlikte belirleyin. Kendi hedefi olan çocuk daha kararlı olur.";
    }

    if (mesaj.contains("test")) {
      if (mesaj.contains("çözmüyor")) {
        return "Test çözme alışkanlığı için başlangıçta kolay sorular ve küçük ödüller koyun.";
      }
      return "Test başarısı için günlük hedef belirleyip XP ile teşvik edin.";
    }

    if (mesaj.contains("sınav") || mesaj.contains("korku")) {
      return "Sınav kaygısını azaltmak için hedefleri küçük parçalara bölün. Başarı hissi önemlidir.";
    }

    if (mesaj.contains("başarı") || mesaj.contains("ödül")) {
      return "Başarıyı sadece sonuçla değil, çaba ile ödüllendirin. Çocuğun çabasını görünür kılın.";
    }

    if (mesaj.contains("disiplin")) {
      return "Disiplin için tutarlı kurallar koyun. ÇözKazan'da hedefler ve ödüller tutarlılığı sağlar.";
    }

    if (mesaj.contains("dikkat") || mesaj.contains("odaklanma")) {
      return "Dikkat sorunları için kısa süreli hedefler belirleyin. 15 dakika çalışma = 5 XP gibi.";
    }

    if (mesaj.contains("ödev") || mesaj.contains("ev ödevi")) {
      return "Ödev alışkanlığı için günlük XP hedefleri koyun. Ödev bitirme = XP kazanma.";
    }

    if (mesaj.contains("oyun") || mesaj.contains("oyuncak")) {
      return "Oyun süresini ödül olarak kullanın. 100 XP = 30 dakika oyun gibi.";
    }

    if (mesaj.contains("arkadaş") || mesaj.contains("sosyal")) {
      return "Sosyal aktiviteleri de ödül sistemine dahil edin. Başarılı hafta = arkadaş buluşması.";
    }

    if (mesaj.contains("teknoloji") || mesaj.contains("telefon")) {
      return "Teknoloji kullanımını dengeleyin. ÇözKazan'da ekran süresi ödül olarak verilir.";
    }

    if (mesaj.contains("okul") || mesaj.contains("ders")) {
      return "Okul başarısını XP ile takip edin. Her başarılı ders = XP kazanma.";
    }

    if (mesaj.contains("spor") || mesaj.contains("egzersiz")) {
      return "Fiziksel aktiviteleri de ödül sistemine dahil edin. Spor = ekstra XP.";
    }

    if (mesaj.contains("uyku") || mesaj.contains("uyumuyor")) {
      return "Uyku düzeni için sabit saatler belirleyin. Düzenli uyku = günlük bonus XP.";
    }

    if (mesaj.contains("yemek") || mesaj.contains("beslenme")) {
      return "Sağlıklı beslenme alışkanlığını ödüllendirin. Sebze yeme = XP kazanma.";
    }

    if (mesaj.contains("kardeş") || mesaj.contains("kıskançlık")) {
      return "Kardeşler arası dengeyi sağlayın. Her çocuk için ayrı hedefler belirleyin.";
    }

    if (mesaj.contains("anne") || mesaj.contains("baba")) {
      return "Ebeveyn olarak tutarlı davranın. ÇözKazan'da veli paneli ile takip edin.";
    }

    if (mesaj.contains("yaş") || mesaj.contains("gelişim")) {
      return "Yaşa uygun hedefler belirleyin. 7 yaş için 50 XP, 10 yaş için 100 XP gibi.";
    }

    if (mesaj.contains("zaman") || mesaj.contains("planlama")) {
      return "Zaman yönetimi için günlük program oluşturun. ÇözKazan'da günlük hedefler koyun.";
    }

    if (mesaj.contains("para") || mesaj.contains("harçlık")) {
      return "Para yönetimi için XP'yi gerçek ödüllerle birleştirin. 500 XP = küçük ödül.";
    }

    if (mesaj.contains("gelecek") || mesaj.contains("kariyer")) {
      return "Gelecek hedefleri için uzun vadeli XP hedefleri koyun. 1000 XP = büyük ödül.";
    }

    return "Sorunuzu anladım. ÇözKazan'da davranışları ödül ve hedefle dengeleyerek çocuğunuzun gelişimini destekleyebilirsiniz.";
  }

  static Future<void> _saveToMemory(String message, String parentId, String response, DuyguAnalizi duyguAnalizi) async {
    try {
              await AiMemory.saveMessage(
          userType: 'parent',
          userId: parentId,
          message: message,
          response: response,
          additionalData: {
            'topic': _detectTopic(message),
            'urgency': _detectUrgency(message),
            'duyguSkoru': duyguAnalizi.duyguSkoru,
            'duyguKategori': duyguAnalizi.duyguKategori,
            'anaDuygular': duyguAnalizi.anaDuygular,
            'yanitToni': duyguAnalizi.yanitToni,
          },
        );
    } catch (e) {
      print('Save Parent Message Error: $e');
    }
  }

  static String _detectTopic(String message) {
    final lowerMessage = message.toLowerCase();
    
    if (lowerMessage.contains('ekran')) return 'screen_time';
    if (lowerMessage.contains('kitap')) return 'reading';
    if (lowerMessage.contains('test')) return 'test_solving';
    if (lowerMessage.contains('motivasyon')) return 'motivation';
    if (lowerMessage.contains('disiplin')) return 'discipline';
    if (lowerMessage.contains('sınav')) return 'exam_anxiety';
    if (lowerMessage.contains('dikkat')) return 'attention';
    if (lowerMessage.contains('ödev')) return 'homework';
    if (lowerMessage.contains('oyun')) return 'gaming';
    if (lowerMessage.contains('okul')) return 'school';
    if (lowerMessage.contains('spor')) return 'exercise';
    if (lowerMessage.contains('uyku')) return 'sleep';
    if (lowerMessage.contains('yemek')) return 'nutrition';
    if (lowerMessage.contains('kardeş')) return 'siblings';
    if (lowerMessage.contains('para')) return 'money';
    if (lowerMessage.contains('gelecek')) return 'future';
    
    return 'general';
  }

  static String _detectUrgency(String message) {
    final lowerMessage = message.toLowerCase();
    
    if (lowerMessage.contains('acil') || lowerMessage.contains('hemen')) {
      return 'high';
    } else if (lowerMessage.contains('zor') || lowerMessage.contains('problem')) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  // Veli geçmiş mesajlarını getir
  static Future<List<Map<String, dynamic>>> getParentHistory(String parentId) async {
    return await AiMemory.getUserHistory(
      userType: 'parent',
      userId: parentId,
      limit: 10,
    );
  }

  // Kişiselleştirilmiş öneri getir
  static Future<String> getPersonalizedAdvice(String parentId) async {
    try {
      final history = await getParentHistory(parentId);
      if (history.isEmpty) {
        return "Hoş geldiniz! Size nasıl yardımcı olabilirim?";
      }
      
      final recentTopics = history.take(5).map((msg) {
        final additionalData = msg['additionalData'] as Map<String, dynamic>?;
        return additionalData?['topic'] ?? 'general';
      }).toList();
      
      // En çok sorulan konu
      final topicCount = <String, int>{};
      for (final topic in recentTopics) {
        topicCount[topic] = (topicCount[topic] ?? 0) + 1;
      }
      
      final mostFrequentTopic = topicCount.entries
          .reduce((a, b) => a.value > b.value ? a : b)
          .key;
      
      switch (mostFrequentTopic) {
        case 'screen_time':
          return "Ekran süresi konusunda endişeli olduğunuzu görüyorum. Bu konuda size daha detaylı öneriler sunabilirim.";
        case 'reading':
          return "Kitap okuma alışkanlığı konusunda size yardımcı olmaya devam edeceğim.";
        case 'test_solving':
          return "Test çözme motivasyonu konusunda farklı stratejiler deneyebiliriz.";
        case 'motivation':
          return "Motivasyon konusunda kişiselleştirilmiş yaklaşımlar geliştirebiliriz.";
        default:
          return "Size nasıl daha iyi yardımcı olabilirim?";
      }
    } catch (e) {
      print('Personalized Parent Advice Error: $e');
      return "Size nasıl yardımcı olabilirim?";
    }
  }

  // Veli profili oluştur/güncelle
  static Future<bool> createOrUpdateParentProfile({
    required String parentId,
    required String parentName,
    required String parentAgeGroup,
    required String communicationStyle,
    List<String>? parentingPreferences,
    String? parentStressLevel,
    String? parentExperience,
  }) async {
    try {
      final response = await ApiService.createOrUpdateChildProfile({
        'childId': parentId,
        'childName': parentName,
        'userType': 'parent',
        'parentAgeGroup': parentAgeGroup,
        'communicationStyle': communicationStyle,
        'parentingPreferences': parentingPreferences ?? ['gentle_guidance'],
        'parentStressLevel': parentStressLevel ?? 'medium',
        'parentExperience': parentExperience ?? 'experienced'
      });

      return response;
    } catch (e) {
      print('Veli profil oluşturma hatası: $e');
      return false;
    }
  }

  // Veli profili getir
  static Future<Map<String, dynamic>?> getParentProfile(String parentId) async {
    try {
      final response = await ApiService.getChildProfile(parentId);
      if (response != null && response['userType'] == 'parent') {
        return response;
      }
      return null;
    } catch (e) {
      print('Veli profil getirme hatası: $e');
      return null;
    }
  }

  // Veli istatistiklerini getir
  static Future<Map<String, dynamic>?> getParentStats(String parentId) async {
    try {
      final response = await ApiService.getChildStats(parentId);
      return response;
    } catch (e) {
      print('Veli istatistik getirme hatası: $e');
      return null;
    }
  }
} 