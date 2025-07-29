import 'package:flutter/material.dart';
import '../services/kahraman_siralama.dart';

class KahramanSiralamaEkrani extends StatefulWidget {
  const KahramanSiralamaEkrani({super.key});

  @override
  State<KahramanSiralamaEkrani> createState() => _KahramanSiralamaEkraniState();
}

class _KahramanSiralamaEkraniState extends State<KahramanSiralamaEkrani> {
  String _userId = 'bade';
  int _yeniXp = 0;
  int _yeniSeviye = 0;

  @override
  Widget build(BuildContext context) {
    final haftalik = KahramanSiralama.getHaftalikSiralama();
    final ilkUc = KahramanSiralama.getIlkUc();
    final siralama = KahramanSiralama.getKullaniciSiralama(_userId);
    final degisim = KahramanSiralama.getSiralamaDegisimi(_userId);
    return Scaffold(
      appBar: AppBar(title: const Text('Kahraman Sıralama'), backgroundColor: Colors.orange),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Haftalık Sıralama:', style: Theme.of(context).textTheme.titleLarge),
            ...haftalik.map((k) => Text('${k.siralama}. ${k.isim} (XP: ${k.xp}, Seviye: ${k.seviye})')),
            const SizedBox(height: 12),
            Text('İlk 3:', style: Theme.of(context).textTheme.titleMedium),
            ...ilkUc.map((k) => Text('${k.siralama}. ${k.isim}')), 
            const SizedBox(height: 12),
            Text('Kullanıcı Sıralaması: $siralama'),
            Text('Sıralama Değişimi: $degisim'),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: TextField(
                  decoration: const InputDecoration(labelText: 'Yeni XP'),
                  keyboardType: TextInputType.number,
                  onChanged: (v) => _yeniXp = int.tryParse(v) ?? 0,
                )),
                const SizedBox(width: 8),
                Expanded(child: TextField(
                  decoration: const InputDecoration(labelText: 'Yeni Seviye'),
                  keyboardType: TextInputType.number,
                  onChanged: (v) => _yeniSeviye = int.tryParse(v) ?? 0,
                )),
                ElevatedButton(
                  onPressed: () {
                    setState(() {
                      if (_yeniXp > 0) KahramanSiralama.xpGuncelle(_userId, _yeniXp);
                      if (_yeniSeviye > 0) KahramanSiralama.seviyeGuncelle(_userId, _yeniSeviye);
                    });
                  },
                  child: const Text('Güncelle'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
} 