import 'package:flutter/material.dart';
import '../services/duygu_analizi_service.dart';

class DuyguAnalizEkrani extends StatefulWidget {
  const DuyguAnalizEkrani({super.key});

  @override
  State<DuyguAnalizEkrani> createState() => _DuyguAnalizEkraniState();
}

class _DuyguAnalizEkraniState extends State<DuyguAnalizEkrani> {
  final TextEditingController _controller = TextEditingController();
  DuyguAnalizi? _sonuc;
  bool _loading = false;
  String? _hata;

  Future<void> _analizEt() async {
    setState(() { _loading = true; _hata = null; });
    try {
      final analiz = await DuyguAnaliziService.analizEt(
        mesaj: _controller.text,
        kullaniciId: 'test_user',
        kullaniciTipi: 'child',
      );
      setState(() { _sonuc = analiz; });
    } catch (e) {
      setState(() { _hata = e.toString(); });
    } finally {
      setState(() { _loading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Duygu Analizi'), backgroundColor: Colors.deepPurple),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: _controller,
              decoration: const InputDecoration(
                labelText: 'Mesajınızı yazın',
                border: OutlineInputBorder(),
              ),
              minLines: 1,
              maxLines: 3,
            ),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: _loading ? null : _analizEt,
              child: _loading ? const CircularProgressIndicator() : const Text('Analiz Et'),
            ),
            const SizedBox(height: 24),
            if (_hata != null) Text('Hata: $_hata', style: const TextStyle(color: Colors.red)),
            if (_sonuc != null) ...[
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Duygu Skoru: ${_sonuc!.duyguSkoru.toStringAsFixed(2)}'),
                      Text('Duygu Kategorisi: ${_sonuc!.duyguKategori}'),
                      Text('Ana Duygular: ${_sonuc!.anaDuygular.join(", ")}'),
                      Text('Yanıt Toni: ${_sonuc!.yanitToni}'),
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