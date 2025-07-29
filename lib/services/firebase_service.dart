import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class FirebaseService {
  static final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  static final FirebaseAuth _auth = FirebaseAuth.instance;

  // SINIF VE DERS LİSTESİ - SADECE STRING DÖNDÜR
  static Future<Map<String, List<String>>> getSinifDersListesi() async {
    try {
      final QuerySnapshot derslerSnapshot = await _firestore.collection('dersler').get();
      
      Map<String, List<String>> result = {};
      
      for (var doc in derslerSnapshot.docs) {
        final data = doc.data() as Map<String, dynamic>;
        final sinifAdi = data['sinifAdi']?.toString() ?? '';
        final dersAdi = data['ad']?.toString() ?? '';
        
        if (sinifAdi.isNotEmpty && dersAdi.isNotEmpty) {
          if (!result.containsKey(sinifAdi)) {
            result[sinifAdi] = <String>[];
          }
          result[sinifAdi]!.add(dersAdi);
        }
      }
      
      return result;
    } catch (e) {
      print('❌ Firebase sınıf ders listesi hatası: $e');
      return <String, List<String>>{};
    }
  }

  // KONULAR - SADECE STRING DÖNDÜR
  static Future<List<String>> getKonular(String sinif, String ders) async {
    try {
      final QuerySnapshot konularSnapshot = await _firestore
          .collection('konular')
          .where('sinifAdi', isEqualTo: sinif)
          .where('dersAdi', isEqualTo: ders)
          .get();
      
      List<String> konular = [];
      for (var doc in konularSnapshot.docs) {
        final data = doc.data() as Map<String, dynamic>;
        final konuAdi = data['ad']?.toString() ?? '';
        if (konuAdi.isNotEmpty) {
          konular.add(konuAdi);
        }
      }
      
      return konular;
    } catch (e) {
      print('❌ Firebase konular hatası: $e');
      return <String>[];
    }
  }

  // TESTLER - SADECE STRING DÖNDÜR
  static Future<List<String>> getTestler(String sinif, String ders, String konu) async {
    try {
      final QuerySnapshot testlerSnapshot = await _firestore
          .collection('testler')
          .where('sinifAdi', isEqualTo: sinif)
          .where('dersAdi', isEqualTo: ders)
          .where('konuAdi', isEqualTo: konu)
          .get();
      
      List<String> testler = [];
      for (var doc in testlerSnapshot.docs) {
        final data = doc.data() as Map<String, dynamic>;
        final testAdi = data['ad']?.toString() ?? '';
        if (testAdi.isNotEmpty) {
          testler.add(testAdi);
        }
      }
      
      return testler;
    } catch (e) {
      print('❌ Firebase testler hatası: $e');
      return <String>[];
    }
  }

  // TEST DETAYLARI - TEST ADINA GÖRE TAM TEST VERİSİ
  static Future<Map<String, dynamic>?> getTestDetaylari(String testAdi) async {
    try {
      print('🔍 Test detayları aranıyor: $testAdi');

      // Test adına göre testi bul
      final QuerySnapshot testSnapshot = await _firestore
          .collection('testler')
          .where('ad', isEqualTo: testAdi)
          .limit(1)
          .get();

      print('📊 Test arama sonucu: ${testSnapshot.docs.length} test bulundu');

      if (testSnapshot.docs.isNotEmpty) {
        final testData = testSnapshot.docs.first.data() as Map<String, dynamic>;
        final testId = testSnapshot.docs.first.id;

        print('✅ Test bulundu: $testId');
        print('📊 Test verisi: $testData');

        // Test dokümanının içindeki soruları al
        final sorular = testData['sorular'] as List?;
        print('📊 Test dokümanında ${sorular?.length ?? 0} soru bulundu');

        if (sorular != null && sorular.isNotEmpty) {
          List<Map<String, dynamic>> formattedSorular = [];
          
          for (var soru in sorular) {
            final soruData = soru as Map<String, dynamic>;
            print('🔍 Soru verisi: $soruData');
            
            // Soru metni ve seçenekleri doğru şekilde al
            String soruMetni = soruData['soruMetni']?.toString() ?? '';
            String secenekA = soruData['secenekA']?.toString() ?? '';
            String secenekB = soruData['secenekB']?.toString() ?? '';
            String secenekC = soruData['secenekC']?.toString() ?? '';
            String secenekD = soruData['secenekD']?.toString() ?? '';

            formattedSorular.add({
              'soru': soruMetni,
              'a': secenekA,
              'b': secenekB,
              'c': secenekC,
              'd': secenekD,
              'cevap': soruData['dogruCevap']?.toString() ?? 'a'
            });
          }

          print('✅ ${formattedSorular.length} soru hazırlandı');

          return {
            '_id': testId,
            'testAdi': testData['ad'] ?? testAdi,
            'sorular': formattedSorular,
          };
        } else {
          print('❌ Test bulundu ama soruları yok!');
          return null;
        }
      }

      print('❌ Test bulunamadı: $testAdi');
      return null;
    } catch (e) {
      print('❌ Test detayları alınırken hata: $e');
      return null;
    }
  }

  // TEST SONUCU KAYDET
  static Future<bool> saveTestSonuc(Map<String, dynamic> sonuc) async {
    try {
      await _firestore.collection('test_sonuclari').add(sonuc);
      print('✅ Test sonucu kaydedildi');
      return true;
    } catch (e) {
      print('❌ Test sonucu kaydetme hatası: $e');
      return false;
    }
  }

  // ÇOCUKTAN TEST SİL (KALICI)
  static Future<bool> deleteTestFromChild(String testId) async {
    try {
      // test_sonuclari koleksiyonundan bu testi içeren dokümanları bul ve sil
      final QuerySnapshot testSonuclariSnapshot = await _firestore
          .collection('test_sonuclari')
          .where('testId', isEqualTo: testId)
          .get();

      for (var doc in testSonuclariSnapshot.docs) {
        await doc.reference.delete();
        print('✅ Test sonucu silindi: ${doc.id}');
      }

      // Ayrıca testler koleksiyonundan da sil
      final QuerySnapshot testlerSnapshot = await _firestore
          .collection('testler')
          .where('ad', isEqualTo: testId)
          .get();

      for (var doc in testlerSnapshot.docs) {
        await doc.reference.delete();
        print('✅ Test silindi: ${doc.id}');
      }

      return true;
    } catch (e) {
      print('❌ Test silme hatası: $e');
      return false;
    }
  }

  // KULLANICININ TEST SONUÇLARI
  static Future<List<Map<String, dynamic>>> getTestSonuclari(String userId, [String? cocukId]) async {
    try {
      Query query = _firestore.collection('test_sonuclari').where('userId', isEqualTo: userId);
      if (cocukId != null) {
        query = query.where('cocukId', isEqualTo: cocukId);
      }
      // orderBy kısmını kaldırdım - index gerektirmiyor
      final QuerySnapshot sonuclarSnapshot = await query.get();
      
      // Manuel olarak sıralama yapıyorum
      final List<Map<String, dynamic>> sonuclar = sonuclarSnapshot.docs.map((doc) {
        final data = doc.data() as Map<String, dynamic>;
        return {
          'id': doc.id,
          ...data,
        };
      }).toList();
      
      // createdAt'e göre manuel sıralama
      sonuclar.sort((a, b) {
        final aTime = a['createdAt'] as Timestamp?;
        final bTime = b['createdAt'] as Timestamp?;
        if (aTime == null && bTime == null) return 0;
        if (aTime == null) return 1;
        if (bTime == null) return -1;
        return bTime.compareTo(aTime); // En yeni önce
      });
      
      return sonuclar;
    } catch (e) {
      print('❌ Firebase test sonuçları hatası: $e');
      return <Map<String, dynamic>>[];
    }
  }

  // HİKAYELER
  static Future<List<Map<String, dynamic>>> getHikayeler() async {
    try {
      final QuerySnapshot hikayelerSnapshot = await _firestore.collection('hikayeler').get();
      
      return hikayelerSnapshot.docs.map((doc) {
        final data = doc.data() as Map<String, dynamic>;
        return {
          'id': doc.id,
          ...data,
        };
      }).toList();
    } catch (e) {
      print('❌ Firebase hikayeler hatası: $e');
      return <Map<String, dynamic>>[];
    }
  }

  // KULLANICI İSTATİSTİKLERİ
  static Future<Map<String, dynamic>> getKullaniciIstatistikleri(String userId) async {
    try {
      final QuerySnapshot istatistiklerSnapshot = await _firestore
          .collection('istatistikler')
          .where('userId', isEqualTo: userId)
          .get();
      
      if (istatistiklerSnapshot.docs.isNotEmpty) {
        final data = istatistiklerSnapshot.docs.first.data() as Map<String, dynamic>;
        return {
          'id': istatistiklerSnapshot.docs.first.id,
          ...data,
        };
      }
      
      return <String, dynamic>{};
    } catch (e) {
      print('❌ Firebase kullanıcı istatistikleri hatası: $e');
      return <String, dynamic>{};
    }
  }

  // İSTATİSTİK GÜNCELLE
  static Future<bool> updateIstatistik(String userId, Map<String, dynamic> yeniVeriler) async {
    try {
      await _firestore.collection('istatistikler').doc(userId).set(yeniVeriler, SetOptions(merge: true));
      return true;
    } catch (e) {
      print('❌ Firebase istatistik güncelleme hatası: $e');
      return false;
    }
  }
} 