import 'dart:convert';
// import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'api_service.dart';

class AiMemory {
  static const String _memoryKey = 'ai_memory';
  static const String _lastAnalysisKey = 'last_analysis_date';
  
  // Mesaj kaydetme
  static Future<void> saveMessage({
    required String userType,
    required String userId,
    required String message,
    required String response,
    int? xp,
    Map<String, dynamic>? additionalData,
  }) async {
    try {
      final timestamp = DateTime.now();
      final memoryData = {
        'userType': userType,
        'userId': userId,
        'message': message,
        'response': response,
        'timestamp': timestamp.toIso8601String(),
        'xp': xp,
        'additionalData': additionalData,
      };

      // Local storage'a kaydet (offline mod için)
      await _saveToLocal(memoryData);
      
      // Backend API'ye kaydet (online mod için)
      await _saveToBackend(memoryData);
      
    } catch (e) {
      print('AI Memory Error: $e');
    }
  }

  // Local storage'a kaydet
  static Future<void> _saveToLocal(Map<String, dynamic> data) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final existingData = prefs.getStringList(_memoryKey) ?? [];
      existingData.add(json.encode(data));
      
      // Son 100 mesajı tut
      if (existingData.length > 100) {
        existingData.removeRange(0, existingData.length - 100);
      }
      
      await prefs.setStringList(_memoryKey, existingData);
    } catch (e) {
      print('Local Memory Error: $e');
    }
  }

  // Backend API'ye kaydet
  static Future<void> _saveToBackend(Map<String, dynamic> data) async {
    try {
      await ApiService.post('/ai-chats', data);
    } catch (e) {
      print('Backend Memory Error: $e');
    }
  }

  // Kullanıcının geçmiş mesajlarını getir
  static Future<List<Map<String, dynamic>>> getUserHistory({
    required String userType,
    required String userId,
    int limit = 20,
  }) async {
    try {
      // Önce local'den dene
      final localHistory = await _getLocalHistory(userType, userId, limit);
      if (localHistory.isNotEmpty) {
        return localHistory;
      }

      // Backend API'den getir
      final response = await ApiService.get('/ai-chats?userType=$userType&userId=$userId&limit=$limit');
      if (response != null && response['data'] != null) {
        return List<Map<String, dynamic>>.from(response['data']);
      }
      
      return [];
    } catch (e) {
      print('Get History Error: $e');
      return [];
    }
  }

  // Local geçmişi getir
  static Future<List<Map<String, dynamic>>> _getLocalHistory(
    String userType,
    String userId,
    int limit,
  ) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final memoryList = prefs.getStringList(_memoryKey) ?? [];
      
      final filteredData = <Map<String, dynamic>>[];
      
      for (final memoryString in memoryList.reversed) {
        final data = json.decode(memoryString) as Map<String, dynamic>;
        if (data['userType'] == userType && data['userId'] == userId) {
          filteredData.add(data);
          if (filteredData.length >= limit) break;
        }
      }
      
      return filteredData;
    } catch (e) {
      print('Local History Error: $e');
      return [];
    }
  }

  // Günlük analiz için mesajları getir
  static Future<List<Map<String, dynamic>>> getDailyMessages({
    required String userType,
    int days = 7,
  }) async {
    try {
      final startDate = DateTime.now().subtract(Duration(days: days));
      
      final response = await ApiService.get('/ai-chats?userType=$userType&startDate=${startDate.toIso8601String()}');
      if (response != null && response['data'] != null) {
        return List<Map<String, dynamic>>.from(response['data']);
      }
      
      return [];
    } catch (e) {
      print('Daily Messages Error: $e');
      return [];
    }
  }

  // En çok tekrar eden konuları bul
  static Future<List<String>> getFrequentTopics({
    required String userType,
    int days = 7,
  }) async {
    try {
      final messages = await getDailyMessages(userType: userType, days: days);
      final topicCount = <String, int>{};
      
      for (final message in messages) {
        final messageText = (message['message'] as String).toLowerCase();
        
        // Anahtar kelimeleri kontrol et
        final topics = _extractTopics(messageText);
        for (final topic in topics) {
          topicCount[topic] = (topicCount[topic] ?? 0) + 1;
        }
      }
      
      // En çok tekrar eden konuları sırala
      final sortedTopics = topicCount.entries.toList()
        ..sort((a, b) => b.value.compareTo(a.value));
      
      return sortedTopics.take(5).map((e) => e.key).toList();
    } catch (e) {
      print('Frequent Topics Error: $e');
      return [];
    }
  }

  // Mesajdan konuları çıkar
  static List<String> _extractTopics(String message) {
    final topics = <String>[];
    
    if (message.contains('ekran')) topics.add('ekran_suresi');
    if (message.contains('kitap')) topics.add('kitap_okuma');
    if (message.contains('test')) topics.add('test_cozme');
    if (message.contains('motivasyon')) topics.add('motivasyon');
    if (message.contains('disiplin')) topics.add('disiplin');
    if (message.contains('sınav')) topics.add('sinav_kaygisi');
    if (message.contains('dikkat')) topics.add('dikkat_odaklanma');
    if (message.contains('ödev')) topics.add('odev_aliskinligi');
    if (message.contains('oyun')) topics.add('oyun_teknoloji');
    if (message.contains('okul')) topics.add('okul_basari');
    if (message.contains('spor')) topics.add('spor_egzersiz');
    if (message.contains('uyku')) topics.add('uyku_duzeni');
    if (message.contains('yemek')) topics.add('beslenme');
    if (message.contains('kardeş')) topics.add('kardes_iliskileri');
    if (message.contains('para')) topics.add('para_yonetimi');
    if (message.contains('gelecek')) topics.add('gelecek_hedefleri');
    
    return topics;
  }

  // Son analiz tarihini kontrol et
  static Future<bool> shouldAnalyze() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final lastAnalysis = prefs.getString(_lastAnalysisKey);
      
      if (lastAnalysis == null) {
        await prefs.setString(_lastAnalysisKey, DateTime.now().toIso8601String());
        return true;
      }
      
      final lastDate = DateTime.parse(lastAnalysis);
      final daysSinceLastAnalysis = DateTime.now().difference(lastDate).inDays;
      
      // Haftada bir analiz yap
      if (daysSinceLastAnalysis >= 7) {
        await prefs.setString(_lastAnalysisKey, DateTime.now().toIso8601String());
        return true;
      }
      
      return false;
    } catch (e) {
      print('Analysis Check Error: $e');
      return false;
    }
  }

  // Hafızayı temizle (eski mesajları sil)
  static Future<void> clearOldMessages({int days = 30}) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final memoryList = prefs.getStringList(_memoryKey) ?? [];
      final cutoffDate = DateTime.now().subtract(Duration(days: days));
      
      final filteredList = memoryList.where((memoryString) {
        try {
          final data = json.decode(memoryString) as Map<String, dynamic>;
          final timestamp = DateTime.parse(data['timestamp']);
          return timestamp.isAfter(cutoffDate);
        } catch (e) {
          return false;
        }
      }).toList();
      
      await prefs.setStringList(_memoryKey, filteredList);
    } catch (e) {
      print('Clear Memory Error: $e');
    }
  }
} 