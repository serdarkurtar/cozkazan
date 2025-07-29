import 'package:flutter/material.dart';
import '../data/sosyal_gorevler.dart';
import '../services/sosyal_gorev_yonetimi.dart';

class VeliSosyalGorevlerEkrani extends StatefulWidget {
  const VeliSosyalGorevlerEkrani({super.key});

  @override
  State<VeliSosyalGorevlerEkrani> createState() => _VeliSosyalGorevlerEkraniState();
}

class _VeliSosyalGorevlerEkraniState extends State<VeliSosyalGorevlerEkrani> {
  List<SosyalGorev> _bekleyenGorevler = [];
  List<SosyalGorev> _tumGorevler = [];
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

    List<SosyalGorev> bekleyenGorevler = await SosyalGorevYonetimi.bekleyenGorevleriGetir();
    List<SosyalGorev> tumGorevler = await SosyalGorevYonetimi.tumGorevleriGetir();
    
    setState(() {
      _bekleyenGorevler = bekleyenGorevler;
      _tumGorevler = tumGorevler;
      _isLoading = false;
    });
  }

  Future<void> _gorevOnayla(SosyalGorev gorev) async {
    await SosyalGorevYonetimi.veliOnayiVer(gorev.id);
    await _gorevleriYukle();
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('${gorev.baslik} onaylandı! +${gorev.xpOdulu} XP'),
        backgroundColor: Colors.green,
        duration: const Duration(seconds: 3),
      ),
    );
  }

  Future<void> _gorevReddet(SosyalGorev gorev) async {
    await SosyalGorevYonetimi.veliOnayiniReddet(gorev.id);
    await _gorevleriYukle();
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('${gorev.baslik} reddedildi'),
        backgroundColor: Colors.red,
        duration: const Duration(seconds: 3),
      ),
    );
  }

  void _yeniGorevEkle() {
    final TextEditingController baslikController = TextEditingController();
    final TextEditingController aciklamaController = TextEditingController();
    final TextEditingController xpController = TextEditingController();
    String seciliKategori = SosyalGorevVerileri.kategoriler.first;

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Yeni Görev Ekle'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: baslikController,
                decoration: const InputDecoration(
                  labelText: 'Görev Başlığı',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: aciklamaController,
                decoration: const InputDecoration(
                  labelText: 'Açıklama',
                  border: OutlineInputBorder(),
                ),
                maxLines: 3,
              ),
              const SizedBox(height: 16),
              TextField(
                controller: xpController,
                decoration: const InputDecoration(
                  labelText: 'XP Ödülü',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.number,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: seciliKategori,
                decoration: const InputDecoration(
                  labelText: 'Kategori',
                  border: OutlineInputBorder(),
                ),
                items: SosyalGorevVerileri.kategoriler.map((kategori) {
                  return DropdownMenuItem(
                    value: kategori,
                    child: Text(kategori),
                  );
                }).toList(),
                onChanged: (value) {
                  seciliKategori = value!;
                },
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('İptal'),
          ),
          ElevatedButton(
            onPressed: () async {
              if (baslikController.text.isNotEmpty &&
                  aciklamaController.text.isNotEmpty &&
                  xpController.text.isNotEmpty) {
                
                int xp = int.tryParse(xpController.text) ?? 10;
                
                await SosyalGorevYonetimi.manuelGorevEkle(
                  baslikController.text,
                  aciklamaController.text,
                  xp,
                  seciliKategori,
                );
                
                Navigator.pop(context);
                await _gorevleriYukle();
                
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Yeni görev eklendi!'),
                    backgroundColor: Colors.green,
                  ),
                );
              }
            },
            child: const Text('Ekle'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.orange[100],
      appBar: AppBar(
        title: const Text('🎯 Sosyal Görevler Yönetimi'),
        backgroundColor: Colors.orange[100],
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: _yeniGorevEkle,
          ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _gorevleriYukle,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Bekleyen onaylar
                  if (_bekleyenGorevler.isNotEmpty) ...[
                    const Text(
                      '⏳ Bekleyen Onaylar',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.orange,
                      ),
                    ),
                    const SizedBox(height: 12),
                    ..._bekleyenGorevler.map((gorev) => _buildBekleyenGorevKarti(gorev)),
                    const SizedBox(height: 24),
                  ],

                  // Tüm görevler
                  const Text(
                    '📋 Tüm Görevler',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.orange,
                    ),
                  ),
                  const SizedBox(height: 12),
                  ..._tumGorevler.map((gorev) => _buildGorevKarti(gorev)),
                ],
              ),
            ),
    );
  }

  Widget _buildBekleyenGorevKarti(SosyalGorev gorev) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      color: Colors.orange[50],
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.pending, color: Colors.orange[700]),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    gorev.baslik,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.orange,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    '${gorev.xpOdulu} XP',
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(gorev.aciklama),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.orange[100],
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                gorev.kategori,
                style: TextStyle(color: Colors.orange[700]),
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => _gorevReddet(gorev),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Reddet'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => _gorevOnayla(gorev),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Onayla'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
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
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: TextStyle(
            fontWeight: FontWeight.bold,
            decoration: gorev.tamamlandi ? TextDecoration.lineThrough : null,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              gorev.aciklama,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 4),
            Row(
              children: [
                Icon(Icons.star, size: 16, color: Colors.amber),
                const SizedBox(width: 4),
                Text('${gorev.xpOdulu} XP'),
                const SizedBox(width: 16),
                Flexible(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: Colors.orange[100],
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      gorev.kategori,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.orange[700],
                      ),
                    ),
                  ),
                ),
                if (gorev.manuelGorev) ...[
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: Colors.blue[100],
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Text(
                      'Manuel',
                      style: TextStyle(
                        fontSize: 10,
                        color: Colors.blue,
                      ),
                    ),
                  ),
                ],
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
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: Colors.grey,
          borderRadius: BorderRadius.circular(20),
        ),
        child: const Text(
          '📝 Bekliyor',
          style: TextStyle(color: Colors.white, fontSize: 12),
        ),
      );
    }
  }

  Color _getGorevRenk(SosyalGorev gorev) {
    if (gorev.tamamlandi && gorev.veliOnayi) return Colors.green;
    if (gorev.tamamlandi && !gorev.veliOnayi) return Colors.orange;
    return Colors.grey;
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
                color: Colors.orange[100],
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                gorev.kategori,
                style: TextStyle(color: Colors.orange[700]),
              ),
            ),
            if (gorev.tamamlanmaTarihi != null) ...[
              const SizedBox(height: 16),
              Text(
                'Tamamlanma: ${gorev.tamamlanmaTarihi!.day}/${gorev.tamamlanmaTarihi!.month}/${gorev.tamamlanmaTarihi!.year}',
                style: const TextStyle(fontSize: 12, color: Colors.grey),
              ),
            ],
            if (gorev.manuelGorev) ...[
              const SizedBox(height: 8),
              const Text(
                'Manuel eklenen görev',
                style: TextStyle(fontSize: 12, color: Colors.blue),
              ),
            ],
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Kapat'),
          ),
          if (gorev.tamamlandi && !gorev.veliOnayi) ...[
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                _gorevOnayla(gorev);
              },
              style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
              child: const Text('Onayla'),
            ),
          ],
        ],
      ),
    );
  }
} 