import 'package:flutter/material.dart';
import '../services/ai_analiz_service.dart';

class AiAnalizPaneli extends StatefulWidget {
  const AiAnalizPaneli({super.key});

  @override
  State<AiAnalizPaneli> createState() => _AiAnalizPaneliState();
}

class _AiAnalizPaneliState extends State<AiAnalizPaneli> {
  bool _yukleniyor = true;
  String? _hata;
  AiAnaliz? _analiz;

  @override
  void initState() {
    super.initState();
    _analiziYukle();
  }

  Future<void> _analiziYukle() async {
    try {
      setState(() {
        _yukleniyor = true;
        _hata = null;
      });
      
      final analiz = await AiAnalizService.analizGetir('test_cocuk_1');
      setState(() {
        _analiz = analiz;
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
        title: const Text("🤖 AI Analiz"),
        backgroundColor: Colors.indigo,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _analiziYukle,
          ),
        ],
      ),
      body: _yukleniyor
          ? const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(),
                  SizedBox(height: 16),
                  Text('AI analizi yapılıyor...'),
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
                        onPressed: _analiziYukle,
                        child: const Text('Tekrar Dene'),
                      ),
                    ],
                  ),
                )
              : _analiz == null
                  ? const Center(
                      child: Text('Analiz bulunamadı'),
                    )
                  : SingleChildScrollView(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Aktiflik durumu
                          _buildAktiflikKarti(),
                          const SizedBox(height: 16),
                          
                          // Hedef önerisi
                          _buildHedefOnerisiKarti(),
                          const SizedBox(height: 16),
                          
                          // Motivasyon mesajı
                          _buildMotivasyonKarti(),
                          const SizedBox(height: 16),
                          
                          // Detaylı analiz
                          _buildDetayliAnalizKarti(),
                          const SizedBox(height: 16),
                          
                          // Tavsiyeler
                          _buildTavsiyelerKarti(),
                        ],
                      ),
                    ),
    );
  }

  Widget _buildAktiflikKarti() {
    return Card(
      elevation: 4,
      color: _getAktiflikRengi(_analiz!.aktiflik),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  _getAktiflikIconu(_analiz!.aktiflik),
                  color: Colors.white,
                  size: 24,
                ),
                const SizedBox(width: 8),
                const Text(
                  'Aktiflik Durumu',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              _analiz!.aktiflik,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Bu hafta ${_analiz!.aktifGunSayisi} gün aktif',
              style: const TextStyle(color: Colors.white70),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHedefOnerisiKarti() {
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.target, color: Colors.orange, size: 24),
                const SizedBox(width: 8),
                const Text(
                  'AI Hedef Önerisi',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.orange[50],
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.orange[200]!),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${_analiz!.oneriHedefXp} XP Hedefi',
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.orange,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _analiz!.tavsiye,
                    style: const TextStyle(fontSize: 14),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMotivasyonKarti() {
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.psychology, color: Colors.green, size: 24),
                const SizedBox(width: 8),
                const Text(
                  'Motivasyon Mesajı',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.green[50],
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.green[200]!),
              ),
              child: Text(
                _analiz!.motivasyonMesaji,
                style: const TextStyle(fontSize: 16),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetayliAnalizKarti() {
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              children: [
                Icon(Icons.analytics, color: Colors.blue, size: 24),
                SizedBox(width: 8),
                Text(
                  'Detaylı Analiz',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            _buildAnalizSatiri('Günlük Ortalama XP', '${_analiz!.gunlukOrtalamaXp}'),
            _buildAnalizSatiri('Günlük Ortalama Test', '${_analiz!.gunlukOrtalamaTest}'),
            _buildAnalizSatiri('Günlük Ortalama Kitap (dk)', '${_analiz!.gunlukOrtalamaKitap}'),
            _buildAnalizSatiri('Hedef Ulaşma Süresi', '${_analiz!.hedefUlasmaSuresi} gün'),
          ],
        ),
      ),
    );
  }

  Widget _buildAnalizSatiri(String baslik, String deger) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(baslik, style: const TextStyle(fontSize: 14)),
          Text(
            deger,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: Colors.blue,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTavsiyelerKarti() {
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              children: [
                Icon(Icons.lightbulb, color: Colors.yellow, size: 24),
                SizedBox(width: 8),
                Text(
                  'AI Tavsiyeleri',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            ..._analiz!.tavsiyeler.map((tavsiye) => Padding(
              padding: const EdgeInsets.symmetric(vertical: 4),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.check_circle, color: Colors.green, size: 16),
                  const SizedBox(width: 8),
                  Expanded(child: Text(tavsiye)),
                ],
              ),
            )),
          ],
        ),
      ),
    );
  }

  Color _getAktiflikRengi(String aktiflik) {
    switch (aktiflik.toLowerCase()) {
      case 'yüksek':
        return Colors.green;
      case 'orta':
        return Colors.orange;
      case 'düşük':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  IconData _getAktiflikIconu(String aktiflik) {
    switch (aktiflik.toLowerCase()) {
      case 'yüksek':
        return Icons.trending_up;
      case 'orta':
        return Icons.trending_flat;
      case 'düşük':
        return Icons.trending_down;
      default:
        return Icons.help;
    }
  }
} 