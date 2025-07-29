import 'package:flutter/material.dart';
import '../services/veli_uyari.dart';

class VeliUyariEkrani extends StatefulWidget {
  const VeliUyariEkrani({super.key});

  @override
  State<VeliUyariEkrani> createState() => _VeliUyariEkraniState();
}

class _VeliUyariEkraniState extends State<VeliUyariEkrani> {
  final TextEditingController _userController = TextEditingController(text: 'bade');
  List<String> _uyarilar = [];
  String? _motivasyon;
  List<String> _oneriler = [];
  Map<String, dynamic>? _istatistikler;

  void _goster() {
    final userId = _userController.text;
    setState(() {
      _uyarilar = VeliUyari.getUyarilar(userId);
      _motivasyon = VeliUyari.getMotivasyonMesaji(userId);
      _oneriler = VeliUyari.getOneriler(userId);
      _istatistikler = VeliUyari.getIstatistikler();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Veli Uyarı & Öneri'), backgroundColor: Colors.redAccent),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextField(
              controller: _userController,
              decoration: const InputDecoration(labelText: 'Kullanıcı ID', border: OutlineInputBorder()),
            ),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: _goster,
              child: const Text('Uyarı & Öneri Göster'),
            ),
            const SizedBox(height: 24),
            if (_uyarilar.isNotEmpty) ...[
              Text('Uyarılar:', style: Theme.of(context).textTheme.titleMedium),
              ..._uyarilar.map((u) => Text(u)),
              const SizedBox(height: 12),
            ],
            if (_motivasyon != null) ...[
              Text('Motivasyon:', style: Theme.of(context).textTheme.titleMedium),
              Text(_motivasyon!),
              const SizedBox(height: 12),
            ],
            if (_oneriler.isNotEmpty) ...[
              Text('Öneriler:', style: Theme.of(context).textTheme.titleMedium),
              ..._oneriler.map((o) => Text(o)),
              const SizedBox(height: 12),
            ],
            if (_istatistikler != null) ...[
              Text('İstatistikler:', style: Theme.of(context).textTheme.titleMedium),
              ..._istatistikler!.entries.map((e) => Text('${e.key}: ${e.value}')),
            ],
          ],
        ),
      ),
    );
  }
} 