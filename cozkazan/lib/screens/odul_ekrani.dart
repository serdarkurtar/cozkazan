import 'package:flutter/material.dart';
import '../services/odul_service.dart';

class OdulEkrani extends StatefulWidget {
  const OdulEkrani({super.key});

  @override
  State<OdulEkrani> createState() => _OdulEkraniState();
}

class _OdulEkraniState extends State<OdulEkrani> {
  List<Odul> _oduller = [];
  bool _yukleniyor = true;
  String? _hata;

  @override
  void initState() {
    super.initState();
    _odulleriYukle();
  }

  Future<void> _odulleriYukle() async {
    try {
      setState(() {
        _yukleniyor = true;
        _hata = null;
      });
      
      final oduller = await OdulService.odulleriGetir();
      setState(() {
        _oduller = oduller;
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
        title: const Text("🏆 Ödüller"),
        backgroundColor: Colors.orange,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _odulleriYukle,
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
                  Text('Ödüller yükleniyor...'),
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
                        onPressed: _odulleriYukle,
                        child: const Text('Tekrar Dene'),
                      ),
                    ],
                  ),
                )
              : _oduller.isEmpty
                  ? const Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.star_border, size: 64, color: Colors.grey),
                          SizedBox(height: 16),
                          Text(
                            'Henüz ödül bulunmuyor',
                            style: TextStyle(fontSize: 18, color: Colors.grey),
                          ),
                          SizedBox(height: 8),
                          Text(
                            'AdminJS panelinden ödül ekleyebilirsiniz',
                            style: TextStyle(color: Colors.grey),
                          ),
                        ],
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: _odulleriYukle,
                      child: ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: _oduller.length,
                        itemBuilder: (context, index) {
                          final odul = _oduller[index];
                          return Card(
                            margin: const EdgeInsets.only(bottom: 12),
                            elevation: 4,
                            child: ListTile(
                              leading: CircleAvatar(
                                backgroundColor: odul.tamamlandi 
                                    ? Colors.green 
                                    : Colors.orange,
                                child: Icon(
                                  odul.tamamlandi ? Icons.check : Icons.star,
                                  color: Colors.white,
                                ),
                              ),
                              title: Text(
                                odul.ad,
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                              subtitle: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(odul.aciklama),
                                  const SizedBox(height: 4),
                                  Row(
                                    children: [
                                      Icon(
                                        Icons.trending_up,
                                        size: 16,
                                        color: Colors.orange[700],
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        '${odul.hedefXp} XP',
                                        style: TextStyle(
                                          color: Colors.orange[700],
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ],
                                  ),
                                  if (odul.tamamlanmaTarihi != null) ...[
                                    const SizedBox(height: 4),
                                    Text(
                                      'Tamamlanma: ${_formatTarih(odul.tamamlanmaTarihi!)}',
                                      style: const TextStyle(
                                        fontSize: 12,
                                        color: Colors.grey,
                                      ),
                                    ),
                                  ],
                                ],
                              ),
                              trailing: odul.tamamlandi
                                  ? const Chip(
                                      label: Text('Tamamlandı'),
                                      backgroundColor: Colors.green,
                                      labelStyle: TextStyle(color: Colors.white),
                                    )
                                  : const Chip(
                                      label: Text('Aktif'),
                                      backgroundColor: Colors.orange,
                                      labelStyle: TextStyle(color: Colors.white),
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
} 