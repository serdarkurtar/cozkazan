import 'package:flutter/material.dart';
import 'package:confetti/confetti.dart';
import 'dart:math';
import '../services/xp_hedef_service.dart';
import '../services/api_service.dart';
import '../services/firebase_service.dart';

class XpHedefEkrani extends StatefulWidget {
  const XpHedefEkrani({super.key});

  @override
  State<XpHedefEkrani> createState() => _XpHedefEkraniState();
}

class _XpHedefEkraniState extends State<XpHedefEkrani> {
  List<XpHedefi> _hedefler = [];
  bool _yukleniyor = true;
  String? _hata;
  
  // Test için sabit çocuk ID'si (gerçek uygulamada dinamik olacak)
  final String _testChildId = 'test_cocuk_1';
  
  // Test için sabit mevcut XP (gerçek uygulamada API'den gelecek)
  final int _mevcutXp = 150;
  
  // Konfeti kontrolcüsü
  late ConfettiController _confettiController;

  // Test ayarları için değişkenler
  String? secilenSinif;
  String? secilenDers;
  String? secilenKonu;
  List<String> siniflar = [];
  List<String> dersler = [];
  List<String> konular = [];
  List<String> testler = [];
  bool testAyarYukleniyor = false;

  @override
  void initState() {
    super.initState();
    _confettiController = ConfettiController(duration: const Duration(seconds: 3));
    _hedefleriYukle();
    _siniflariYukle();
  }

  Future<void> _hedefleriYukle() async {
    try {
      setState(() {
        _yukleniyor = true;
        _hata = null;
      });
      
      final hedefler = await XpHedefService.hedefleriGetir(_testChildId);
      setState(() {
        _hedefler = hedefler;
        _yukleniyor = false;
      });
    } catch (e) {
      setState(() {
        _hata = e.toString();
        _yukleniyor = false;
      });
    }
  }

  // Test ayarları fonksiyonları
  Future<void> _siniflariYukle() async {
    setState(() { testAyarYukleniyor = true; });
    try {
      final sinifDersListesi = await FirebaseService.getSinifDersListesi();
      final siniflarListesi = sinifDersListesi.keys.toList();
      setState(() {
        siniflar = siniflarListesi;
        testAyarYukleniyor = false;
      });
    } catch (e) {
      setState(() { testAyarYukleniyor = false; });
      _showError('Sınıflar yüklenemedi: $e');
    }
  }

  Future<void> _dersleriYukle(String sinif) async {
    setState(() { testAyarYukleniyor = true; });
    try {
      final sinifDersListesi = await FirebaseService.getSinifDersListesi();
      final derslerListesi = sinifDersListesi[sinif] ?? [];
      setState(() {
        dersler = derslerListesi;
        secilenDers = null;
        secilenKonu = null;
        konular = [];
        testler = [];
        testAyarYukleniyor = false;
      });
    } catch (e) {
      setState(() { testAyarYukleniyor = false; });
      _showError('Dersler yüklenemedi: $e');
    }
  }

  Future<void> _konulariYukle(String sinif, String ders) async {
    setState(() { testAyarYukleniyor = true; });
    try {
      final konularListesi = await FirebaseService.getKonular(sinif, ders);
      setState(() {
        konular = konularListesi;
        secilenKonu = null;
        testler = [];
        testAyarYukleniyor = false;
      });
    } catch (e) {
      setState(() { testAyarYukleniyor = false; });
      _showError('Konular yüklenemedi: $e');
    }
  }

  Future<void> _testleriYukle() async {
    if (secilenSinif == null || secilenDers == null || secilenKonu == null) return;
    setState(() { testAyarYukleniyor = true; });
    try {
      final testlerListesi = await FirebaseService.getTestler(secilenSinif!, secilenDers!, secilenKonu!);
      setState(() {
        testler = testlerListesi;
        testAyarYukleniyor = false;
      });
    } catch (e) {
      setState(() { testAyarYukleniyor = false; });
      _showError('Testler yüklenemedi: $e');
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: Colors.red),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("🎯 XP Hedefleri"),
        backgroundColor: Colors.purple,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _hedefleriYukle,
          ),
        ],
      ),
      body: Stack(
        children: [
          Column(
            children: [
              Expanded(child: _buildMainContent()),
              Divider(height: 1, color: Colors.grey[400]),
              _buildTestAyarContent(),
            ],
          ),
          Align(
            alignment: Alignment.topCenter,
            child: ConfettiWidget(
              confettiController: _confettiController,
              blastDirection: pi / 2,
              maxBlastForce: 5,
              minBlastForce: 2,
              emissionFrequency: 0.05,
              numberOfParticles: 50,
              gravity: 0.1,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMainContent() {
    if (_yukleniyor) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(),
            SizedBox(height: 16),
            Text('Hedefler yükleniyor...'),
          ],
        ),
      );
    }
    if (_hata != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error, size: 64, color: Colors.red),
            const SizedBox(height: 16),
            Text('Hata:  [31m [1m [4m [7m$_hata [0m'),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _hedefleriYukle,
              child: const Text('Tekrar Dene'),
            ),
          ],
        ),
      );
    }
    if (_hedefler.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.flag, size: 64, color: Colors.grey),
            const SizedBox(height: 16),
            const Text(
              'Henüz hedef bulunmuyor',
              style: TextStyle(fontSize: 18, color: Colors.grey),
            ),
            const SizedBox(height: 8),
            const Text(
              'AdminJS panelinden XP hedefi ekleyebilirsiniz',
              style: TextStyle(color: Colors.grey),
            ),
          ],
        ),
      );
    }
    return RefreshIndicator(
      onRefresh: _hedefleriYukle,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _hedefler.length,
        itemBuilder: (context, index) {
          final hedef = _hedefler[index];
          final ilerleme = XpHedefService.ilerlemeHesapla(hedef, _mevcutXp);
          final tamamlandi = ilerleme >= 100 || hedef.tamamlandi;
          // Hedef tamamlandıysa konfeti çalıştır
          if (tamamlandi && !hedef.tamamlandi) {
            WidgetsBinding.instance.addPostFrameCallback((_) {
              _confettiController.play();
              _showKutlamaDialog(context, hedef);
            });
          }
          return Card(
            margin: const EdgeInsets.only(bottom: 16),
            elevation: 4,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(
                        tamamlandi ? Icons.check_circle : Icons.flag,
                        color: tamamlandi ? Colors.green : Colors.purple,
                        size: 24,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              hedef.odulAd,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 18,
                              ),
                            ),
                            Text(
                              hedef.aciklama,
                              style: const TextStyle(
                                color: Colors.grey,
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ),
                      if (tamamlandi)
                        const Chip(
                          label: Text('TAMAMLANDI'),
                          backgroundColor: Colors.green,
                          labelStyle: TextStyle(color: Colors.white),
                        ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  // İlerleme çubuğu
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'İlerleme: $_mevcutXp /  [31m [1m [4m [7m${hedef.hedefXp} [0m XP',
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            '${ilerleme.toStringAsFixed(1)}%',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: tamamlandi ? Colors.green : Colors.purple,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      LinearProgressIndicator(
                        value: ilerleme / 100,
                        backgroundColor: Colors.grey[300],
                        valueColor: AlwaysStoppedAnimation<Color>(
                          tamamlandi ? Colors.green : Colors.purple,
                        ),
                        minHeight: 8,
                      ),
                    ],
                  ),
                  if (hedef.tamamlanmaTarihi != null) ...[
                    const SizedBox(height: 12),
                    Text(
                      'Tamamlanma: ${_formatTarih(hedef.tamamlanmaTarihi!)}',
                      style: const TextStyle(
                        fontSize: 12,
                        color: Colors.grey,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildTestAyarContent() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Test Ayarları', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
          const SizedBox(height: 8),
          DropdownButton<String>(
            value: secilenSinif,
            hint: const Text('Sınıf Seçin'),
            items: siniflar.map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
            onChanged: (v) {
              setState(() { secilenSinif = v; });
              if (v != null) _dersleriYukle(v);
            },
          ),
          if (dersler.isNotEmpty)
            DropdownButton<String>(
              value: secilenDers,
              hint: const Text('Ders Seçin'),
              items: dersler.map((d) => DropdownMenuItem(value: d, child: Text(d))).toList(),
              onChanged: (v) {
                setState(() { secilenDers = v; });
                if (v != null && secilenSinif != null) _konulariYukle(secilenSinif!, v);
              },
            ),
          if (konular.isNotEmpty)
            DropdownButton<String>(
              value: secilenKonu,
              hint: const Text('Konu Seçin'),
              items: konular.map((k) => DropdownMenuItem(value: k, child: Text(k))).toList(),
              onChanged: (v) {
                setState(() { secilenKonu = v; });
                if (v != null) _testleriYukle();
              },
            ),
          const SizedBox(height: 8),
          if (testAyarYukleniyor)
            const Center(child: CircularProgressIndicator()),
          if (testler.isNotEmpty)
            SizedBox(
              height: 120,
              child: ListView.builder(
                itemCount: testler.length,
                itemBuilder: (context, i) {
                  final testAdi = testler[i];
                  return Card(
                    child: ListTile(
                      title: Text(testAdi),
                      subtitle: Text('Test'),
                      trailing: IconButton(
                        icon: const Icon(Icons.link),
                        onPressed: () {
                          // Burada test havuza bağlama veya düzenleme işlemi yapılabilir
                        },
                      ),
                    ),
                  );
                },
              ),
            ),
          if (testler.isEmpty && secilenKonu != null && !testAyarYukleniyor)
            const Text('Bu konuya ait test bulunamadı.'),
        ],
      ),
    );
  }

  String _formatTarih(DateTime tarih) {
    return '${tarih.day.toString().padLeft(2, '0')}.'
           '${tarih.month.toString().padLeft(2, '0')}.'
           '${tarih.year}';
  }

  void _showKutlamaDialog(BuildContext context, XpHedefi hedef) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        backgroundColor: Colors.amber[50],
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: [
            const Icon(Icons.celebration, color: Colors.amber, size: 30),
            const SizedBox(width: 10),
            const Text('🎉 Tebrikler!', style: TextStyle(color: Colors.amber)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'Hedefini başarıyla tamamladın!',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.amber[100],
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                children: [
                  const Icon(Icons.star, color: Colors.amber, size: 40),
                  const SizedBox(height: 8),
                  Text(
                    hedef.odulAd,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.amber,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '+${hedef.hedefXp} XP',
                    style: const TextStyle(
                      fontSize: 14,
                      color: Colors.green,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.amber,
              foregroundColor: Colors.white,
            ),
            child: const Text('Harika!'),
          ),
        ],
      ),
    );
  }
} 