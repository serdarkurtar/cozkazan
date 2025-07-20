import 'package:flutter/material.dart';
import '../data/aile_notlari.dart';
import '../services/aile_notlari_servisi.dart';

class AileNotlariEkrani extends StatefulWidget {
  final String kullaniciTipi; // 'veli' veya 'ogrenci'
  const AileNotlariEkrani({super.key, required this.kullaniciTipi});

  @override
  State<AileNotlariEkrani> createState() => _AileNotlariEkraniState();
}

class _AileNotlariEkraniState extends State<AileNotlariEkrani> {
  final TextEditingController _mesajController = TextEditingController();
  List<AileNotu> _notlar = [];
  bool _yukleniyor = true;

  @override
  void initState() {
    super.initState();
    _notlariYukle();
  }

  Future<void> _notlariYukle() async {
    setState(() => _yukleniyor = true);
    final notlar = await AileNotlariServisi.tumNotlariGetir();
    setState(() {
      _notlar = notlar.reversed.toList();
      _yukleniyor = false;
    });
  }

  Future<void> _mesajGonder() async {
    final mesaj = _mesajController.text.trim();
    if (mesaj.isEmpty) return;
    await AileNotlariServisi.notEkle(widget.kullaniciTipi, mesaj);
    _mesajController.clear();
    await _notlariYukle();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Aile Notları'),
        backgroundColor: Colors.pinkAccent,
      ),
      body: Column(
        children: [
          Expanded(
            child: _yukleniyor
                ? const Center(child: CircularProgressIndicator())
                : _notlar.isEmpty
                    ? const Center(child: Text('Henüz not yok.'))
                    : ListView.builder(
                        reverse: false,
                        itemCount: _notlar.length,
                        itemBuilder: (context, i) {
                          final not = _notlar[i];
                          final renk = not.gonderen == 'veli' ? Colors.orange[100] : Colors.blue[100];
                          final isim = not.gonderen == 'veli' ? 'Veli' : 'Öğrenci';
                          return Container(
                            margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: renk,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Text(
                                      isim,
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        color: not.gonderen == 'veli' ? Colors.orange : Colors.blue,
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      _tarihFormat(not.tarih),
                                      style: const TextStyle(fontSize: 12, color: Colors.grey),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  not.mesaj,
                                  style: const TextStyle(fontSize: 16),
                                ),
                              ],
                            ),
                          );
                        },
                      ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            color: Colors.pink[50],
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _mesajController,
                    decoration: const InputDecoration(
                      hintText: 'Mesaj yaz...',
                      border: OutlineInputBorder(),
                      isDense: true,
                      contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: const Icon(Icons.send, color: Colors.pinkAccent),
                  onPressed: _mesajGonder,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _tarihFormat(DateTime tarih) {
    final now = DateTime.now();
    if (now.difference(tarih).inDays == 0) {
      return '${tarih.hour.toString().padLeft(2, '0')}:${tarih.minute.toString().padLeft(2, '0')}';
    } else {
      return '${tarih.day}.${tarih.month}.${tarih.year}';
    }
  }
} 