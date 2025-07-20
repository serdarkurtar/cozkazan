import 'package:flutter/material.dart';
import '../data/test_verileri.dart';
import '../services/test_yonetimi.dart';
import '../services/test_service.dart';
import '../services/api_service.dart';

class TestCozmeEkrani extends StatefulWidget {
  final String sinif;
  final String ders;
  final String testId;
  final String userId;

  const TestCozmeEkrani({
    super.key,
    required this.sinif,
    required this.ders,
    required this.testId,
    required this.userId,
  });

  @override
  State<TestCozmeEkrani> createState() => _TestCozmeEkraniState();
}

class _TestCozmeEkraniState extends State<TestCozmeEkrani> {
  Map<String, dynamic>? testData;
  int mevcutSoruIndex = 0;
  int dogruSayisi = 0;
  int yanlisSayisi = 0;
  int bosSayisi = 0;
  int? secilenCevap;
  bool testTamamlandi = false;
  bool cevapVerildi = false;
  List<String> cevaplar = [];
  List<bool> dogruMu = [];
  DateTime? testBaslangic;
  String? aiMotivasyonMesaji;

  @override
  void initState() {
    super.initState();
    testBaslangic = DateTime.now();
    _testiYukle();
  }

  Future<void> _testiYukle() async {
    try {
      final testler = await getTestler(widget.sinif, widget.ders);
      if (testler.isNotEmpty) {
        // Test ID'ye göre test bul
        final test = testler.firstWhere(
          (t) => t['_id'] == widget.testId,
          orElse: () => testler.first,
        );
        
        setState(() {
          testData = test;
          cevaplar = List.filled(test['sorular'].length, '');
          dogruMu = List.filled(test['sorular'].length, false);
        });
      } else {
        _showError('Test bulunamadı');
      }
    } catch (e) {
      _showError('Test yüklenirken hata oluştu: $e');
    }
  }

  void _cevapVer(String cevap) {
    if (cevapVerildi || testData == null) return;

    final soru = testData!['sorular'][mevcutSoruIndex];
    final dogruCevap = soru['cevap'];
    final dogruMu = cevap == dogruCevap;

    setState(() {
      secilenCevap = cevap == 'a' ? 0 : cevap == 'b' ? 1 : cevap == 'c' ? 2 : 3;
      cevapVerildi = true;
      cevaplar[mevcutSoruIndex] = cevap;
      this.dogruMu[mevcutSoruIndex] = dogruMu;

      if (dogruMu) {
        dogruSayisi++;
      } else {
        yanlisSayisi++;
      }
    });

    // AI Motivasyon kontrolü
    if (!dogruMu && _shouldShowMentorHelp()) {
      _showSurpriseMessage();
    }

    // 2 saniye sonra sonraki soruya geç
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        _sonrakiSoru();
      }
    });
  }

  bool _shouldShowMentorHelp() {
    // Her 3. yanlışta veya %10 ihtimalle göster
    if (yanlisSayisi % 3 == 0) return true;
    return (DateTime.now().millisecondsSinceEpoch % 100) < 10;
  }

  void _showSurpriseMessage() {
    // 5-9 yanlış arasında özel mesajlar
    List<String> mesajlar = [];
    
    if (yanlisSayisi >= 5 && yanlisSayisi <= 9) {
      mesajlar = [
        'AI Mentor\'dan sürpriz destek: Bu zorlukları birlikte aşacağız! 🎁',
        'Zorlandığını görüyorum, ama endişelenme! Her yanlış seni güçlendiriyor! 💪',
        'AI Mentor burada! Bu hatalar seni daha da akıllı yapıyor! 🧠',
        'Bazen yanlış yapmak en iyi öğrenme yöntemidir! AI Mentor hep yanında! 🌟',
        'Bu zorlukları birlikte çözeceğiz! AI Mentor seni destekliyor! 🤗',
        'Her yanlış, doğruya giden altın bir adımdır! AI Mentor bunu biliyor! 🚀',
        'Zorlandığında yanında olduğumu unutma! Birlikte başaracağız! ⭐',
        'AI Mentor\'dan minik bir hediye: Bu da benden sana moral! 🎯',
        'Bazen yanlış yapmak da çok eğlenceli! AI Mentor seni destekliyor! 😄',
        'Bu hatalar seni büyütüyor! AI Mentor bunu görüyor ve gurur duyuyor! 🌈',
      ];
    } else {
      // Diğer durumlar için genel mesajlar
      mesajlar = [
        'AI Mentor\'dan minik bir destek: Çaktırma, bu da benden sana hediye! 🎁',
      'Zorlandığında yanında olduğumu unutma, birlikte başaracağız! 🤗',
        'Bunu da AI Mentor\'dan sana moral hediyesi! ⭐',
      'Her yanlış, doğruya giden bir adımdır. AI Mentor hep yanında! 🚀',
      'Bazen yanlış yapmak da çok eğlenceli! AI Mentor seni destekliyor! 😄',
    ];
    }
    
    mesajlar.shuffle();
    final msg = mesajlar.first;
    
    // Daha güzel bir görünüm için
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.purple[800],
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Icon(Icons.smart_toy, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'AI Mentor',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: Colors.purple[800],
                    ),
                  ),
                  Text(
                    msg,
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
                  ),
                ],
              ),
            ),
          ],
        ),
        backgroundColor: Colors.purple[50],
        behavior: SnackBarBehavior.floating,
        duration: const Duration(seconds: 3),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        elevation: 8,
      ),
    );
  }

  void _sonrakiSoru() {
    if (mevcutSoruIndex < testData!['sorular'].length - 1) {
      setState(() {
        mevcutSoruIndex++;
        secilenCevap = null;
        cevapVerildi = false;
      });
    } else {
      _testiBitir();
    }
  }

  void _testiBitir() async {
    final sure = DateTime.now().difference(testBaslangic!).inSeconds;
    final toplamSoru = testData!['sorular'].length;
    final puan = (dogruSayisi / toplamSoru) * 100;

    // Test sonucunu sunucuya kaydet
    try {
      final sonuc = await saveTestSonuc({
        'userId': widget.userId,
        'testId': widget.testId,
        'sinif': widget.sinif,
        'ders': widget.ders,
        'dogruSayisi': dogruSayisi,
        'yanlisSayisi': yanlisSayisi,
        'bosSayisi': bosSayisi,
        'toplamSoru': toplamSoru,
        'puan': puan,
        'sure': sure,
        'cevaplar': cevaplar.asMap().entries.map((entry) => {
          'soruIndex': entry.key,
          'verilenCevap': entry.value,
          'dogruMu': dogruMu[entry.key]
        }).toList(),
      });

      if (sonuc != null) {
        setState(() {
          aiMotivasyonMesaji = sonuc['aiMotivasyonMesaji'];
          testTamamlandi = true;
        });
      }
    } catch (e) {
      print('Test sonucu kaydedilemedi: $e');
      setState(() {
        testTamamlandi = true;
      });
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (testData == null) {
      return Scaffold(
        backgroundColor: Colors.orange[100],
        appBar: AppBar(
          title: const Text('Test Yükleniyor...'),
          backgroundColor: Colors.orange[100],
        ),
        body: const Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    if (testTamamlandi) {
      return _testSonucEkrani();
    }

    final soru = testData!['sorular'][mevcutSoruIndex];

    return Scaffold(
      backgroundColor: Colors.orange[100],
      appBar: AppBar(
        title: Text('${widget.ders} Testi'),
        backgroundColor: Colors.orange[100],
        elevation: 0,
        actions: [
          Container(
            margin: const EdgeInsets.all(8),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.orange,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              '${mevcutSoruIndex + 1}/${testData!['sorular'].length}',
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // İlerleme çubuğu
            LinearProgressIndicator(
              value: (mevcutSoruIndex + 1) / testData!['sorular'].length,
              backgroundColor: Colors.orange[200],
              valueColor: const AlwaysStoppedAnimation<Color>(Colors.orange),
            ),
            const SizedBox(height: 20),

            // Soru kartı
            Expanded(
              child: Card(
                elevation: 8,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Soru ${mevcutSoruIndex + 1}',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.orange[800],
                        ),
                        ),
                      const SizedBox(height: 16),
                      Expanded(
                        child: Text(
                          soru['soru'],
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),

                      // Cevap seçenekleri
                      ...['a', 'b', 'c', 'd'].asMap().entries.map((entry) {
                        final index = entry.key;
                        final cevap = entry.value;
                        final cevapText = soru[cevap];
                        final isSelected = secilenCevap == index;
                        final isCorrect = cevap == soru['cevap'];
                        final showResult = cevapVerildi;
    
    Color backgroundColor = Colors.white;
    Color textColor = Colors.black;

                        if (showResult) {
                          if (isCorrect) {
        backgroundColor = Colors.green[100]!;
        textColor = Colors.green[800]!;
                          } else if (isSelected) {
        backgroundColor = Colors.red[100]!;
        textColor = Colors.red[800]!;
      }
                        } else if (isSelected) {
                          backgroundColor = Colors.orange[200]!;
                          textColor = Colors.orange[800]!;
    }

    return Container(
                          width: double.infinity,
      margin: const EdgeInsets.only(bottom: 12),
                          child: ElevatedButton(
                            onPressed: cevapVerildi ? null : () => _cevapVer(cevap),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: backgroundColor,
                              foregroundColor: textColor,
            padding: const EdgeInsets.all(16),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                                side: BorderSide(
                                  color: showResult && isCorrect 
                                    ? Colors.green 
                                    : showResult && isSelected 
                                    ? Colors.red 
                                    : Colors.orange,
                                  width: 2,
                                ),
                              ),
            ),
            child: Row(
              children: [
                Container(
                  width: 30,
                  height: 30,
                  decoration: BoxDecoration(
                                    color: showResult && isCorrect 
                                      ? Colors.green 
                                      : showResult && isSelected 
                                      ? Colors.red 
                                      : Colors.orange,
                                    borderRadius: BorderRadius.circular(15),
                  ),
                  child: Center(
                    child: Text(
                                      cevap.toUpperCase(),
                                      style: const TextStyle(
                                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Text(
                                    cevapText,
                                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
                                if (showResult && isCorrect)
                                  const Icon(Icons.check_circle, color: Colors.green),
                                if (showResult && isSelected && !isCorrect)
                                  const Icon(Icons.cancel, color: Colors.red),
                              ],
                            ),
                          ),
                        );
                      }).toList(),
              ],
            ),
          ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _testSonucEkrani() {
    final toplamSoru = testData!['sorular'].length;
    final puan = (dogruSayisi / toplamSoru) * 100;
    final basarili = puan >= 60;

    return Scaffold(
      backgroundColor: basarili ? Colors.green[100] : Colors.orange[100],
      appBar: AppBar(
        title: const Text('Test Tamamlandı'),
        backgroundColor: basarili ? Colors.green[100] : Colors.orange[100],
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            // Sonuç kartı
            Card(
              elevation: 8,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  children: [
                    Icon(
                      basarili ? Icons.celebration : Icons.emoji_emotions,
                      size: 80,
                      color: basarili ? Colors.green : Colors.orange,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      basarili ? 'Tebrikler!' : 'İyi Çalıştın!',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: basarili ? Colors.green[800] : Colors.orange[800],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // İstatistikler
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildStatCard('Doğru', dogruSayisi, Colors.green),
                        _buildStatCard('Yanlış', yanlisSayisi, Colors.red),
                        _buildStatCard('Boş', bosSayisi, Colors.grey),
                      ],
                    ),
                    const SizedBox(height: 24),

                    // Puan
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                      decoration: BoxDecoration(
                        color: basarili ? Colors.green[50] : Colors.orange[50],
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: basarili ? Colors.green : Colors.orange,
                          width: 2,
                        ),
                      ),
                      child: Text(
                        'Puan: ${puan.toStringAsFixed(1)}%',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: basarili ? Colors.green[800] : Colors.orange[800],
                        ),
                      ),
                    ),

                    // AI Motivasyon Mesajı
                    if (aiMotivasyonMesaji != null) ...[
                    const SizedBox(height: 20),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.purple[50],
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.purple, width: 1),
                        ),
                        child: Row(
                          children: [
                            Icon(Icons.smart_toy, color: Colors.purple[800]),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                aiMotivasyonMesaji!,
                                style: TextStyle(
                                  fontSize: 16,
                                  color: Colors.purple[800],
                                  fontStyle: FontStyle.italic,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Butonlar
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => Navigator.pop(context),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text(
                      'Ana Sayfa',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context);
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                          builder: (context) => TestCozmeEkrani(
                            sinif: widget.sinif,
                            ders: widget.ders,
                            testId: widget.testId,
                            userId: widget.userId,
                          ),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.orange,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text(
                      'Tekrar Çöz',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(String label, int value, Color color) {
    return Column(
        children: [
        Container(
          width: 60,
          height: 60,
          decoration: BoxDecoration(
            color: color[100],
            borderRadius: BorderRadius.circular(30),
            border: Border.all(color: color, width: 2),
          ),
          child: Center(
            child: Text(
              value.toString(),
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: color[800],
              ),
            ),
            ),
          ),
        const SizedBox(height: 8),
          Text(
          label,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: color[800],
            ),
          ),
        ],
    );
  }
} 