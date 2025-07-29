import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../services/firebase_service.dart';

class TestCozmeEkrani extends StatefulWidget {
  final String testAdi;
  
  const TestCozmeEkrani({Key? key, required this.testAdi}) : super(key: key);

  @override
  State<TestCozmeEkrani> createState() => _TestCozmeEkraniState();
}

class _TestCozmeEkraniState extends State<TestCozmeEkrani> 
    with TickerProviderStateMixin {
  
  List<Map<String, dynamic>> sorular = [];
  int mevcutSoruIndex = 0;
  int? secilenCevap;
  bool cevapVerildi = false;
  int dogruCevapSayisi = 0;
  int toplamSoru = 0;
  bool testBitti = false;
  
  // Animasyon kontrolcüleri
  late AnimationController _cevapAnimationController;
  late AnimationController _motivasyonAnimationController;
  late AnimationController _particleAnimationController;
  
  late Animation<double> _cevapScaleAnimation;
  late Animation<double> _cevapFadeAnimation;
  late Animation<double> _motivasyonScaleAnimation;
  late Animation<Offset> _particleSlideAnimation;
  
  // Motivasyon sistemi - 60 mesaj
  List<String> motivasyonMesajlari = [
    "🎉 Harika! Sen bir süper kahramansın!",
    "🌟 Muhteşem! Beynini çok iyi kullanıyorsun!",
    "🚀 İnanılmaz! Sen gerçekten çok akıllısın!",
    "💎 Mükemmel! Sen bir dehasın!",
    "🏆 Olağanüstü! Sen gerçekten çok başarılısın!",
    "⭐ Süper! Sen gerçekten çok zekisin!",
    "🎯 Mükemmel! Sen gerçekten çok yeteneklisin!",
    "💪 Harika! Sen gerçekten çok güçlüsün!",
    "🌈 Muhteşem! Sen gerçekten çok özelsin!",
    "🎊 Olağanüstü! Sen gerçekten çok başarılısın!",
    "🔥 Ateş gibisin! Çok hızlı düşünüyorsun!",
    "⚡ Şimşek gibi hızlısın! Muhteşem!",
    "🎨 Sanatçı gibi yaratıcısın!",
    "🧠 Einstein gibi zekisin!",
    "🏅 Altın madalya kazandın!",
    "💫 Yıldız gibi parlıyorsun!",
    "🎪 Sirk gibi eğlencelisin!",
    "🎭 Oyuncu gibi yeteneklisin!",
    "🎪 Büyücü gibi büyüleyicisin!",
    "🎯 Nişancı gibi isabetlisin!",
    "🏃‍♂️ Koşucu gibi hızlısın!",
    "🎪 Akrobat gibi çeviksin!",
    "🎨 Ressam gibi yaratıcısın!",
    "🎵 Müzisyen gibi ritmiksin!",
    "🎪 Palyaço gibi neşelisin!",
    "🏆 Şampiyon gibi güçlüsün!",
    "⭐ Süperstar gibi parlıyorsun!",
    "🎪 Sihirbaz gibi büyüleyicisin!",
    "🚀 Roket gibi hızlısın!",
    "💎 Elmas gibi değerlisin!",
    "🌟 Yıldız gibi ışıldıyorsun!",
    "🎪 Juggler gibi beceriklisin!",
    "🏅 Olimpiyat şampiyonu gibisin!",
    "🎨 Picasso gibi yaratıcısın!",
    "🎵 Mozart gibi yeteneklisin!",
    "🎪 Trapez gibi cesursun!",
    "🏆 Dünya şampiyonu gibisin!",
    "⭐ Hollywood yıldızı gibisin!",
    "🎪 Büyü gibi büyüleyicisin!",
    "🚀 Uzay gemisi gibi hızlısın!",
    "💎 Safir gibi değerlisin!",
    "🌟 Güneş gibi parlak!",
    "🎪 Akrobasi gibi çeviksin!",
    "🏅 Nobel ödülü kazandın!",
    "🎨 Van Gogh gibi yaratıcısın!",
    "🎵 Beethoven gibi yeteneklisin!",
    "🎪 Sirk gibi eğlencelisin!",
    "🏆 Şampiyonlar ligi şampiyonu!",
    "⭐ Süper kahraman gibisin!",
    "🎪 Sihir gibi büyüleyicisin!",
    "🚀 Jet gibi hızlısın!",
    "💎 Zümrüt gibi değerlisin!",
    "🌟 Ay gibi güzelsin!",
    "🎪 Juggling gibi beceriklisin!",
    "🏅 Altın madalya kazandın!",
    "🎨 Leonardo da Vinci gibisin!",
    "🎵 Bach gibi yeteneklisin!",
    "🎪 Trapeze gibi cesursun!",
    "🏆 Dünya kupası şampiyonu!",
    "⭐ Süper model gibisin!",
    "🎪 Büyü gibi büyüleyicisin!"
  ];
  
  String? gosterilecekMotivasyonMesaji;
  bool motivasyonGosteriliyor = false;

  @override
  void initState() {
    super.initState();
    _testiYukle();
    _animasyonlariBaslat();
  }

  void _animasyonlariBaslat() {
    _cevapAnimationController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );
    _cevapScaleAnimation = Tween<double>(begin: 1.0, end: 1.1).animate(
      CurvedAnimation(parent: _cevapAnimationController, curve: Curves.elasticOut)
    );
    _cevapFadeAnimation = Tween<double>(begin: 1.0, end: 0.8).animate(
      CurvedAnimation(parent: _cevapAnimationController, curve: Curves.easeInOut)
    );
    
    _motivasyonAnimationController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _motivasyonScaleAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _motivasyonAnimationController, curve: Curves.bounceOut)
    );
    
    _particleAnimationController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );
    _particleSlideAnimation = Tween<Offset>(
      begin: const Offset(0, 0),
      end: const Offset(0, -2),
    ).animate(CurvedAnimation(
      parent: _particleAnimationController,
      curve: Curves.easeOutBack,
    ));
  }

  Future<void> _testiYukle() async {
    try {
      final testData = await FirebaseService.getTestDetaylari(widget.testAdi);
      if (testData != null && testData['sorular'] != null) {
        setState(() {
          sorular = List<Map<String, dynamic>>.from(testData['sorular']);
          toplamSoru = sorular.length;
        });
        print('✅ Test yüklendi: ${sorular.length} soru');
      } else {
        print('❌ Test bulunamadı');
        _hataGoster('Test bulunamadı!');
      }
    } catch (e) {
      print('❌ Test yükleme hatası: $e');
      _hataGoster('Test yüklenirken hata oluştu!');
    }
  }

  void _hataGoster(String mesaj) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(mesaj),
        backgroundColor: Colors.red,
        duration: const Duration(seconds: 3),
      ),
    );
  }

  void _cevapVer(String cevap) {
    if (cevapVerildi) return;
    
    setState(() {
      secilenCevap = ['a', 'b', 'c', 'd'].indexOf(cevap);
      cevapVerildi = true;
    });
    
    _cevapAnimationController.forward();
    
    final mevcutSoru = sorular[mevcutSoruIndex];
    final dogruCevap = (mevcutSoru['cevap'] ?? 'a').toLowerCase();
    final secilenCevapHarfi = cevap.toLowerCase();
    
    if (secilenCevapHarfi == dogruCevap) {
      dogruCevapSayisi++;
      _motivasyonGoster();
    }
    
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        _sonrakiSoru();
      }
    });
  }

  void _motivasyonGoster() {
    if (motivasyonGosteriliyor) return;
    
    setState(() {
      motivasyonGosteriliyor = true;
      gosterilecekMotivasyonMesaji = motivasyonMesajlari[mevcutSoruIndex % motivasyonMesajlari.length];
    });
    
    _motivasyonAnimationController.forward();
    _particleAnimationController.forward();
    
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) {
        setState(() {
          motivasyonGosteriliyor = false;
          gosterilecekMotivasyonMesaji = null;
        });
        _motivasyonAnimationController.reset();
        _particleAnimationController.reset();
      }
    });
  }

  void _sonrakiSoru() {
    if (mevcutSoruIndex < sorular.length - 1) {
      setState(() {
        mevcutSoruIndex++;
        secilenCevap = null;
        cevapVerildi = false;
      });
      _cevapAnimationController.reset();
    } else {
      setState(() {
        testBitti = true;
      });
    }
  }

  @override
  void dispose() {
    _cevapAnimationController.dispose();
    _motivasyonAnimationController.dispose();
    _particleAnimationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (sorular.isEmpty) {
      return Scaffold(
        backgroundColor: Colors.blue[50],
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Colors.blue[600]!),
              ),
              const SizedBox(height: 20),
              Text(
                'Test yükleniyor...',
                style: TextStyle(
                  fontSize: 18,
                  color: Colors.blue[700],
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      );
    }

    if (testBitti) {
      return _testSonucuEkrani();
    }

    final mevcutSoru = sorular[mevcutSoruIndex];
    final dogruCevap = (mevcutSoru['cevap'] ?? 'a').toLowerCase();

    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Colors.purple[300]!,
              Colors.blue[400]!,
              Colors.green[300]!,
              Colors.orange[300]!,
            ],
          ),
        ),
        child: Stack(
          children: [
            // Arka plan parçacıkları
            ...List.generate(20, (index) {
              return Positioned(
                left: (index * 100.0) % MediaQuery.of(context).size.width,
                top: (index * 50.0) % MediaQuery.of(context).size.height,
                child: Container(
                  width: 4,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.3),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              );
            }),
            
            // Ana içerik
            SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    // İlerleme çubuğu
                    Container(
                      width: double.infinity,
                      height: 12,
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.3),
                        borderRadius: BorderRadius.circular(6),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.1),
                            blurRadius: 4,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: FractionallySizedBox(
                        alignment: Alignment.centerLeft,
                        widthFactor: (mevcutSoruIndex + 1) / toplamSoru,
                        child: Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                Colors.pink[400]!,
                                Colors.purple[400]!,
                                Colors.blue[400]!,
                                Colors.green[400]!,
                              ],
                            ),
                            borderRadius: BorderRadius.circular(6),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.purple.withOpacity(0.5),
                                blurRadius: 8,
                                spreadRadius: 1,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    
                    const SizedBox(height: 25),
                    
                    // Soru kartı
                    Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.95),
                        borderRadius: BorderRadius.circular(24),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.15),
                            blurRadius: 20,
                            offset: const Offset(0, 8),
                          ),
                        ],
                        border: Border.all(
                          color: Colors.white.withOpacity(0.3),
                          width: 2,
                        ),
                      ),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    colors: [Colors.blue[400]!, Colors.purple[400]!],
                                  ),
                                  borderRadius: BorderRadius.circular(20),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.blue.withOpacity(0.3),
                                      blurRadius: 8,
                                      offset: const Offset(0, 4),
                                    ),
                                  ],
                                ),
                                child: Text(
                                  'Soru ${mevcutSoruIndex + 1}/$toplamSoru',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                  ),
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    colors: [Colors.green[400]!, Colors.teal[400]!],
                                  ),
                                  borderRadius: BorderRadius.circular(20),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.green.withOpacity(0.3),
                                      blurRadius: 8,
                                      offset: const Offset(0, 4),
                                    ),
                                  ],
                                ),
                                child: Row(
                                  children: [
                                    const Icon(Icons.check_circle, color: Colors.white, size: 20),
                                    const SizedBox(width: 8),
                                    Text(
                                      '$dogruCevapSayisi Doğru',
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 16,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 24),
                          Container(
                            padding: const EdgeInsets.all(20),
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [
                                  Colors.orange[50]!,
                                  Colors.yellow[50]!,
                                ],
                              ),
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: Colors.orange[200]!,
                                width: 2,
                              ),
                            ),
                            child: Text(
                              mevcutSoru['soru'] ?? 'Soru bulunamadı',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.w600,
                                height: 1.5,
                                color: Colors.grey[800],
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ),
                        ],
                      ),
                    ),
                    
                    const SizedBox(height: 30),
                    
                    // Cevap seçenekleri
                    Expanded(
                      child: ListView.builder(
                        itemCount: 4,
                        itemBuilder: (context, index) {
                          final cevap = ['a', 'b', 'c', 'd'][index];
                          final cevapText = mevcutSoru[cevap] ?? 'Seçenek $cevap';
                          final isSelected = secilenCevap == index;
                          final isCorrect = cevap.toLowerCase() == dogruCevap;
                          final showResult = cevapVerildi;

                          List<Color> gradientColors = [Colors.white, Colors.grey[50]!];
                          Color textColor = Colors.grey[800]!;
                          Color borderColor = Colors.grey[300]!;
                          IconData? iconData;
                          Color iconColor = Colors.transparent;

                          if (showResult) {
                            if (isCorrect) {
                              gradientColors = [Colors.green[400]!, Colors.teal[400]!];
                              textColor = Colors.white;
                              borderColor = Colors.green[400]!;
                              iconData = Icons.sentiment_very_satisfied;
                              iconColor = Colors.white;
                            } else if (isSelected && !isCorrect) {
                              gradientColors = [Colors.red[400]!, Colors.pink[400]!];
                              textColor = Colors.white;
                              borderColor = Colors.red[400]!;
                              iconData = Icons.sentiment_very_dissatisfied;
                              iconColor = Colors.white;
                            }
                          } else if (isSelected) {
                            gradientColors = [Colors.blue[400]!, Colors.purple[400]!];
                            textColor = Colors.white;
                            borderColor = Colors.blue[400]!;
                          }

                          return AnimatedBuilder(
                            animation: _cevapAnimationController,
                            builder: (context, child) {
                              return Transform.scale(
                                scale: showResult && (isCorrect || (isSelected && !isCorrect)) 
                                  ? _cevapScaleAnimation.value 
                                  : 1.0,
                                child: Opacity(
                                  opacity: showResult && (isCorrect || (isSelected && !isCorrect)) 
                                    ? _cevapFadeAnimation.value 
                                    : 1.0,
                                  child: Container(
                                    margin: const EdgeInsets.only(bottom: 16),
                                    child: Container(
                                      decoration: BoxDecoration(
                                        gradient: LinearGradient(
                                          colors: gradientColors,
                                        ),
                                        borderRadius: BorderRadius.circular(20),
                                        boxShadow: [
                                          BoxShadow(
                                            color: showResult && (isCorrect || (isSelected && !isCorrect))
                                              ? (isCorrect ? Colors.green : Colors.red).withOpacity(0.4)
                                              : Colors.black.withOpacity(0.1),
                                            blurRadius: showResult && (isCorrect || (isSelected && !isCorrect)) ? 15 : 8,
                                            offset: const Offset(0, 4),
                                          ),
                                        ],
                                        border: Border.all(
                                          color: borderColor,
                                          width: showResult && (isCorrect || (isSelected && !isCorrect)) ? 3 : 2,
                                        ),
                                      ),
                                      child: Material(
                                        color: Colors.transparent,
                                        child: InkWell(
                                          onTap: cevapVerildi ? null : () => _cevapVer(cevap),
                                          borderRadius: BorderRadius.circular(20),
                                          child: Padding(
                                            padding: const EdgeInsets.all(20),
                                            child: Row(
                                              children: [
                                                Container(
                                                  width: 50,
                                                  height: 50,
                                                  decoration: BoxDecoration(
                                                    gradient: LinearGradient(
                                                      colors: showResult && isCorrect 
                                                        ? [Colors.green[600]!, Colors.teal[600]!]
                                                        : showResult && isSelected && !isCorrect
                                                        ? [Colors.red[600]!, Colors.pink[600]!]
                                                        : [Colors.blue[600]!, Colors.purple[600]!],
                                                    ),
                                                    borderRadius: BorderRadius.circular(25),
                                                    boxShadow: [
                                                      BoxShadow(
                                                        color: showResult && (isCorrect || (isSelected && !isCorrect)) 
                                                          ? (isCorrect ? Colors.green : Colors.red).withOpacity(0.5)
                                                          : Colors.blue.withOpacity(0.3),
                                                        blurRadius: 12,
                                                        spreadRadius: 2,
                                                      )
                                                    ],
                                                  ),
                                                  child: Center(
                                                    child: Text(
                                                      cevap.toUpperCase(),
                                                      style: const TextStyle(
                                                        color: Colors.white,
                                                        fontWeight: FontWeight.bold,
                                                        fontSize: 20,
                                                      ),
                                                    ),
                                                  ),
                                                ),
                                                const SizedBox(width: 20),
                                                Expanded(
                                                  child: Text(
                                                    cevapText,
                                                    style: TextStyle(
                                                      fontSize: 18,
                                                      fontWeight: FontWeight.w500,
                                                      color: textColor,
                                                      height: 1.3,
                                                    ),
                                                  ),
                                                ),
                                                if (iconData != null)
                                                  Icon(iconData, color: iconColor, size: 32),
                                              ],
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              );
                            },
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ),
            
            // Motivasyon mesajı overlay
            if (motivasyonGosteriliyor)
              AnimatedBuilder(
                animation: _motivasyonAnimationController,
                builder: (context, child) {
                  return Transform.scale(
                    scale: _motivasyonScaleAnimation.value,
                    child: Center(
                      child: Container(
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [Colors.yellow[400]!, Colors.orange[400]!],
                          ),
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.3),
                              blurRadius: 20,
                              spreadRadius: 5,
                            ),
                          ],
                        ),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(
                              Icons.celebration,
                              size: 48,
                              color: Colors.white,
                            ),
                            const SizedBox(height: 16),
                            Text(
                              gosterilecekMotivasyonMesaji ?? '',
                              style: const TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            
            // Parçacık efekti
            if (motivasyonGosteriliyor)
              AnimatedBuilder(
                animation: _particleAnimationController,
                builder: (context, child) {
                  return SlideTransition(
                    position: _particleSlideAnimation,
                    child: Stack(
                      children: List.generate(20, (index) {
                        return Positioned(
                          left: (index * 50.0) % MediaQuery.of(context).size.width,
                          top: MediaQuery.of(context).size.height * 0.3,
                          child: Text(
                            ['⭐', '🎉', '🌟', '💎', '🏆'][index % 5],
                            style: const TextStyle(fontSize: 24),
                          ),
                        );
                      }),
                    ),
                  );
                },
              ),
          ],
        ),
      ),
    );
  }

  Widget _testSonucuEkrani() {
    final basariOrani = (dogruCevapSayisi / toplamSoru) * 100;
    String basariMesaji = '';
    String emoji = '';
    
    if (basariOrani >= 90) {
      basariMesaji = 'Mükemmel! Sen bir dehasın!';
      emoji = '🏆';
    } else if (basariOrani >= 80) {
      basariMesaji = 'Harika! Çok başarılısın!';
      emoji = '🌟';
    } else if (basariOrani >= 70) {
      basariMesaji = 'Güzel! İyi gidiyorsun!';
      emoji = '🎉';
    } else if (basariOrani >= 60) {
      basariMesaji = 'İyi! Daha da iyisini yapabilirsin!';
      emoji = '👍';
    } else {
      basariMesaji = 'Endişelenme! Biraz daha çalış!';
      emoji = '💪';
    }

    return Scaffold(
      backgroundColor: Colors.blue[50],
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                emoji,
                style: const TextStyle(fontSize: 80),
              ),
              const SizedBox(height: 30),
              
              Text(
                basariMesaji,
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.blue,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 20),
              
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Text(
                      'Test Sonucu',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.grey[700],
                      ),
                    ),
                    const SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _sonucKarti('Doğru', dogruCevapSayisi, Colors.green),
                        _sonucKarti('Yanlış', toplamSoru - dogruCevapSayisi, Colors.red),
                      ],
                    ),
                    const SizedBox(height: 20),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.blue[100],
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        'Başarı Oranı: %${basariOrani.toInt()}',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.blue[700],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 40),
              
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.of(context).pop();
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.grey[600],
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        'Geri Dön',
                        style: TextStyle(
                          fontSize: 16,
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
                        setState(() {
                          mevcutSoruIndex = 0;
                          secilenCevap = null;
                          cevapVerildi = false;
                          dogruCevapSayisi = 0;
                          testBitti = false;
                        });
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue[600],
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        'Tekrar Çöz',
                        style: TextStyle(
                          fontSize: 16,
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
      ),
    );
  }

  Widget _sonucKarti(String baslik, int sayi, Color renk) {
    return Column(
      children: [
        Container(
          width: 60,
          height: 60,
          decoration: BoxDecoration(
            color: renk.withOpacity(0.1),
            borderRadius: BorderRadius.circular(30),
          ),
          child: Center(
            child: Text(
              sayi.toString(),
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: renk,
              ),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          baslik,
          style: TextStyle(
            fontSize: 14,
            color: Colors.grey[600],
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }
} 