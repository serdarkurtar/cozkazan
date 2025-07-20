import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../data/hikayeler.dart';

class HikayeDetaySayfasi extends StatefulWidget {
  final Hikaye hikaye;
  final String childId;

  const HikayeDetaySayfasi({
    Key? key,
    required this.hikaye,
    required this.childId,
  }) : super(key: key);

  @override
  State<HikayeDetaySayfasi> createState() => _HikayeDetaySayfasiState();
}

class _HikayeDetaySayfasiState extends State<HikayeDetaySayfasi> {
  bool _okumaTamamlandi = false;
  bool _isLoading = false;
  int _okunanKelimeSayisi = 0;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _baslangicKelimeleriniSay();
  }

  void _baslangicKelimeleriniSay() {
    final kelimeler = widget.hikaye.icerik.split(' ');
    setState(() {
      _okunanKelimeSayisi = kelimeler.length;
    });
  }

  Future<void> _okumaTamamla() async {
    if (_okumaTamamlandi) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final sonuc = await ApiService.okumaTamamla(
        widget.childId,
        widget.hikaye.id.toString(),
      );

      setState(() {
        _isLoading = false;
        _okumaTamamlandi = true;
      });

      if (mounted) {
        if (sonuc['basarili'] == true) {
          _showBasariliDialog(sonuc);
        } else {
          _showHataDialog(sonuc['hata'] ?? 'Bilinmeyen hata');
        }
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
      });

      if (mounted) {
        _showHataDialog('Bağlantı hatası: $e');
      }
    }
  }

  void _showBasariliDialog(Map<String, dynamic> sonuc) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: Row(
          children: [
            Icon(Icons.star, color: Colors.amber[600]),
            const SizedBox(width: 8),
            const Text('Tebrikler!'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              sonuc['mesaj'] ?? 'Hikaye başarıyla tamamlandı!',
              style: const TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.green[50],
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.green[200]!),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.add, color: Colors.green[600]),
                  const SizedBox(width: 8),
                  Text(
                    '+${sonuc['xpKazanilan'] ?? 0} XP',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.green[700],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              Navigator.of(context).pop(); // Hikaye sayfasından çık
            },
            child: const Text('Tamam'),
          ),
        ],
      ),
    );
  }

  void _showHataDialog(String hata) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Row(
          children: [
            Icon(Icons.error, color: Colors.red[600]),
            const SizedBox(width: 8),
            const Text('Hata'),
          ],
        ),
        content: Text(hata),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Tamam'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.hikaye.baslik),
        backgroundColor: Colors.blue[600],
        foregroundColor: Colors.white,
        actions: [
          if (!_okumaTamamlandi)
            IconButton(
              icon: const Icon(Icons.check_circle_outline),
              onPressed: _isLoading ? null : _okumaTamamla,
              tooltip: 'Okumayı Tamamla',
            ),
        ],
      ),
      body: Column(
        children: [
          // Hikaye bilgileri
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.blue[50],
              border: Border(
                bottom: BorderSide(color: Colors.blue[200]!),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(Icons.book, color: Colors.blue[600]),
                    const SizedBox(width: 8),
                    Text(
                      widget.hikaye.baslik,
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.blue[800],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    _buildInfoChip('Kategori', widget.hikaye.kategori),
                    const SizedBox(width: 8),
                    _buildInfoChip('Seviye', widget.hikaye.seviye.toString()),
                    const SizedBox(width: 8),
                    _buildInfoChip('XP', '${widget.hikaye.xpOdul}'),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Icon(Icons.text_fields, color: Colors.grey[600], size: 16),
                    const SizedBox(width: 4),
                    Text(
                      '$_okunanKelimeSayisi kelime',
                      style: TextStyle(
                        color: Colors.grey[600],
                        fontSize: 14,
                      ),
                    ),
                    const Spacer(),
                    if (_okumaTamamlandi)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.green[100],
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.check_circle, color: Colors.green[600], size: 16),
                            const SizedBox(width: 4),
                            Text(
                              'Tamamlandı',
                              style: TextStyle(
                                color: Colors.green[700],
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                  ],
                ),
              ],
            ),
          ),
          
          // Hikaye içeriği
          Expanded(
            child: SingleChildScrollView(
              controller: _scrollController,
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.hikaye.icerik,
                    style: const TextStyle(
                      fontSize: 16,
                      height: 1.6,
                    ),
                  ),
                  const SizedBox(height: 32),
                  
                  // Okuma tamamlama butonu
                  if (!_okumaTamamlandi)
                    Center(
                      child: ElevatedButton.icon(
                        onPressed: _isLoading ? null : _okumaTamamla,
                        icon: _isLoading
                            ? SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(strokeWidth: 2),
                              )
                            : const Icon(Icons.check),
                        label: Text(_isLoading ? 'İşleniyor...' : 'Okumayı Tamamla'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.green[600],
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoChip(String label, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.blue[100],
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        '$label: $value',
        style: TextStyle(
          color: Colors.blue[700],
          fontSize: 12,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }
} 