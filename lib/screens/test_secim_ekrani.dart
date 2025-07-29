import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../services/firebase_service.dart';
import 'test_cozme_ekrani.dart';

class TestSecimEkrani extends StatefulWidget {
  final String userId;
  final String sinif;

  const TestSecimEkrani({
    super.key,
    required this.userId,
    required this.sinif,
  });

  @override
  State<TestSecimEkrani> createState() => _TestSecimEkraniState();
}

class _TestSecimEkraniState extends State<TestSecimEkrani> {
  List<dynamic> veliTestleri = [];
  bool veliTestleriYukleniyor = false;

  @override
  void initState() {
    super.initState();
    _veliTestleriniYukle();
  }

  Future<void> _veliTestleriniYukle() async {
    setState(() {
      veliTestleriYukleniyor = true;
    });

    try {
      print('🔍 Veli testleri yükleniyor... child_1 için');
      // Firebase'den velinin seçtiği testleri getir
      final testSonuclari = await FirebaseService.getTestSonuclari('parent_1', 'child_1');
      print('📊 Firebase den dönen test sayısı: ${testSonuclari.length}');
      
      // Test sonuçlarından testleri çıkar ve null testleri filtrele
      List<dynamic> testler = [];
      for (var sonuc in testSonuclari) {
        if (sonuc['testler'] != null && sonuc['testler'] is List) {
          for (var test in sonuc['testler']) {
            // Null testleri filtrele
            if (test['ad'] != null && 
                test['ad'].toString().isNotEmpty && 
                test['ad'] != 'null' &&
                test['sinifAdi'] != null && 
                test['dersAdi'] != null && 
                test['konuAdi'] != null) {
              
              testler.add({
                'id': test['id'],
                'testAdi': test['ad'],
                'sinif': test['sinifAdi'],
                'ders': test['dersAdi'],
                'konu': test['konuAdi'],
                'soru_sayisi': test['soru_sayisi'],
                'testSayisi': sonuc['testSayisi'],
                'soruBasiXp': sonuc['soruBasiXp'],
                'toplamXp': sonuc['toplamXp'],
              });
            } else {
              print('⚠️ Null test filtrelendi: ${test['ad']}');
            }
          }
        }
      }
      
      setState(() {
        veliTestleri = testler;
        veliTestleriYukleniyor = false;
      });
      print('✅ Veli testleri yüklendi: ${testler.length} test');
      
      // Test detaylarini yazdir
      if (testler.isNotEmpty) {
        for (int index = 0; index < testler.length; index++) {
          final test = testler[index];
          print('  Test ${index + 1}: ${test['testAdi']} (${test['sinif']} - ${test['ders']} - ${test['konu']})');
        }
      }
    } catch (e) {
      print('❌ Veli testleri yüklenemedi: $e');
      setState(() {
        veliTestleri = [];
        veliTestleriYukleniyor = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Firebase bağlantı sorunu. Testler yüklenemedi.'),
          backgroundColor: Colors.orange,
          duration: Duration(seconds: 3),
        ),
      );
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
      ),
    );
  }

  // Test silme fonksiyonu - Kalıcı silme
  void _testSil(int index) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Testi Sil'),
          content: Text('Bu testi kalıcı olarak silmek istediğinizden emin misiniz?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text('İptal'),
            ),
            TextButton(
              onPressed: () async {
                Navigator.of(context).pop();
                
                // Loading göster
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Row(
                      children: [
                        SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                          ),
                        ),
                        SizedBox(width: 16),
                        Text('Test siliniyor...'),
                      ],
                    ),
                    backgroundColor: Colors.orange,
                    duration: Duration(seconds: 2),
                  ),
                );

                try {
                  final test = veliTestleri[index];
                  print('🗑️ Test siliniyor: ${test['testAdi']}');
                  
                  // 1. test_sonuclari koleksiyonundan sil
                  if (test['id'] != null) {
                    await FirebaseFirestore.instance
                        .collection('test_sonuclari')
                        .doc(test['id'])
                        .delete();
                    print('✅ test_sonuclari\'dan silindi');
                  }
                  
                  // 2. Veli test ayarlarından da sil
                  final veliAyarlariQuery = await FirebaseFirestore.instance
                      .collection('veli_test_ayarlari')
                      .where('veliId', isEqualTo: 'parent_1')
                      .where('cocukId', isEqualTo: 'child_1')
                      .get();
                  
                  if (veliAyarlariQuery.docs.isNotEmpty) {
                    final veliAyarlariDoc = veliAyarlariQuery.docs.first;
                    final veliAyarlari = veliAyarlariDoc.data();
                    
                    if (veliAyarlari['seciliTestler'] != null) {
                      List<dynamic> seciliTestler = List.from(veliAyarlari['seciliTestler']);
                      
                      // Test ID'sine göre sil
                      seciliTestler.removeWhere((testData) => 
                          testData['id'] == test['id'] || 
                          testData['ad'] == test['testAdi']);
                      
                      // Güncellenmiş listeyi kaydet
                      await veliAyarlariDoc.reference.update({
                        'seciliTestler': seciliTestler,
                        'guncellemeTarihi': FieldValue.serverTimestamp(),
                      });
                      print('✅ veli_test_ayarlari\'dan silindi');
                    }
                  }
                  
                  // 3. Yerel listeden sil
                  setState(() {
                    veliTestleri.removeAt(index);
                  });
                  
                  // Başarı mesajı
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('✅ Test kalıcı olarak silindi!'),
                      backgroundColor: Colors.green,
                      duration: Duration(seconds: 3),
                    ),
                  );
                  
                  print('🎉 Test başarıyla silindi');
                  
                } catch (e) {
                  print('❌ Test silme hatası: $e');
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('❌ Test silinirken hata oluştu: $e'),
                      backgroundColor: Colors.red,
                      duration: Duration(seconds: 5),
                    ),
                  );
                }
              },
              child: Text('Kalıcı Olarak Sil', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.orange[100],
      appBar: AppBar(
        title: const Text('Velinizin Seçtiği Testler'),
        backgroundColor: Colors.orange,
        foregroundColor: Colors.white,
      ),
      body: veliTestleriYukleniyor
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(
                    color: Colors.orange.shade600,
                  ),
                  SizedBox(height: 16),
                  Text(
                    'Testler yükleniyor...',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.grey.shade600,
                    ),
                  ),
                ],
              ),
            )
          : veliTestleri.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.quiz,
                        size: 64,
                        color: Colors.grey.shade400,
                      ),
                      SizedBox(height: 16),
                      Text(
                        'Henüz test seçilmemiş',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey.shade600,
                        ),
                      ),
                      SizedBox(height: 8),
                      Text(
                        'Veliniz size test seçtiğinde burada görünecek',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey.shade500,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                )
              : Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Başlık
                      Container(
                        padding: EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [Colors.orange.shade100, Colors.orange.shade200],
                          ),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: Colors.orange.shade300),
                        ),
                        child: Row(
                          children: [
                            Icon(
                              Icons.favorite,
                              color: Colors.red.shade600,
                              size: 32,
                            ),
                            SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Velinizin Seçtiği Testler',
                                    style: TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.grey.shade800,
                                    ),
                                  ),
                                  SizedBox(height: 4),
                                  Text(
                                    '${veliTestleri.length} test hazır',
                                    style: TextStyle(
                                      fontSize: 14,
                                      color: Colors.grey.shade600,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      SizedBox(height: 20),
                      
                      // Test listesi
                      Expanded(
                        child: ListView.builder(
                          itemCount: veliTestleri.length,
                          itemBuilder: (context, index) {
                            final test = veliTestleri[index];
                            
                            return Container(
                              margin: EdgeInsets.only(bottom: 16),
                              child: Card(
                                elevation: 4,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                child: InkWell(
                                  onTap: () {
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (context) => TestCozmeEkrani(
                                          testAdi: test['testAdi'] ?? test['ad'] ?? '',
                                        ),
                                      ),
                                    );
                                  },
                                  onLongPress: () {
                                    _testSil(index);
                                  },
                                  borderRadius: BorderRadius.circular(16),
                                  child: Container(
                                    padding: EdgeInsets.all(20),
                                    decoration: BoxDecoration(
                                      borderRadius: BorderRadius.circular(16),
                                      gradient: LinearGradient(
                                        begin: Alignment.topLeft,
                                        end: Alignment.bottomRight,
                                        colors: [
                                          Colors.blue.shade50,
                                          Colors.blue.shade100,
                                        ],
                                      ),
                                      border: Border.all(
                                        color: Colors.blue.shade200,
                                        width: 2,
                                      ),
                                    ),
                                    child: Row(
                                      children: [
                                        Container(
                                          padding: EdgeInsets.all(12),
                                          decoration: BoxDecoration(
                                            color: Colors.blue.shade100,
                                            borderRadius: BorderRadius.circular(12),
                                          ),
                                          child: Icon(
                                            Icons.quiz,
                                            color: Colors.blue.shade600,
                                            size: 28,
                                          ),
                                        ),
                                        SizedBox(width: 16),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                test['testAdi'] ?? 'Test Adı Yok',
                                                style: TextStyle(
                                                  fontSize: 18,
                                                  fontWeight: FontWeight.w600,
                                                  color: Colors.grey.shade800,
                                                ),
                                              ),
                                              SizedBox(height: 8),
                                              Text(
                                                '${test['sinif']} - ${test['ders']} - ${test['konu']}',
                                                style: TextStyle(
                                                  fontSize: 14,
                                                  color: Colors.grey.shade600,
                                                ),
                                              ),
                                              SizedBox(height: 8),
                                              Row(
                                                children: [
                                                  if (test['soru_sayisi'] != null) ...[
                                                    Icon(
                                                      Icons.question_answer,
                                                      size: 16,
                                                      color: Colors.green.shade600,
                                                    ),
                                                    SizedBox(width: 4),
                                                    Text(
                                                      '${test['soru_sayisi']} soru',
                                                      style: TextStyle(
                                                        fontSize: 12,
                                                        color: Colors.green.shade600,
                                                        fontWeight: FontWeight.w500,
                                                      ),
                                                    ),
                                                    SizedBox(width: 16),
                                                  ],
                                                  if (test['toplamXp'] != null) ...[
                                                    Icon(
                                                      Icons.star,
                                                      size: 16,
                                                      color: Colors.orange.shade600,
                                                    ),
                                                    SizedBox(width: 4),
                                                    Text(
                                                      '${test['toplamXp']} XP',
                                                      style: TextStyle(
                                                        fontSize: 12,
                                                        color: Colors.orange.shade600,
                                                        fontWeight: FontWeight.w500,
                                                      ),
                                                    ),
                                                  ],
                                                ],
                                              ),
                                            ],
                                          ),
                                        ),
                                        Row(
                                          children: [
                                            IconButton(
                                              onPressed: () => _testSil(index),
                                              icon: Icon(
                                                Icons.delete,
                                                color: Colors.red.shade600,
                                                size: 24,
                                              ),
                                              tooltip: 'Testi Sil',
                                            ),
                                            Icon(
                                              Icons.play_circle_fill,
                                              color: Colors.blue.shade600,
                                              size: 32,
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                ),
    );
  }
} 