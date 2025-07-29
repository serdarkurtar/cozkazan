import 'package:flutter/material.dart';
import '../services/firebase_service.dart';

class VeliTestAyarEkrani extends StatefulWidget {
  const VeliTestAyarEkrani({Key? key}) : super(key: key);

  @override
  State<VeliTestAyarEkrani> createState() => _VeliTestAyarEkraniState();
}

class _VeliTestAyarEkraniState extends State<VeliTestAyarEkrani> {
  // Sınıf seçimi için
  String? secilenSinif;
  List<String> siniflar = ['1. Sınıf', '2. Sınıf', '3. Sınıf', '4. Sınıf']; // Doğru sıralama
  
  // Test listesi için
  List<Map<String, dynamic>> secilenTestler = [];
  bool kaydediliyor = false;

  // XP ayarları
  int testSayisi = 5;
  int soruBasiXp = 15;

  // Sınıf renkleri
  final List<Color> sinifRenkleri = [
    Color(0xFF4CAF50), // 1. Sınıf - Yeşil
    Color(0xFF2196F3), // 2. Sınıf - Mavi
    Color(0xFFFF9800), // 3. Sınıf - Turuncu
    Color(0xFF9C27B0), // 4. Sınıf - Mor
  ];

  @override
  void initState() {
    super.initState();
    _kayitliTestleriYukle();
  }

  // Kayıtlı testleri yükle
  Future<void> _kayitliTestleriYukle() async {
    try {
      final kayitliTestler = await FirebaseService.getTestSonuclari('parent_1');
      if (kayitliTestler.isNotEmpty) {
        // Null testleri filtrele
        final filteredTestler = kayitliTestler.where((test) => 
          test['ad'] != null && 
          test['ad'].toString().isNotEmpty && 
          test['ad'] != 'null' &&
          test['dersAdi'] != null && 
          test['konuAdi'] != null
        ).toList();
        
        setState(() {
          secilenTestler = filteredTestler;
        });
        print('✅ Filtrelenmiş test sayısı: ${filteredTestler.length}');
      }
    } catch (e) {
      print('❌ Kayıtlı testler yüklenemedi: $e');
    }
  }

  // Sınıf seçildiğinde - Sınıf sayfasına git
  void _sinifSecildi(String sinif) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => SinifSayfasi(
          sinif: sinif,
          secilenTestler: secilenTestler,
        ),
      ),
    );
  }

  // Test seçimi kaydet
  Future<void> _testSecimiKaydet() async {
    if (secilenTestler.isEmpty) {
      _showSuccess('Lütfen en az bir test seçin');
      return;
    }

    setState(() {
      kaydediliyor = true;
    });

    try {
      final success = await FirebaseService.saveTestSonuc({
        'userId': 'parent_1',
        'cocukId': 'child_1',
        'testler': secilenTestler,
        'testSayisi': testSayisi,
        'soruBasiXp': soruBasiXp,
        'toplamXp': testSayisi * soruBasiXp,
        'guncellemeTarihi': DateTime.now().toIso8601String(),
      });
      
      setState(() {
        kaydediliyor = false;
      });
      
      if (success) {
        _showSuccess('Test ayarları başarıyla kaydedildi!');
      } else {
        _showSuccess('Test ayarları kaydedilemedi');
      }
    } catch (e) {
      setState(() {
        kaydediliyor = false;
      });
      print('❌ Test ayarları kaydedilemedi: $e');
      _showSuccess('Test ayarları kaydedilemedi');
    }
  }

  // Başarı mesajı göster
  void _showSuccess(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.green,
        duration: Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Test Ayarları'),
        backgroundColor: Colors.blue.shade600,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Colors.blue.shade50,
              Colors.white,
            ],
          ),
        ),
        child: SingleChildScrollView(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Sınıf seçimi
              Text(
                'Sınıf Seçin',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey.shade800,
                ),
              ),
              SizedBox(height: 20),
              
              // Sınıf butonları - Alt alta
              ...siniflar.asMap().entries.map((entry) {
                final index = entry.key;
                final sinif = entry.value;
                final renk = sinifRenkleri[index];
                
                return Container(
                  margin: EdgeInsets.only(bottom: 16),
                  child: InkWell(
                    onTap: () => _sinifSecildi(sinif),
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
                      width: double.infinity,
                      height: 80,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            renk,
                            renk.withOpacity(0.8),
                          ],
                        ),
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [
                          BoxShadow(
                            color: renk.withOpacity(0.3),
                            blurRadius: 8,
                            offset: Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Row(
                        children: [
                          SizedBox(width: 24),
                          Icon(
                            Icons.school,
                            color: Colors.white,
                            size: 32,
                          ),
                          SizedBox(width: 20),
                          Expanded(
                            child: Text(
                              sinif,
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                          ),
                          Icon(
                            Icons.arrow_forward_ios,
                            color: Colors.white,
                            size: 20,
                          ),
                          SizedBox(width: 24),
                        ],
                      ),
                    ),
                  ),
                );
              }).toList(),
              
              SizedBox(height: 32),
              
              // Seçilen testler
              if (secilenTestler.isNotEmpty) ...[
                Text(
                  'Seçilen Testler (${secilenTestler.length})',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.green.shade800,
                  ),
                ),
                SizedBox(height: 16),
                ...secilenTestler.map((test) => Card(
                  margin: EdgeInsets.only(bottom: 12),
                  elevation: 4,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: ListTile(
                    leading: Icon(Icons.check_circle, color: Colors.green, size: 28),
                    title: Text(
                      test['ad'] ?? 'Test',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    subtitle: Text(
                      '${test['dersAdi']} - ${test['konuAdi']}',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey.shade600,
                      ),
                    ),
                    trailing: IconButton(
                      icon: Icon(Icons.remove_circle, color: Colors.red, size: 28),
                      onPressed: () async {
                        // Firebase'den de kalıcı olarak sil
                        try {
                          if (test['id'] != null) {
                            await FirebaseService.deleteTestFromChild(test['id']);
                          }
                        } catch (e) {
                          print('❌ Firebase\'den test silme hatası: $e');
                        }
                        
                        setState(() {
                          secilenTestler.removeWhere((t) => t['id'] == test['id']);
                        });
                      },
                    ),
                  ),
                )).toList(),
                SizedBox(height: 24),
                
                // XP Ayarları
                Card(
                  elevation: 4,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Padding(
                    padding: EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'XP Ayarları',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.grey.shade800,
                          ),
                        ),
                        SizedBox(height: 20),
                        
                        // Test Sayısı
                        Row(
                          children: [
                            Expanded(
                              child: Text(
                                'Test Sayısı:',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                            Container(
                              padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                color: Colors.blue.shade100,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                '$testSayisi',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.blue.shade800,
                                ),
                              ),
                            ),
                          ],
                        ),
                        Slider(
                          value: testSayisi.toDouble(),
                          min: 1,
                          max: 20,
                          divisions: 19,
                          activeColor: Colors.blue,
                          onChanged: (value) {
                            setState(() {
                              testSayisi = value.round();
                            });
                          },
                        ),
                        SizedBox(height: 20),
                        
                        // Soru Başı XP
                        Row(
                          children: [
                            Expanded(
                              child: Text(
                                'Soru Başı XP:',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                            Container(
                              padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                color: Colors.green.shade100,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                '$soruBasiXp',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.green.shade800,
                                ),
                              ),
                            ),
                          ],
                        ),
                        Slider(
                          value: soruBasiXp.toDouble(),
                          min: 5,
                          max: 50,
                          divisions: 9,
                          activeColor: Colors.green,
                          onChanged: (value) {
                            setState(() {
                              soruBasiXp = value.round();
                            });
                          },
                        ),
                        SizedBox(height: 20),
                        
                        // Toplam XP
                        Container(
                          width: double.infinity,
                          padding: EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [Colors.orange.shade100, Colors.orange.shade200],
                            ),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: Colors.orange.shade300),
                          ),
                          child: Row(
                            children: [
                              Icon(
                                Icons.star,
                                color: Colors.orange.shade700,
                                size: 24,
                              ),
                              SizedBox(width: 12),
                              Text(
                                'Toplam XP: ${testSayisi * soruBasiXp}',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.orange.shade800,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                SizedBox(height: 24),
                
                // Kaydet butonu
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton(
                    onPressed: kaydediliyor ? null : _testSecimiKaydet,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green.shade600,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      elevation: 4,
                    ),
                    child: kaydediliyor
                        ? Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              SizedBox(
                                width: 24,
                                height: 24,
                                child: CircularProgressIndicator(
                                  color: Colors.white,
                                  strokeWidth: 2,
                                ),
                              ),
                              SizedBox(width: 12),
                              Text(
                                'Kaydediliyor...',
                                style: TextStyle(fontSize: 16),
                              ),
                            ],
                          )
                        : Text(
                            'Test Ayarlarını Kaydet',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

// Sınıf sayfası
class SinifSayfasi extends StatefulWidget {
  final String sinif;
  final List<Map<String, dynamic>> secilenTestler;

  const SinifSayfasi({
    Key? key,
    required this.sinif,
    required this.secilenTestler,
  }) : super(key: key);

  @override
  State<SinifSayfasi> createState() => _SinifSayfasiState();
}

class _SinifSayfasiState extends State<SinifSayfasi> {
  List<String> dersler = [];
  bool derslerYukleniyor = true;

  // Ders renkleri
  final List<Color> dersRenkleri = [
    Color(0xFF4CAF50), // Türkçe - Yeşil
    Color(0xFF2196F3), // Matematik - Mavi
    Color(0xFFFF9800), // Hayat Bilgisi - Turuncu
    Color(0xFF9C27B0), // Fen Bilimleri - Mor
    Color(0xFFF44336), // Sosyal Bilgiler - Kırmızı
    Color(0xFF795548), // Din Kültürü - Kahverengi
    Color(0xFF607D8B), // İnsan Hakları - Gri
  ];

  @override
  void initState() {
    super.initState();
    _dersleriYukle();
  }

  Future<void> _dersleriYukle() async {
    try {
      final sinifDersListesi = await FirebaseService.getSinifDersListesi();
      final sinifDersler = sinifDersListesi[widget.sinif] ?? <String>[];
      setState(() {
        dersler = sinifDersler;
        derslerYukleniyor = false;
      });
    } catch (e) {
      print('❌ Dersler yüklenemedi: $e');
      setState(() {
        dersler = ['Türkçe', 'Matematik', 'Hayat Bilgisi', 'Fen Bilimleri', 'Sosyal Bilgiler'];
        derslerYukleniyor = false;
      });
    }
  }

  void _dersSecildi(String ders) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => DersSayfasi(
          sinif: widget.sinif,
          ders: ders,
          secilenTestler: widget.secilenTestler,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.sinif} - Dersler'),
        backgroundColor: Colors.blue.shade600,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Colors.blue.shade50,
              Colors.white,
            ],
          ),
        ),
        child: derslerYukleniyor
            ? Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    CircularProgressIndicator(),
                    SizedBox(height: 16),
                    Text('Dersler yükleniyor...'),
                  ],
                ),
              )
            : SingleChildScrollView(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Ders Seçin',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.grey.shade800,
                      ),
                    ),
                    SizedBox(height: 20),
                    
                    // Ders butonları - Alt alta
                    ...dersler.asMap().entries.map((entry) {
                      final index = entry.key;
                      final ders = entry.value;
                      final renk = dersRenkleri[index % dersRenkleri.length];
                      
                      return Container(
                        margin: EdgeInsets.only(bottom: 16),
                        child: InkWell(
                          onTap: () => _dersSecildi(ders),
                          borderRadius: BorderRadius.circular(16),
                          child: Container(
                            width: double.infinity,
                            height: 80,
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                                colors: [
                                  renk,
                                  renk.withOpacity(0.8),
                                ],
                              ),
                              borderRadius: BorderRadius.circular(16),
                              boxShadow: [
                                BoxShadow(
                                  color: renk.withOpacity(0.3),
                                  blurRadius: 8,
                                  offset: Offset(0, 4),
                                ),
                              ],
                            ),
                            child: Row(
                              children: [
                                SizedBox(width: 24),
                                Icon(
                                  Icons.book,
                                  color: Colors.white,
                                  size: 32,
                                ),
                                SizedBox(width: 20),
                                Expanded(
                                  child: Text(
                                    ders,
                                    style: TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white,
                                    ),
                                  ),
                                ),
                                Icon(
                                  Icons.arrow_forward_ios,
                                  color: Colors.white,
                                  size: 20,
                                ),
                                SizedBox(width: 24),
                              ],
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ],
                ),
              ),
      ),
    );
  }
}

// Ders sayfası
class DersSayfasi extends StatefulWidget {
  final String sinif;
  final String ders;
  final List<Map<String, dynamic>> secilenTestler;

  const DersSayfasi({
    Key? key,
    required this.sinif,
    required this.ders,
    required this.secilenTestler,
  }) : super(key: key);

  @override
  State<DersSayfasi> createState() => _DersSayfasiState();
}

class _DersSayfasiState extends State<DersSayfasi> {
  List<String> konular = [];
  bool konularYukleniyor = true;

  @override
  void initState() {
    super.initState();
    _konulariYukle();
  }

  Future<void> _konulariYukle() async {
    try {
      final konuListesi = await FirebaseService.getKonular(widget.sinif, widget.ders);
      setState(() {
        konular = konuListesi;
        konularYukleniyor = false;
      });
    } catch (e) {
      print('❌ Konular yüklenemedi: $e');
      setState(() {
        konular = <String>[];
        konularYukleniyor = false;
      });
    }
  }

  void _konuSecildi(String konu) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => KonuSayfasi(
          sinif: widget.sinif,
          ders: widget.ders,
          konu: konu,
          secilenTestler: widget.secilenTestler,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.ders} - Konular'),
        backgroundColor: Colors.green.shade600,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Colors.green.shade50,
              Colors.white,
            ],
          ),
        ),
        child: konularYukleniyor
            ? Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    CircularProgressIndicator(),
                    SizedBox(height: 16),
                    Text('Konular yükleniyor...'),
                  ],
                ),
              )
            : SingleChildScrollView(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Konu Seçin',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.grey.shade800,
                      ),
                    ),
                    SizedBox(height: 20),
                    
                    // Konu butonları - Liste formatı
                    ...konular.asMap().entries.map((entry) {
                      final index = entry.key;
                      final konu = entry.value;
                      
                      return Container(
                        margin: EdgeInsets.only(bottom: 12),
                        child: Card(
                          elevation: 4,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: InkWell(
                            onTap: () => _konuSecildi(konu),
                            borderRadius: BorderRadius.circular(16),
                            child: Container(
                              padding: EdgeInsets.all(20),
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(16),
                                gradient: LinearGradient(
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                  colors: [
                                    Colors.orange.shade100,
                                    Colors.orange.shade200,
                                  ],
                                ),
                              ),
                              child: Row(
                                children: [
                                  Icon(
                                    Icons.topic,
                                    color: Colors.orange.shade700,
                                    size: 28,
                                  ),
                                  SizedBox(width: 20),
                                  Expanded(
                                    child: Text(
                                      konu,
                                      style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.w600,
                                        color: Colors.grey.shade800,
                                      ),
                                    ),
                                  ),
                                  Icon(
                                    Icons.arrow_forward_ios,
                                    color: Colors.orange.shade700,
                                    size: 20,
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ],
                ),
              ),
      ),
    );
  }
}

// Konu sayfası
class KonuSayfasi extends StatefulWidget {
  final String sinif;
  final String ders;
  final String konu;
  final List<Map<String, dynamic>> secilenTestler;

  const KonuSayfasi({
    Key? key,
    required this.sinif,
    required this.ders,
    required this.konu,
    required this.secilenTestler,
  }) : super(key: key);

  @override
  State<KonuSayfasi> createState() => _KonuSayfasiState();
}

class _KonuSayfasiState extends State<KonuSayfasi> {
  List<String> mevcutTestler = [];
  bool testlerYukleniyor = true;
  
  // Test ayarları
  int testSayisi = 5;
  int soruBasiXp = 15;
  bool ayarlarGosteriliyor = false;

  @override
  void initState() {
    super.initState();
    _testleriYukle();
  }

  Future<void> _testleriYukle() async {
    try {
      print('🔍 Testler yükleniyor:  [33m${widget.sinif} - ${widget.ders} - ${widget.konu} [0m');
      final testListesi = await FirebaseService.getTestler(widget.sinif, widget.ders, widget.konu);
      print('✅ ${testListesi.length} test bulundu');
      setState(() {
        mevcutTestler = testListesi;
        testlerYukleniyor = false;
      });
    } catch (e) {
      print('❌ Testler yüklenemedi: $e');
      setState(() {
        mevcutTestler = [];
        testlerYukleniyor = false;
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

  void _testEkle(String testAdi) {
    setState(() {
      if (!widget.secilenTestler.any((t) => t['ad'] == testAdi)) {
        widget.secilenTestler.add({
          'id': 'test_${DateTime.now().millisecondsSinceEpoch}',
          'ad': testAdi,
          'dersAdi': widget.ders,
          'konuAdi': widget.konu,
          'sinifAdi': widget.sinif,
          'soru_sayisi': 10,
          'zorluk': 'orta',
          'sure': 15,
        });
      }
    });
  }

  void _testCikar(String testAdi) {
    setState(() {
      widget.secilenTestler.removeWhere((t) => t['ad'] == testAdi);
    });
  }

  void _testleriCocukPanelineGonder() {
    if (widget.secilenTestler.isEmpty) {
      _showMessage('Lütfen en az bir test seçin');
      return;
    }

    // Test ayarlarını kaydet ve çocuk paneline yönlendir
    _testAyarlariniKaydet();
  }

  Future<void> _testAyarlariniKaydet() async {
    try {
      final success = await FirebaseService.saveTestSonuc({
        'userId': 'parent_1',
        'cocukId': 'child_1',
        'sinif': widget.sinif,
        'ders': widget.ders,
        'konu': widget.konu,
        'testler': widget.secilenTestler,
        'testSayisi': testSayisi,
        'soruBasiXp': soruBasiXp,
        'toplamXp': testSayisi * soruBasiXp,
        'guncellemeTarihi': DateTime.now().toIso8601String(),
      });
      
      if (success) {
        _showMessage('Testler çocuk paneline gönderildi! 🎉');
        // Ana sayfaya dön
        Navigator.of(context).popUntil((route) => route.isFirst);
      } else {
        _showMessage('Testler gönderilemedi');
      }
    } catch (e) {
      print('❌ Test ayarları kaydedilemedi: $e');
      _showMessage('Testler gönderilemedi');
    }
  }

  void _showMessage(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.green,
        duration: Duration(seconds: 3),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.konu} - Testler'),
        backgroundColor: Colors.orange.shade600,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          if (widget.secilenTestler.isNotEmpty)
            IconButton(
              icon: Icon(Icons.settings),
              onPressed: () {
                setState(() {
                  ayarlarGosteriliyor = !ayarlarGosteriliyor;
                });
              },
            ),
        ],
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Colors.orange.shade50,
              Colors.white,
            ],
          ),
        ),
        child: testlerYukleniyor
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
            : Column(
                children: [
                  // Seçilen testler özeti
                  if (widget.secilenTestler.isNotEmpty)
                    Container(
                      margin: EdgeInsets.all(16),
                      padding: EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [Colors.green.shade100, Colors.green.shade200],
                        ),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.green.shade300),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            Icons.check_circle,
                            color: Colors.green.shade700,
                            size: 32,
                          ),
                          SizedBox(width: 16),
                          Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                                Text(
                                  '${widget.secilenTestler.length} Test Seçildi',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.green.shade800,
                                  ),
                                ),
                                Text(
                                  'Toplam XP: ${testSayisi * soruBasiXp}',
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: Colors.green.shade700,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          ElevatedButton.icon(
                            onPressed: _testleriCocukPanelineGonder,
                            icon: Icon(Icons.send),
                            label: Text('Çocuk Paneline Gönder'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.green.shade600,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),

                  // Test ayarları
                  if (ayarlarGosteriliyor && widget.secilenTestler.isNotEmpty)
                    Container(
                      margin: EdgeInsets.symmetric(horizontal: 16),
                      child: Card(
                        elevation: 4,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Padding(
                          padding: EdgeInsets.all(20),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Icon(
                                    Icons.settings,
                                    color: Colors.blue.shade600,
                                    size: 24,
                                  ),
                                  SizedBox(width: 12),
                                  Text(
                                    'Test Ayarları',
                                    style: TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.grey.shade800,
                                    ),
                                  ),
                                ],
                              ),
                              SizedBox(height: 20),
                              
                              // Test Sayısı
                              Row(
                                children: [
                                  Expanded(
                                    child: Text(
                                      'Test Sayısı:',
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ),
                                  Container(
                                    padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                    decoration: BoxDecoration(
                                      color: Colors.blue.shade100,
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Text(
                                      '$testSayisi',
                                      style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.blue.shade800,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              Slider(
                                value: testSayisi.toDouble(),
                                min: 1,
                                max: 20,
                                divisions: 19,
                                activeColor: Colors.blue,
                                onChanged: (value) {
                                  setState(() {
                                    testSayisi = value.round();
                                  });
                                },
                              ),
                              SizedBox(height: 20),
                              
                              // Soru Başı XP
                              Row(
                                children: [
                    Expanded(
                                    child: Text(
                                      'Soru Başı XP:',
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ),
                                  Container(
                                    padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                    decoration: BoxDecoration(
                                      color: Colors.green.shade100,
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Text(
                                      '$soruBasiXp',
                                      style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.green.shade800,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              Slider(
                                value: soruBasiXp.toDouble(),
                                min: 5,
                                max: 50,
                                divisions: 9,
                                activeColor: Colors.green,
                                onChanged: (value) {
                                  setState(() {
                                    soruBasiXp = value.round();
                                  });
                                },
                              ),
                              SizedBox(height: 20),
                              
                              // Toplam XP
                              Container(
                                width: double.infinity,
                                padding: EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    colors: [Colors.orange.shade100, Colors.orange.shade200],
                                  ),
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: Colors.orange.shade300),
                                ),
                                child: Row(
                                  children: [
                                    Icon(
                                      Icons.star,
                                      color: Colors.orange.shade700,
                                      size: 24,
                                    ),
                                    SizedBox(width: 12),
                                    Text(
                                      'Toplam XP: ${testSayisi * soruBasiXp}',
                                      style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.orange.shade800,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),

                  // Test listesi
                  Expanded(
                    child: mevcutTestler.isEmpty
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
                                  'Bu konuda henüz test bulunmuyor',
                                  style: TextStyle(
                                    fontSize: 16,
                                    color: Colors.grey.shade600,
                                  ),
                                ),
                              ],
                            ),
                          )
                        : ListView.builder(
                            padding: EdgeInsets.all(16),
                            itemCount: mevcutTestler.length,
                            itemBuilder: (context, index) {
                              final testAdi = mevcutTestler[index];
                              final secili = widget.secilenTestler.any((t) => t['ad'] == testAdi);
                              
                              return Container(
                                margin: EdgeInsets.only(bottom: 16),
                                child: Card(
                                  elevation: 4,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(16),
                                  ),
                                  child: InkWell(
                                    onTap: () {
                                      if (secili) {
                                        _testCikar(testAdi);
                                      } else {
                                        _testEkle(testAdi);
                                      }
                                    },
                                    borderRadius: BorderRadius.circular(16),
                                    child: Container(
                                      padding: EdgeInsets.all(20),
                                      decoration: BoxDecoration(
                                        borderRadius: BorderRadius.circular(16),
                                        gradient: LinearGradient(
                                          begin: Alignment.topLeft,
                                          end: Alignment.bottomRight,
                                          colors: secili
                                              ? [Colors.green.shade100, Colors.green.shade200]
                                              : [Colors.white, Colors.grey.shade50],
                                        ),
                                        border: Border.all(
                                          color: secili ? Colors.green.shade300 : Colors.grey.shade200,
                                          width: 2,
                                        ),
                                      ),
                                      child: Row(
                                        children: [
                                          Icon(
                                            secili ? Icons.check_circle : Icons.radio_button_unchecked,
                                            color: secili ? Colors.green.shade600 : Colors.grey.shade400,
                                            size: 32,
                                          ),
                                          SizedBox(width: 20),
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              children: [
                                                Text(
                                                  testAdi,
                                                  style: TextStyle(
                                                    fontSize: 18,
                                                    fontWeight: FontWeight.w600,
                                                    color: secili ? Colors.green.shade800 : Colors.grey.shade800,
                                                  ),
                                                ),
                                                SizedBox(height: 8),
                                                Text(
                                                  '${widget.ders} - ${widget.konu}',
                                                  style: TextStyle(
                                                    fontSize: 14,
                                                    color: secili ? Colors.green.shade600 : Colors.grey.shade600,
                                                  ),
                                                ),
                                                SizedBox(height: 4),
                                                Row(
                                                  children: [
                                                    Icon(
                                                      Icons.quiz,
                                                      size: 16,
                                                      color: Colors.blue.shade600,
                                                    ),
                                                    SizedBox(width: 4),
                                                    Text(
                                                      '10 soru',
                                                      style: TextStyle(
                                                        fontSize: 12,
                                                        color: Colors.blue.shade600,
                                                        fontWeight: FontWeight.w500,
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                              ],
                                            ),
                                          ),
                                          Icon(
                                            secili ? Icons.remove_circle : Icons.add_circle,
                                            color: secili ? Colors.red.shade600 : Colors.green.shade600,
                                            size: 36,
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