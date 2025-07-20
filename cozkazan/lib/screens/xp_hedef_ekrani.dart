import 'package:flutter/material.dart';
import 'package:confetti/confetti.dart';
import 'dart:math';
import '../services/xp_hedef_service.dart';

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

  @override
  void initState() {
    super.initState();
    _confettiController = ConfettiController(duration: const Duration(seconds: 3));
    _hedefleriYukle();
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
          _buildMainContent(),
          // Konfeti efekti
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
      body: _yukleniyor
          ? const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(),
                  SizedBox(height: 16),
                  Text('Hedefler yükleniyor...'),
                ],
              ),
            )
          : _hata != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.error, size: 64, color: Colors.red),
                      const SizedBox(height: 16),
                      Text('Hata: $_hata'),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _hedefleriYukle,
                        child: const Text('Tekrar Dene'),
                      ),
                    ],
                  ),
                )
              : _hedefler.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.target, size: 64, color: Colors.grey),
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
                    )
                  : RefreshIndicator(
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
                                        tamamlandi ? Icons.check_circle : Icons.target,
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
                                            'İlerleme: $_mevcutXp / ${hedef.hedefXp} XP',
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