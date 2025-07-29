import 'package:flutter/material.dart';
import '../services/gelisim_grafik.dart';

class GelisimGrafikEkrani extends StatelessWidget {
  const GelisimGrafikEkrani({super.key});

  @override
  Widget build(BuildContext context) {
    final ozet = GelisimGrafik.getHaftalikOzet();
    final performans = GelisimGrafik.getPerformansDegerlendirmesi();
    final hedef = GelisimGrafik.getHedefOnerisi();
    final enIyiGun = GelisimGrafik.getEnIyiGun();
    final enAktifGun = GelisimGrafik.getEnAktifGun();
    return Scaffold(
      appBar: AppBar(title: const Text('Gelişim Grafik'), backgroundColor: Colors.blueGrey),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Haftalık Özet:', style: Theme.of(context).textTheme.titleLarge),
            Text('Toplam XP: ${ozet['toplamXp']}'),
            Text('Toplam Test: ${ozet['toplamTest']}'),
            Text('Toplam Hikaye: ${ozet['toplamHikaye']}'),
            Text('Seviye Artışı: ${ozet['seviyeArtisi']}'),
            const SizedBox(height: 12),
            Text('Performans: $performans'),
            const SizedBox(height: 12),
            Text('Hedef Önerisi: $hedef'),
            const SizedBox(height: 12),
            Text('En İyi Gün: XP=${enIyiGun.xp}, Seviye=${enIyiGun.seviye}'),
            Text('En Aktif Gün: Test=${enAktifGun.tamamlananTest}, Hikaye=${enAktifGun.okunanHikaye}'),
          ],
        ),
      ),
    );
  }
} 