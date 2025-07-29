import 'package:flutter/material.dart';
import '../services/hikaye_service.dart';
import '../data/hikayeler.dart';
import 'hikaye_detay_sayfasi.dart';

class HikayeListesiEkrani extends StatefulWidget {
  const HikayeListesiEkrani({super.key});

  @override
  State<HikayeListesiEkrani> createState() => _HikayeListesiEkraniState();
}

class _HikayeListesiEkraniState extends State<HikayeListesiEkrani> {
  late Future<List<Hikaye>> _hikayeler;
  bool _isLoading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadHikayeler();
  }

  Future<void> _loadHikayeler() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final hikayeler = await HikayeService.getHikayeler();
      setState(() {
        _hikayeler = Future.value(hikayeler);
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('📚 Hikaye Listesi'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
      ),
      body: _isLoading
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  CircularProgressIndicator(color: Colors.deepPurple),
                  SizedBox(height: 16),
                  Text('Hikayeler yükleniyor...'),
                ],
              ),
            )
          : _error != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.error_outline, size: 64, color: Colors.red),
                      const SizedBox(height: 16),
                      const Text(
                        'Sunucudan veri alınamadı',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      Text(_error!),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _loadHikayeler,
                        child: const Text('Tekrar Dene'),
                      ),
                    ],
                  ),
                )
              : FutureBuilder<List<Hikaye>>(
                  future: _hikayeler,
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: const [
                            CircularProgressIndicator(color: Colors.deepPurple),
                            SizedBox(height: 16),
                            Text('Hikayeler yükleniyor...'),
                          ],
                        ),
                      );
                    }

                    if (snapshot.hasError) {
                      return Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.error_outline, size: 64, color: Colors.red),
                            const SizedBox(height: 16),
                            const Text(
                              'Hikayeler yüklenirken hata oluştu',
                              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 8),
                            Text('${snapshot.error}'),
                            const SizedBox(height: 16),
                            ElevatedButton(
                              onPressed: _loadHikayeler,
                              child: const Text('Tekrar Dene'),
                            ),
                          ],
                        ),
                      );
                    }

                    final List<Hikaye> hikayeler = snapshot.data ?? [];
          if (hikayeler.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Icon(Icons.book_outlined, size: 64, color: Colors.grey),
                  SizedBox(height: 16),
                  Text(
                    'Henüz hikaye bulunmuyor',
                    style: TextStyle(fontSize: 18, color: Colors.grey),
                  ),
                ],
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: hikayeler.length,
            itemBuilder: (context, index) {
              final hikaye = hikayeler[index];
              return Card(
                margin: const EdgeInsets.only(bottom: 12),
                elevation: 4,
                child: ListTile(
                  leading: const Icon(Icons.book, color: Colors.deepPurple),
                  title: Text(
                    hikaye.baslik,
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        hikaye.icerik.length > 60
                            ? '${hikaye.icerik.substring(0, 60)}...'
                            : hikaye.icerik,
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: Colors.blue[100],
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              hikaye.kategori,
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.blue[700],
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: Colors.green[100],
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              'Seviye ${hikaye.seviye}',
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.green[700],
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                          const Spacer(),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: Colors.amber[100],
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              '${hikaye.xpOdul} XP',
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.amber[700],
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => HikayeDetaySayfasi(
                          hikaye: hikaye,
                          childId: 'default_child', // Gerçek childId ile değiştirilecek
                        ),
                      ),
                    );
                  },
                ),
              );
            },
          );
        },
      ),
    );
  }
}