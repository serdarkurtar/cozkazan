import 'package:flutter/material.dart';
import '../services/ai_simulasyon.dart';

class AiSimulasyonEkrani extends StatefulWidget {
  const AiSimulasyonEkrani({super.key});

  @override
  State<AiSimulasyonEkrani> createState() => _AiSimulasyonEkraniState();
}

class _AiSimulasyonEkraniState extends State<AiSimulasyonEkrani> {
  final TextEditingController _xpController = TextEditingController(text: '1000');
  final TextEditingController _seviyeController = TextEditingController(text: '3');
  final TextEditingController _testController = TextEditingController(text: '5');
  final TextEditingController _hikayeController = TextEditingController(text: '2');
  String? _sonuc;

  void _goster() {
    final xp = int.tryParse(_xpController.text) ?? 0;
    final seviye = int.tryParse(_seviyeController.text) ?? 1;
    final test = int.tryParse(_testController.text) ?? 0;
    final hikaye = int.tryParse(_hikayeController.text) ?? 0;
    final ai = AiSimulasyon(userId: 'test_user');
    final motivasyon = ai.getMotivasyonMesaji(xp);
    final hedef = ai.getHedefOnerisi(xp);
    final veliRaporu = ai.getVeliRaporu(testSayisi: test, hikayeSayisi: hikaye, xp: xp, seviye: seviye);
    final gorevBasari = ai.getGorevBasariMesaji('Test Çözme');
    final uyari = ai.getUyariMesaji(4);
    final icerik = ai.getIcerikOnerisi(seviye, 'test');
    final haftalik = ai.getHaftalikKahramanAnalizi(xp, 2);
    setState(() {
      _sonuc = '''Motivasyon: $motivasyon\nHedef: $hedef\nVeli Raporu: $veliRaporu\nGörev Başarısı: $gorevBasari\nUyarı: $uyari\nİçerik Önerisi: $icerik\nHaftalık Kahraman: $haftalik''';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('AI Simülasyon'), backgroundColor: Colors.purple),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              children: [
                Expanded(child: TextField(controller: _xpController, decoration: const InputDecoration(labelText: 'XP'))),
                const SizedBox(width: 8),
                Expanded(child: TextField(controller: _seviyeController, decoration: const InputDecoration(labelText: 'Seviye'))),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(child: TextField(controller: _testController, decoration: const InputDecoration(labelText: 'Test Sayısı'))),
                const SizedBox(width: 8),
                Expanded(child: TextField(controller: _hikayeController, decoration: const InputDecoration(labelText: 'Hikaye Sayısı'))),
              ],
            ),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: _goster,
              child: const Text('AI Mesajlarını Göster'),
            ),
            const SizedBox(height: 24),
            if (_sonuc != null)
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Text(_sonuc!),
                ),
              ),
          ],
        ),
      ),
    );
  }
} 