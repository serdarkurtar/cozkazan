import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants.dart';

class AiAnaliz {
  final String aktiflik;
  final int aktifGunSayisi;
  final int oneriHedefXp;
  final String tavsiye;
  final String motivasyonMesaji;
  final int gunlukOrtalamaXp;
  final double gunlukOrtalamaTest;
  final int gunlukOrtalamaKitap;
  final int hedefUlasmaSuresi;
  final List<String> tavsiyeler;

  AiAnaliz({
    required this.aktiflik,
    required this.aktifGunSayisi,
    required this.oneriHedefXp,
    required this.tavsiye,
    required this.motivasyonMesaji,
    required this.gunlukOrtalamaXp,
    required this.gunlukOrtalamaTest,
    required this.gunlukOrtalamaKitap,
    required this.hedefUlasmaSuresi,
    required this.tavsiyeler,
  });

  factory AiAnaliz.fromJson(Map<String, dynamic> json) {
    return AiAnaliz(
      aktiflik: json['aktiflik'],
      aktifGunSayisi: json['aktifGunSayisi'],
      oneriHedefXp: json['oneriHedefXp'],
      tavsiye: json['tavsiye'],
      motivasyonMesaji: json['motivasyonMesaji'],
      gunlukOrtalamaXp: json['gunlukOrtalamaXp'],
      gunlukOrtalamaTest: json['gunlukOrtalamaTest'].toDouble(),
      gunlukOrtalamaKitap: json['gunlukOrtalamaKitap'],
      hedefUlasmaSuresi: json['hedefUlasmaSuresi'],
      tavsiyeler: List<String>.from(json['tavsiyeler']),
    );
  }
}

class AiAnalizService {
  static const String baseUrl = 'http://91.99.187.116:3000';

  // AI analizi getir
  static Future<AiAnaliz> analizGetir(String childId) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/ai-oneri'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'childId': childId}),
      );
      
      if (response.statusCode == 200) {
        return AiAnaliz.fromJson(json.decode(response.body));
      } else {
        throw Exception('AI analizi alınamadı: ${response.statusCode}');
      }
    } catch (e) {
      // Test için fallback veri
      return _getTestAnaliz();
    }
  }

  // Test için fallback analiz verisi
  static AiAnaliz _getTestAnaliz() {
    return AiAnaliz(
      aktiflik: 'Orta',
      aktifGunSayisi: 5,
      oneriHedefXp: 400,
      tavsiye: 'Hedef kolay, 3 gün sürer. Velin ödül koyabilir.',
      motivasyonMesaji: 'Harika ilerleme gösteriyorsun! Bu hızla devam edersen hedefini kolayca tamamlayabilirsin.',
      gunlukOrtalamaXp: 65,
      gunlukOrtalamaTest: 3.5,
      gunlukOrtalamaKitap: 28,
      hedefUlasmaSuresi: 3,
      tavsiyeler: [
        'Günde 2 test çözerek hedefine 3 günde ulaşabilirsin',
        'Kitap okuma süreni 30 dakikaya çıkar',
        'Hafta sonu daha fazla aktivite yap',
        'Velinle birlikte yeni hedefler belirle',
      ],
    );
  }
} 