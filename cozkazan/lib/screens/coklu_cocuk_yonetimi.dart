import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class CokluCocukYonetimi extends StatefulWidget {
  const CokluCocukYonetimi({Key? key}) : super(key: key);

  @override
  State<CokluCocukYonetimi> createState() => _CokluCocukYonetimiState();
}

class _CokluCocukYonetimiState extends State<CokluCocukYonetimi> {
  List<CocukProfili> _cocuklar = [];
  final TextEditingController _isimController = TextEditingController();
  final TextEditingController _yasController = TextEditingController();
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _cocuklariYukle();
  }

  Future<void> _cocuklariYukle() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final cocuklarJson = prefs.getStringList('cocuk_profilleri') ?? [];
      
      setState(() {
        _cocuklar = cocuklarJson.map((json) {
          final data = jsonDecode(json);
          return CocukProfili.fromJson(data);
        }).toList();
        _isLoading = false;
      });
    } catch (e) {
      print('Çocuk profilleri yükleme hatası: $e');
      setState(() => _isLoading = false);
    }
  }

  Future<void> _cocuklariKaydet() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final cocuklarJson = _cocuklar.map((cocuk) => jsonEncode(cocuk.toJson())).toList();
      await prefs.setStringList('cocuk_profilleri', cocuklarJson);
    } catch (e) {
      print('Çocuk profilleri kaydetme hatası: $e');
    }
  }

  void _yeniCocukEkle() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Yeni Çocuk Profili'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _isimController,
              decoration: const InputDecoration(
                labelText: 'Çocuk Adı',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _yasController,
              decoration: const InputDecoration(
                labelText: 'Yaş',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              _isimController.clear();
              _yasController.clear();
              Navigator.of(context).pop();
            },
            child: const Text('İptal'),
          ),
          ElevatedButton(
            onPressed: () {
              if (_isimController.text.isNotEmpty && _yasController.text.isNotEmpty) {
                final yeniCocuk = CocukProfili(
                  id: DateTime.now().millisecondsSinceEpoch.toString(),
                  isim: _isimController.text,
                  yas: int.tryParse(_yasController.text) ?? 0,
                  xp: 0,
                  olusturmaTarihi: DateTime.now(),
                );
                
                setState(() {
                  _cocuklar.add(yeniCocuk);
                });
                
                _cocuklariKaydet();
                _isimController.clear();
                _yasController.clear();
                Navigator.of(context).pop();
                
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('${yeniCocuk.isim} profili eklendi!'),
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

  void _cocukDuzenle(CocukProfili cocuk) {
    _isimController.text = cocuk.isim;
    _yasController.text = cocuk.yas.toString();
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('${cocuk.isim} Profilini Düzenle'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _isimController,
              decoration: const InputDecoration(
                labelText: 'Çocuk Adı',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _yasController,
              decoration: const InputDecoration(
                labelText: 'Yaş',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              _isimController.clear();
              _yasController.clear();
              Navigator.of(context).pop();
            },
            child: const Text('İptal'),
          ),
          ElevatedButton(
            onPressed: () {
              if (_isimController.text.isNotEmpty && _yasController.text.isNotEmpty) {
                setState(() {
                  cocuk.isim = _isimController.text;
                  cocuk.yas = int.tryParse(_yasController.text) ?? cocuk.yas;
                });
                
                _cocuklariKaydet();
                _isimController.clear();
                _yasController.clear();
                Navigator.of(context).pop();
                
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('${cocuk.isim} profili güncellendi!'),
                    backgroundColor: Colors.blue,
                  ),
                );
              }
            },
            child: const Text('Güncelle'),
          ),
        ],
      ),
    );
  }

  void _cocukSil(CocukProfili cocuk) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Profil Sil'),
        content: Text('${cocuk.isim} profilini silmek istediğinizden emin misiniz?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('İptal'),
          ),
          ElevatedButton(
            onPressed: () {
              setState(() {
                _cocuklar.remove(cocuk);
              });
              
              _cocuklariKaydet();
              Navigator.of(context).pop();
              
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('${cocuk.isim} profili silindi!'),
                  backgroundColor: Colors.red,
                ),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Sil'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('👨‍👩‍👧‍👦 Çoklu Çocuk Yönetimi'),
        backgroundColor: Colors.indigo[600],
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: _yeniCocukEkle,
            tooltip: 'Yeni Çocuk Ekle',
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _cocuklar.isEmpty
              ? _buildBosDurum()
              : _buildCocukListesi(),
    );
  }

  Widget _buildBosDurum() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.family_restroom,
            size: 80,
            color: Colors.grey[400],
          ),
          const SizedBox(height: 16),
          Text(
            'Henüz çocuk profili eklenmemiş',
            style: TextStyle(
              fontSize: 18,
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Sağ üstteki + butonuna tıklayarak\nçocuk profili ekleyebilirsiniz',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[500],
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: _yeniCocukEkle,
            icon: const Icon(Icons.add),
            label: const Text('İlk Çocuk Profilini Ekle'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.indigo[600],
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCocukListesi() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _cocuklar.length,
      itemBuilder: (context, index) {
        final cocuk = _cocuklar[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          elevation: 4,
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: Colors.indigo[100],
              child: Text(
                cocuk.isim[0].toUpperCase(),
                style: TextStyle(
                  color: Colors.indigo[800],
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            title: Text(
              cocuk.isim,
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Yaş: ${cocuk.yas}'),
                Text('XP: ${cocuk.xp}'),
                Text(
                  'Oluşturma: ${_formatTarih(cocuk.olusturmaTarihi)}',
                  style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                ),
              ],
            ),
            trailing: PopupMenuButton<String>(
              onSelected: (value) {
                switch (value) {
                  case 'duzenle':
                    _cocukDuzenle(cocuk);
                    break;
                  case 'sil':
                    _cocukSil(cocuk);
                    break;
                }
              },
              itemBuilder: (context) => [
                const PopupMenuItem(
                  value: 'duzenle',
                  child: Row(
                    children: [
                      Icon(Icons.edit),
                      SizedBox(width: 8),
                      Text('Düzenle'),
                    ],
                  ),
                ),
                const PopupMenuItem(
                  value: 'sil',
                  child: Row(
                    children: [
                      Icon(Icons.delete, color: Colors.red),
                      SizedBox(width: 8),
                      Text('Sil', style: TextStyle(color: Colors.red)),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  String _formatTarih(DateTime tarih) {
    return '${tarih.day}/${tarih.month}/${tarih.year}';
  }

  @override
  void dispose() {
    _isimController.dispose();
    _yasController.dispose();
    super.dispose();
  }
}

class CocukProfili {
  String id;
  String isim;
  int yas;
  int xp;
  DateTime olusturmaTarihi;

  CocukProfili({
    required this.id,
    required this.isim,
    required this.yas,
    required this.xp,
    required this.olusturmaTarihi,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'isim': isim,
      'yas': yas,
      'xp': xp,
      'olusturmaTarihi': olusturmaTarihi.toIso8601String(),
    };
  }

  factory CocukProfili.fromJson(Map<String, dynamic> json) {
    return CocukProfili(
      id: json['id'],
      isim: json['isim'],
      yas: json['yas'],
      xp: json['xp'],
      olusturmaTarihi: DateTime.parse(json['olusturmaTarihi']),
    );
  }
} 