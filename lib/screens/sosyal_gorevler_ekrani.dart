import 'package:flutter/material.dart';
import '../data/sosyal_gorevler.dart';
import '../services/sosyal_gorev_yonetimi.dart';

class SosyalGorevlerEkrani extends StatefulWidget {
  const SosyalGorevlerEkrani({super.key});

  @override
  State<SosyalGorevlerEkrani> createState() => _SosyalGorevlerEkraniState();
}

class _SosyalGorevlerEkraniState extends State<SosyalGorevlerEkrani> {
  List<SosyalGorev> _tumGorevler = [];
  String _seciliKategori = 'Tümü';
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _gorevleriYukle();
  }

  Future<void> _gorevleriYukle() async {
    setState(() {
      _isLoading = true;
    });

    List<SosyalGorev> gorevler = await SosyalGorevYonetimi.tumGorevleriGetir();
    
    setState(() {
      _tumGorevler = gorevler;
      _isLoading = false;
    });
  }

  List<SosyalGorev> get _filtrelenmisGorevler {
    if (_seciliKategori == 'Tümü') {
      return _tumGorevler;
    }
    return _tumGorevler.where((g) => g.kategori == _seciliKategori).toList();
  }

  Future<void> _gorevTamamla(SosyalGorev gorev) async {
    await SosyalGorevYonetimi.gorevTamamla(gorev.id);
    await _gorevleriYukle();
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('${gorev.baslik} tamamlandı! Veli onayı bekleniyor...'),
        backgroundColor: Colors.orange,
        duration: const Duration(seconds: 3),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF2F8FF),
      appBar: AppBar(
        title: const Text('🎯 Sosyal Görevler'),
        backgroundColor: Colors.purple[100],
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _gorevleriYukle,
          ),
        ],
      ),
      body: Column(
        children: [
          // Kategori filtreleri
          Container(
            height: 60,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: [
                'Tümü',
                ...SosyalGorevVerileri.kategoriler,
              ].map((kategori) {
                bool secili = _seciliKategori == kategori;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: FilterChip(
                    label: Text(kategori),
                    selected: secili,
                    onSelected: (selected) {
                      setState(() {
                        _seciliKategori = kategori;
                      });
                    },
                    selectedColor: Colors.purple[100],
                    checkmarkColor: Colors.purple,
                  ),
                );
              }).toList(),
            ),
          ),

          // İstatistikler
          Container(
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [
                BoxShadow(
                  color: Colors.purple[100]!,
                  blurRadius: 8,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: FutureBuilder<Map<String, dynamic>>(
              future: SosyalGorevYonetimi.gorevIstatistikleriGetir(),
              builder: (context, snapshot) {
                if (snapshot.hasData) {
                  final stats = snapshot.data!;
                  return Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildStat('Toplam', '${stats['toplamGorev']}', Colors.blue),
                      _buildStat('Tamamlanan', '${stats['tamamlananGorev']}', Colors.green),
                      _buildStat('Bekleyen', '${stats['bekleyenGorev']}', Colors.orange),
                      _buildStat('XP', '${stats['toplamXp']}', Colors.purple),
                    ],
                  );
                }
                return const Center(child: CircularProgressIndicator());
              },
            ),
          ),

          // Görev listesi
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _filtrelenmisGorevler.isEmpty
                    ? const Center(
                        child: Text(
                          'Bu kategoride görev bulunamadı',
                          style: TextStyle(fontSize: 16, color: Colors.grey),
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: _filtrelenmisGorevler.length,
                        itemBuilder: (context, index) {
                          final gorev = _filtrelenmisGorevler[index];
                          return _buildGorevKarti(gorev);
                        },
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildStat(String label, String value, Color color) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            color: Colors.grey,
          ),
        ),
      ],
    );
  }

  Widget _buildGorevKarti(SosyalGorev gorev) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: _getGorevRenk(gorev),
          child: Icon(
            _getGorevIcon(gorev),
            color: Colors.white,
          ),
        ),
        title: Text(
          gorev.baslik,
          style: TextStyle(
            fontWeight: FontWeight.bold,
            decoration: gorev.tamamlandi ? TextDecoration.lineThrough : null,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(gorev.aciklama),
            const SizedBox(height: 4),
            Row(
              children: [
                Icon(Icons.star, size: 16, color: Colors.amber),
                const SizedBox(width: 4),
                Text('${gorev.xpOdulu} XP'),
                const SizedBox(width: 16),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: Colors.purple[100],
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    gorev.kategori,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.purple[700],
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
        trailing: _buildGorevDurumu(gorev),
        onTap: () => _gorevDetayGoster(gorev),
      ),
    );
  }

  Widget _buildGorevDurumu(SosyalGorev gorev) {
    if (gorev.tamamlandi && gorev.veliOnayi) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: Colors.green,
          borderRadius: BorderRadius.circular(20),
        ),
        child: const Text(
          '✅ Tamamlandı',
          style: TextStyle(color: Colors.white, fontSize: 12),
        ),
      );
    } else if (gorev.tamamlandi && !gorev.veliOnayi) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: Colors.orange,
          borderRadius: BorderRadius.circular(20),
        ),
        child: const Text(
          '⏳ Onay Bekliyor',
          style: TextStyle(color: Colors.white, fontSize: 12),
        ),
      );
    } else {
      return ElevatedButton(
        onPressed: () => _gorevTamamla(gorev),
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.purple,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
        ),
        child: const Text('Yaptım'),
      );
    }
  }

  Color _getGorevRenk(SosyalGorev gorev) {
    if (gorev.tamamlandi && gorev.veliOnayi) return Colors.green;
    if (gorev.tamamlandi && !gorev.veliOnayi) return Colors.orange;
    return Colors.purple;
  }

  IconData _getGorevIcon(SosyalGorev gorev) {
    if (gorev.tamamlandi && gorev.veliOnayi) return Icons.check;
    if (gorev.tamamlandi && !gorev.veliOnayi) return Icons.hourglass_empty;
    return Icons.task;
  }

  void _gorevDetayGoster(SosyalGorev gorev) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(gorev.baslik),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(gorev.aciklama),
            const SizedBox(height: 16),
            Row(
              children: [
                Icon(Icons.star, color: Colors.amber),
                const SizedBox(width: 8),
                Text('${gorev.xpOdulu} XP'),
              ],
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.purple[100],
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                gorev.kategori,
                style: TextStyle(color: Colors.purple[700]),
              ),
            ),
            if (gorev.tamamlanmaTarihi != null) ...[
              const SizedBox(height: 16),
              Text(
                'Tamamlanma: ${gorev.tamamlanmaTarihi!.day}/${gorev.tamamlanmaTarihi!.month}/${gorev.tamamlanmaTarihi!.year}',
                style: const TextStyle(fontSize: 12, color: Colors.grey),
              ),
            ],
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Kapat'),
          ),
          if (!gorev.tamamlandi)
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                _gorevTamamla(gorev);
              },
              child: const Text('Yaptım'),
            ),
        ],
      ),
    );
  }
} 