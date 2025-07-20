import 'package:flutter/material.dart';
import '../services/api_service.dart';
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
  Map<String, List<String>> sinifDersListesi = {};
  String? secilenDers;
  List<dynamic> testler = [];
  bool yukleniyor = false;

  @override
  void initState() {
    super.initState();
    _sinifDersListesiniYukle();
  }

  Future<void> _sinifDersListesiniYukle() async {
    setState(() {
      yukleniyor = true;
    });

    try {
      final liste = await getSinifDersListesi();
      setState(() {
        sinifDersListesi = liste;
        yukleniyor = false;
      });
    } catch (e) {
      setState(() {
        yukleniyor = false;
      });
      _showError('Sınıf ders listesi yüklenemedi: $e');
    }
  }

  Future<void> _testleriYukle(String ders) async {
    setState(() {
      yukleniyor = true;
      secilenDers = ders;
    });

    try {
      final testListesi = await getTestler(widget.sinif, ders);
      setState(() {
        testler = testListesi;
        yukleniyor = false;
      });
    } catch (e) {
      setState(() {
        yukleniyor = false;
      });
      _showError('Testler yüklenemedi: $e');
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.orange[100],
      appBar: AppBar(
        title: Text('${widget.sinif} Testleri'),
        backgroundColor: Colors.orange[100],
        elevation: 0,
      ),
      body: yukleniyor
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Ders seçimi
                  if (secilenDers == null) ...[
                    Text(
                      'Ders Seçin',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.orange[800],
                      ),
                    ),
                    const SizedBox(height: 16),
                    Expanded(
                      child: GridView.builder(
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          crossAxisSpacing: 16,
                          mainAxisSpacing: 16,
                          childAspectRatio: 1.2,
                        ),
                        itemCount: sinifDersListesi[widget.sinif]?.length ?? 0,
                        itemBuilder: (context, index) {
                          final ders = sinifDersListesi[widget.sinif]![index];
                          return _buildDersKarti(ders);
                        },
                      ),
                    ),
                  ] else ...[
                    // Test listesi
                    Row(
                      children: [
                        IconButton(
                          onPressed: () {
                            setState(() {
                              secilenDers = null;
                              testler = [];
                            });
                          },
                          icon: const Icon(Icons.arrow_back),
                        ),
                        Expanded(
                          child: Text(
                            '$secilenDers Testleri',
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: Colors.orange[800],
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Expanded(
                      child: testler.isEmpty
                          ? Center(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(
                                    Icons.quiz,
                                    size: 80,
                                    color: Colors.orange[300],
                                  ),
                                  const SizedBox(height: 16),
                                  Text(
                                    'Bu ders için henüz test bulunmuyor',
                                    style: TextStyle(
                                      fontSize: 18,
                                      color: Colors.orange[600],
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    'Admin panelinden test ekleyebilirsiniz',
                                    style: TextStyle(
                                      fontSize: 14,
                                      color: Colors.orange[500],
                                    ),
                                  ),
                                ],
                              ),
                            )
                          : ListView.builder(
                              itemCount: testler.length,
                              itemBuilder: (context, index) {
                                final test = testler[index];
                                return _buildTestKarti(test);
                              },
                            ),
                    ),
                  ],
                ],
              ),
            ),
    );
  }

  Widget _buildDersKarti(String ders) {
    final dersIkonlari = {
      'Türkçe': Icons.book,
      'Matematik': Icons.calculate,
      'Hayat Bilgisi': Icons.people,
      'İngilizce': Icons.language,
      'Fen Bilimleri': Icons.science,
      'Sosyal Bilgiler': Icons.public,
      'Trafik Güvenliği': Icons.directions_car,
      'İnsan Hakları, Yurttaşlık ve Demokrasi': Icons.gavel,
    };

    return Card(
      elevation: 8,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: InkWell(
        onTap: () => _testleriYukle(ders),
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Colors.orange[100]!,
                Colors.orange[200]!,
              ],
            ),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                dersIkonlari[ders] ?? Icons.school,
                size: 48,
                color: Colors.orange[800],
              ),
              const SizedBox(height: 12),
              Text(
                ders,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.orange[800],
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Testleri Gör',
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.orange[600],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTestKarti(Map<String, dynamic> test) {
    final zorlukRenkleri = {
      'kolay': Colors.green,
      'orta': Colors.orange,
      'zor': Colors.red,
    };

    final zorlukMetinleri = {
      'kolay': 'Kolay',
      'orta': 'Orta',
      'zor': 'Zor',
    };

    return Card(
      elevation: 4,
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => TestCozmeEkrani(
                sinif: widget.sinif,
                ders: secilenDers!,
                testId: test['_id'],
                userId: widget.userId,
              ),
            ),
          );
        },
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              // Test ikonu
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: Colors.orange[100],
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  Icons.quiz,
                  color: Colors.orange[800],
                  size: 30,
                ),
              ),
              const SizedBox(width: 16),
              
              // Test bilgileri
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${secilenDers} Testi',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: zorlukRenkleri[test['zorluk']]?.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                              color: zorlukRenkleri[test['zorluk']] ?? Colors.grey,
                              width: 1,
                            ),
                          ),
                          child: Text(
                            zorlukMetinleri[test['zorluk']] ?? 'Orta',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: zorlukRenkleri[test['zorluk']] ?? Colors.grey,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          '${test['sorular']?.length ?? 0} Soru',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              
              // Başla butonu
              Icon(
                Icons.play_circle_filled,
                color: Colors.orange[800],
                size: 32,
              ),
            ],
          ),
        ),
      ),
    );
  }
} 