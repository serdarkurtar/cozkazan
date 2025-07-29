import 'package:flutter/material.dart';
import '../services/gelisim_raporu_service.dart';

class GelisimRaporuEkrani extends StatefulWidget {
  const GelisimRaporuEkrani({super.key});

  @override
  State<GelisimRaporuEkrani> createState() => _GelisimRaporuEkraniState();
}

class _GelisimRaporuEkraniState extends State<GelisimRaporuEkrani> {
  final TextEditingController _childController = TextEditingController();
  final TextEditingController _parentController = TextEditingController();
  GelisimRaporu? _rapor;
  bool _loading = false;
  String? _hata;

  Future<void> _olustur() async {
    setState(() { _loading = true; _hata = null; });
    try {
      final rapor = await GelisimRaporuService.otomatikRaporOlustur(
        childId: _childController.text,
        parentId: _parentController.text,
      );
      setState(() { _rapor = rapor; });
    } catch (e) {
      setState(() { _hata = e.toString(); });
    } finally {
      setState(() { _loading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Gelişim Raporu'), backgroundColor: Colors.teal),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: _childController,
              decoration: const InputDecoration(
                labelText: 'Çocuk ID',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _parentController,
              decoration: const InputDecoration(
                labelText: 'Veli ID',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: _loading ? null : _olustur,
              child: _loading ? const CircularProgressIndicator() : const Text('Rapor Oluştur'),
            ),
            const SizedBox(height: 24),
            if (_hata != null) Text('Hata: $_hata', style: const TextStyle(color: Colors.red)),
            if (_rapor != null) ...[
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Rapor Tipi: ${_rapor!.raporTipi}'),
                      Text('Toplam XP: ${_rapor!.toplamXp}'),
                      Text('Toplam Test: ${_rapor!.toplamTest}'),
                      Text('Toplam Hikaye: ${_rapor!.toplamHikaye}'),
                      Text('Başarı Oranı: ${_rapor!.testBasariOrani.toStringAsFixed(2)}'),
                      Text('Motivasyon: ${_rapor!.motivasyonMesaji}'),
                    ],
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
} 