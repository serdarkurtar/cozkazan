// import 'package:cloud_firestore/cloud_firestore.dart';
import 'ai_memory.dart';
import 'api_service.dart';

class AiLearner {
  static const String _insightsCollection = 'ai_insights';
  static const String _feedbackCollection = 'ai_feedback';
  
  // Haftalık analiz yap
  static Future<Map<String, dynamic>> analyzeWeeklyData({
    required String userType,
    int days = 7,
  }) async {
    try {
      final messages = await AiMemory.getDailyMessages(userType: userType, days: days);
      final frequentTopics = await AiMemory.getFrequentTopics(userType: userType, days: days);
      
      final analysis = {
        'userType': userType,
        'analysisDate': DateTime.now().toIso8601String(),
        'totalMessages': messages.length,
        'frequentTopics': frequentTopics,
        'effectiveness': await _analyzeEffectiveness(messages),
        'suggestions': await _generateSuggestions(messages, frequentTopics),
        'alternativeResponses': await _generateAlternativeResponses(messages),
      };
      
      // Backend API'ye kaydet
      await _saveInsights(analysis);
      
      return analysis;
    } catch (e) {
      print('Weekly Analysis Error: $e');
      return {};
    }
  }

  // Cevap etkinliğini analiz et
  static Future<Map<String, dynamic>> _analyzeEffectiveness(
    List<Map<String, dynamic>> messages,
  ) async {
    final effectiveness = <String, Map<String, dynamic>>{};
    
    for (final message in messages) {
      final topic = _getMessageTopic(message['message'] as String);
      if (topic != null) {
        if (!effectiveness.containsKey(topic)) {
          effectiveness[topic] = {
            'count': 0,
            'responses': <String>[],
            'avgResponseLength': 0,
          };
        }
        
        final response = message['response'] as String;
        effectiveness[topic]!['count'] = (effectiveness[topic]!['count'] as int) + 1;
        (effectiveness[topic]!['responses'] as List<String>).add(response);
      }
    }
    
    // Ortalama cevap uzunluğunu hesapla
    for (final topic in effectiveness.keys) {
      final responses = effectiveness[topic]!['responses'] as List<String>;
      final avgLength = responses.fold(0, (sum, response) => sum + response.length) / responses.length;
      effectiveness[topic]!['avgResponseLength'] = avgLength;
    }
    
    return effectiveness;
  }

  // Öneriler üret
  static Future<List<String>> _generateSuggestions(
    List<Map<String, dynamic>> messages,
    List<String> frequentTopics,
  ) async {
    final suggestions = <String>[];
    
    // En çok tekrar eden konular için öneriler
    for (final topic in frequentTopics.take(3)) {
      switch (topic) {
        case 'ekran_suresi':
          suggestions.add('Ekran süresi konusunda daha detaylı öneriler sunun');
          break;
        case 'kitap_okuma':
          suggestions.add('Kitap okuma için yaratıcı ödül sistemleri önerin');
          break;
        case 'test_cozme':
          suggestions.add('Test çözme motivasyonu için günlük hedefler belirleyin');
          break;
        case 'motivasyon':
          suggestions.add('Motivasyon konusunda kişiselleştirilmiş mesajlar kullanın');
          break;
        case 'disiplin':
          suggestions.add('Disiplin konusunda tutarlı kurallar önerin');
          break;
      }
    }
    
    // Genel öneriler
    if (messages.length > 20) {
      suggestions.add('Çok fazla mesaj var, daha kısa ve öz cevaplar verin');
    }
    
    if (messages.length < 5) {
      suggestions.add('Daha aktif kullanım için daha fazla konu önerin');
    }
    
    return suggestions;
  }

  // Alternatif cevaplar üret
  static Future<Map<String, List<String>>> _generateAlternativeResponses(
    List<Map<String, dynamic>> messages,
  ) async {
    final alternatives = <String, List<String>>{};
    
    for (final message in messages) {
      final topic = _getMessageTopic(message['message'] as String);
      if (topic != null && !alternatives.containsKey(topic)) {
        alternatives[topic] = _getAlternativeResponses(topic);
      }
    }
    
    return alternatives;
  }

  // Konuya göre alternatif cevaplar
  static List<String> _getAlternativeResponses(String topic) {
    switch (topic) {
      case 'ekran_suresi':
        return [
          'Ekran süresini başarıya bağlamayı deneyin. Örneğin: 3 test = 1 saat ekran.',
          'Günlük ekran süresi limiti koyun ve XP ile artırın.',
          'Ekran süresini ödül olarak kullanın, ceza olarak değil.',
        ];
      case 'kitap_okuma':
        return [
          'Kitap okuma alışkanlığı için küçük hedefler koyun. 10 sayfa = 10 XP gibi.',
          'Kitap okuma süresini günlük olarak takip edin.',
          'Favori kitapları ödül olarak sunun.',
        ];
      case 'test_cozme':
        return [
          'Test çözme alışkanlığı için başlangıçta kolay sorular ve küçük ödüller koyun.',
          'Günlük test hedefleri belirleyin.',
          'Test başarısını özel rozetlerle ödüllendirin.',
        ];
      case 'motivasyon':
        return [
          'Motivasyon için hedefleri çocuğunuzla birlikte belirleyin.',
          'Başarıları görsel olarak takip edin.',
          'Küçük başarıları da kutlayın.',
        ];
      default:
        return [
          'Bu konuda daha detaylı bilgi için uzman görüşü alabilirsiniz.',
          'ÇözKazan\'da bu konuyla ilgili özel öneriler bulabilirsiniz.',
        ];
    }
  }

  // Mesajdan konu çıkar
  static String? _getMessageTopic(String message) {
    final lowerMessage = message.toLowerCase();
    
    if (lowerMessage.contains('ekran')) return 'ekran_suresi';
    if (lowerMessage.contains('kitap')) return 'kitap_okuma';
    if (lowerMessage.contains('test')) return 'test_cozme';
    if (lowerMessage.contains('motivasyon')) return 'motivasyon';
    if (lowerMessage.contains('disiplin')) return 'disiplin';
    if (lowerMessage.contains('sınav')) return 'sinav_kaygisi';
    if (lowerMessage.contains('dikkat')) return 'dikkat_odaklanma';
    if (lowerMessage.contains('ödev')) return 'odev_aliskinligi';
    if (lowerMessage.contains('oyun')) return 'oyun_teknoloji';
    if (lowerMessage.contains('okul')) return 'okul_basari';
    if (lowerMessage.contains('spor')) return 'spor_egzersiz';
    if (lowerMessage.contains('uyku')) return 'uyku_duzeni';
    if (lowerMessage.contains('yemek')) return 'beslenme';
    if (lowerMessage.contains('kardeş')) return 'kardes_iliskileri';
    if (lowerMessage.contains('para')) return 'para_yonetimi';
    if (lowerMessage.contains('gelecek')) return 'gelecek_hedefleri';
    
    return null;
  }

  // İçgörüleri kaydet
  static Future<void> _saveInsights(Map<String, dynamic> insights) async {
    try {
      await ApiService.postInsights(insights);
    } catch (e) {
      print('Save Insights Error: $e');
    }
  }

  // Geri bildirim kaydet
  static Future<void> saveFeedback({
    required String userType,
    required String userId,
    required String message,
    required String response,
    required int rating, // 1-5 arası
    String? comment,
  }) async {
    try {
      final feedback = {
        'userType': userType,
        'userId': userId,
        'message': message,
        'response': response,
        'rating': rating,
        'comment': comment,
        'timestamp': DateTime.now().toIso8601String(),
      };
      
      await ApiService.postFeedback(feedback);
    } catch (e) {
      print('Save Feedback Error: $e');
    }
  }

  // En etkili cevapları getir
  static Future<List<String>> getEffectiveResponses({
    required String topic,
    int limit = 3,
  }) async {
    try {
      final responses = await ApiService.getEffectiveResponses(topic);
      return responses;
    } catch (e) {
      print('Get Effective Responses Error: $e');
      return [];
    }
  }

  // Aynı konu tekrar ediyorsa uyarı ver
  static Future<bool> isTopicRepeated({
    required String userType,
    required String userId,
    required String topic,
    int days = 7,
  }) async {
    try {
      final messages = await AiMemory.getDailyMessages(userType: userType, days: days);
      int topicCount = 0;
      
      for (final message in messages) {
        final messageTopic = _getMessageTopic(message['message'] as String);
        if (messageTopic == topic) {
          topicCount++;
        }
      }
      
      // Aynı konu 3'ten fazla tekrar ediyorsa uyarı ver
      return topicCount >= 3;
    } catch (e) {
      print('Topic Repeat Check Error: $e');
      return false;
    }
  }

  // Öğrenme önerilerini getir
  static Future<List<String>> getLearningSuggestions({
    required String userType,
    int days = 7,
  }) async {
    try {
      final analysis = await analyzeWeeklyData(userType: userType, days: days);
      final suggestions = <String>[];
      
      // Mesaj sayısına göre öneriler
      final totalMessages = analysis['totalMessages'] as int;
      if (totalMessages < 5) {
        suggestions.add('Daha fazla soru sorarak AI\'yı geliştirebilirsiniz');
      } else if (totalMessages > 50) {
        suggestions.add('AI çok aktif kullanılıyor, daha detaylı analizler yapılabilir');
      }
      
      // Sık tekrar eden konular için öneriler
      final frequentTopics = analysis['frequentTopics'] as List<String>;
      if (frequentTopics.isNotEmpty) {
        suggestions.add('En çok sorulan konu: ${frequentTopics.first}');
        suggestions.add('Bu konuda daha fazla kaynak önerilebilir');
      }
      
      return suggestions;
    } catch (e) {
      print('Learning Suggestions Error: $e');
      return [];
    }
  }
} 