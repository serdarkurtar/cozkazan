import 'package:flutter/material.dart';
import '../services/api_service.dart';

class VeliIstatistikleriEkrani extends StatefulWidget {
  const VeliIstatistikleriEkrani({super.key});

  @override
  State<VeliIstatistikleriEkrani> createState() => _VeliIstatistikleriEkraniState();
}

class _VeliIstatistikleriEkraniState extends State<VeliIstatistikleriEkrani> {
  bool _yukleniyor = true;
  Map<String, dynamic>? _istatistikler;
  Map<String, dynamic>? _sehirBazli;
  String? _hata;

  @override
  void initState() {
    super.initState();
    _verileriYukle();
  }

  Future<void> _verileriYukle() async {
    setState(() {
      _yukleniyor = true;
      _hata = null;
    });

    try {
      final istatistikler = await ApiService.veliIstatistikleri();
      final sehirBazli = await ApiService.sehirBazliKullanicilar();

      if (mounted) {
        setState(() {
          _istatistikler = istatistikler;
          _sehirBazli = sehirBazli;
          _yukleniyor = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _hata = e.toString();
          _yukleniyor = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Veli İstatistikleri'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: _verileriYukle,
          ),
        ],
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFFE1BEE7),
              Color(0xFFF8BBD0),
            ],
          ),
        ),
        child: _yukleniyor
            ? Center(child: CircularProgressIndicator())
            : _hata != null
                ? _hataWidget()
                : SingleChildScrollView(
                    padding: EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _genelIstatistikler(),
                        SizedBox(height: 24),
                        _sehirBazliIstatistikler(),
                      ],
                    ),
                  ),
      ),
    );
  }

  Widget _hataWidget() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.error_outline, size: 64, color: Colors.red),
          SizedBox(height: 16),
          Text(
            'Veri yüklenirken hata oluştu',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 8),
          Text(_hata ?? 'Bilinmeyen hata'),
          SizedBox(height: 16),
          ElevatedButton(
            onPressed: _verileriYukle,
            child: Text('Tekrar Dene'),
          ),
        ],
      ),
    );
  }

  Widget _genelIstatistikler() {
    return Card(
      elevation: 8,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Genel İstatistikler',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.deepPurple,
              ),
            ),
            SizedBox(height: 16),
            _istatistikKarti(
              'Toplam Veli',
              _istatistikler?['toplamVeli']?.toString() ?? '0',
              Icons.family_restroom,
              Colors.blue,
            ),
            SizedBox(height: 8),
            _istatistikKarti(
              'Toplam Çocuk',
              _istatistikler?['toplamCocuk']?.toString() ?? '0',
              Icons.child_care,
              Colors.green,
            ),
            SizedBox(height: 8),
            _istatistikKarti(
              'Aktif Kullanıcılar',
              _istatistikler?['aktifKullanicilar']?.toString() ?? '0',
              Icons.online_prediction,
              Colors.orange,
            ),
            SizedBox(height: 8),
            _istatistikKarti(
              'Bu Ay Kayıt Olanlar',
              _istatistikler?['buAyKayitlar']?.toString() ?? '0',
              Icons.trending_up,
              Colors.purple,
            ),
          ],
        ),
      ),
    );
  }

  Widget _sehirBazliIstatistikler() {
    final sehirler = _sehirBazli?['sehirler'] as List? ?? [];
    
    return Card(
      elevation: 8,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Şehir Bazlı Kullanıcılar',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.deepPurple,
              ),
            ),
            SizedBox(height: 16),
            if (sehirler.isEmpty)
              Center(
                child: Text(
                  'Henüz şehir verisi bulunmuyor',
                  style: TextStyle(color: Colors.grey),
                ),
              )
            else
              ...sehirler.map((sehir) => _sehirKarti(sehir)).toList(),
          ],
        ),
      ),
    );
  }

  Widget _istatistikKarti(String baslik, String deger, IconData icon, Color renk) {
    return Container(
      padding: EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: renk.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: renk.withValues(alpha: 0.3)),
      ),
      child: Row(
        children: [
          Icon(icon, color: renk, size: 24),
          SizedBox(width: 12),
          Expanded(
            child: Text(
              baslik,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          Text(
            deger,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: renk,
            ),
          ),
        ],
      ),
    );
  }

  Widget _sehirKarti(Map<String, dynamic> sehir) {
    final sehirAdi = sehir['sehir'] ?? 'Bilinmeyen';
    final veliSayisi = sehir['veliSayisi'] ?? 0;
    final cocukSayisi = sehir['cocukSayisi'] ?? 0;
    final toplam = veliSayisi + cocukSayisi;

    return Container(
      margin: EdgeInsets.only(bottom: 8),
      padding: EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.8),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Colors.deepPurple.withValues(alpha: 0.2)),
      ),
      child: Row(
        children: [
          Icon(Icons.location_city, color: Colors.deepPurple),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  sehirAdi,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  'Veli: $veliSayisi | Çocuk: $cocukSayisi',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.deepPurple,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              toplam.toString(),
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }
} 