import 'package:flutter/material.dart';
import '../data/hikayeler.dart';
import '../services/test_yonetimi.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:speech_to_text/speech_to_text.dart';

class HikayeOkumaEkrani extends StatefulWidget {
  final Hikaye hikaye;

  const HikayeOkumaEkrani({super.key, required this.hikaye});

  @override
  State<HikayeOkumaEkrani> createState() => _HikayeOkumaEkraniState();
}

class _HikayeOkumaEkraniState extends State<HikayeOkumaEkrani> {
  late SpeechToText _speech;
  bool _micAvailable = false;
  bool _listening = false;
  int _okunanKelimeIndex = 0;
  double _okumaIlerlemesi = 0.0;
  bool _hikayeTamamlandi = false;
  List<String> _hikayeKelimeler = [];
  double _tamamEsigi = 0.7;
  bool _isInitialized = false;
  String _lastRecognized = '';

  @override
  void initState() {
    super.initState();
    _speech = SpeechToText();
    _hikayeKelimeler = widget.hikaye.icerik.replaceAll(RegExp(r'[.,!?"-]'), '').split(RegExp(r'\s+'));
    _lastRecognized = '';
    _initSpeech();
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.blue[50],
      appBar: AppBar(
        title: Text(
          widget.hikaye.baslik,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.blue[100],
        elevation: 0,
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 8),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  switchInCurve: Curves.easeIn,
                  switchOutCurve: Curves.easeOut,
                  child: ElevatedButton.icon(
                    key: ValueKey(_listening ? 'durdur_btn' : 'baslat_btn'),
                    onPressed: !_micAvailable || _hikayeTamamlandi
                        ? null
                        : _listening
                            ? _stopListening
                            : _startListening,
                    icon: Icon(_listening ? Icons.stop : Icons.mic, color: _listening ? Colors.white : Colors.grey[700]),
                    label: Text(
                      _hikayeTamamlandi
                          ? 'Tamamlandı'
                          : _listening
                              ? 'Durdur'
                              : 'Sesli Okuma',
                      style: TextStyle(
                        color: _listening ? Colors.white : Colors.grey[700],
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _listening ? Colors.red : Colors.grey[200],
                      elevation: _listening ? 4 : 1,
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    ),
                  ),
                ),
                if (!_micAvailable)
                  const Padding(
                    padding: EdgeInsets.only(top: 4),
                    child: Text(
                      'Mikrofon izni gerekli veya cihaz desteklemiyor',
                      style: TextStyle(color: Colors.red, fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          // İlerleme Çubuğu
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.blue[100]!,
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'İlerleme: ${(_okumaIlerlemesi * 100).toInt()}%',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    Text(
                      '${widget.hikaye.xpOdul} XP',
                      style: TextStyle(
                        color: Colors.blue[700],
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                LinearProgressIndicator(
                  value: _okumaIlerlemesi,
                  backgroundColor: Colors.grey[200],
                  valueColor: const AlwaysStoppedAnimation<Color>(Colors.blue),
                ),
              ],
            ),
          ),
          // Hikaye İçeriği
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Hikaye Başlığı
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.blue[100]!,
                          blurRadius: 8,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        Text(
                          widget.hikaye.baslik,
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Colors.blue,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.blue[100],
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                widget.hikaye.kategori,
                                style: TextStyle(
                                  color: Colors.blue[700],
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.green[100],
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                'Seviye ${widget.hikaye.seviye}',
                                style: TextStyle(
                                  color: Colors.green[700],
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                  // Hikaye Metni (karaoke)
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.blue[100]!,
                          blurRadius: 8,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: _buildKaraokeMetin(),
                  ),
                  const SizedBox(height: 20),
                  // Önemli Kelimeler
                  if (widget.hikaye.kelimeler.isNotEmpty) ...[
                    const Text(
                      '📚 Önemli Kelimeler',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.blue,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: widget.hikaye.kelimeler.map((kelime) {
                        return Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: Colors.blue[100],
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: Colors.blue[300]!),
                          ),
                          child: Text(
                            kelime,
                            style: TextStyle(
                              color: Colors.blue[700],
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ],
                ],
              ),
            ),
          ),
          // Alt Kontrol Paneli (sadece sesli okuma durumu)
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.blue[100]!,
                  blurRadius: 4,
                  offset: const Offset(0, -2),
                ),
              ],
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  _listening ? Icons.mic : Icons.mic_off,
                  color: _listening ? Colors.red : Colors.grey,
                  size: 20,
                ),
                const SizedBox(width: 8),
                Text(
                  _listening ? 'Sesli Okuma Aktif' : 'Sesli Okuma Kapalı',
                  style: TextStyle(
                    color: _listening ? Colors.red[700] : Colors.grey[700],
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildKaraokeMetin() {
    return SingleChildScrollView(
      child: Text(
        widget.hikaye.icerik,
        style: const TextStyle(fontSize: 16, color: Colors.black87),
      ),
    );
  }

  Future<void> _initSpeech() async {
    _micAvailable = await _speech.initialize(
      onStatus: (status) {
        print('Speech status: $status');
        if (status == 'done' && _listening && !_hikayeTamamlandi) {
          _startListening();
        }
      },
      onError: (error) {
        print('Speech error: $error');
        setState(() => _listening = false);
      },
      debugLogging: false,
    );
    setState(() {});
    print('Mikrofon kullanılabilir mi: [32m$_micAvailable[0m');
  }

  void _startListening() async {
    print('StartListening çağrıldı');
    if (!_micAvailable || _hikayeTamamlandi || !mounted) {
      print('Mikrofon yok veya tamamlandı!');
      return;
    }
    try {
      await _speech.listen(
        localeId: 'tr_TR',
        onResult: (result) {
          print('Recognized: [34m${result.recognizedWords}[0m');
          _processSpeech(result.recognizedWords);
          _checkCompletion();
        },
        listenMode: ListenMode.dictation,
        partialResults: true,
        listenFor: Duration(minutes: 5),
        pauseFor: Duration(seconds: 10),
      );
      setState(() => _listening = true);
      print('Dinleme başlatıldı!');
    } catch (e) {
      print('Dinleme başlatılamadı: $e');
      setState(() => _listening = false);
    }
  }

  void _stopListening() async {
    setState(() => _listening = false);
    try {
      await _speech.stop();
      await _speech.cancel();
    } catch (e) {}
  }

  void _processSpeech(String spoken) {
    if (_hikayeTamamlandi || !mounted) return;

    // Tüm spoken kelimeleri normalize et
    final spokenWords = spoken
        .toLowerCase()
        .replaceAll(RegExp(r'[.,!?"-]'), '')
        .split(RegExp(r'\\s+'))
        .where((w) => w.isNotEmpty)
        .toList();

    int i = 0; // hikaye kelime indexi
    int j = 0; // spoken kelime indexi

    // Sıralı ve toleranslı eşleşme
    while (i < _hikayeKelimeler.length && j < spokenWords.length) {
      if (_hikayeKelimeler[i].toLowerCase() == spokenWords[j]) {
        i++;
        j++;
      } else {
        j++; // spoken'da atla, hikaye kelimesini bekle
      }
    }

    setState(() {
      _okunanKelimeIndex = i;
      _okumaIlerlemesi = _okunanKelimeIndex / _hikayeKelimeler.length;
    });
  }

  void _checkCompletion() {
    if (_okunanKelimeIndex >= _hikayeKelimeler.length && !_hikayeTamamlandi) {
      setState(() {
        _hikayeTamamlandi = true;
      });
      _stopListening();
      _karaokeBitinceOdulGoster();
    }
  }

  void _karaokeBitinceOdulGoster() async {
    // XP ekle
    await TestYonetimi.xpEkle(widget.hikaye.xpOdul);
    // Okunan hikayeyi kaydet
    final prefs = await SharedPreferences.getInstance();
    List<String> okunanHikayeler = prefs.getStringList('okunan_hikayeler') ?? [];
    if (!okunanHikayeler.contains(widget.hikaye.id)) {
      okunanHikayeler.add(widget.hikaye.id);
      await prefs.setStringList('okunan_hikayeler', okunanHikayeler);
    }
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('🎉 Tebrikler!'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.celebration,
              size: 60,
              color: Colors.amber,
            ),
            const SizedBox(height: 16),
            Text(
              '${widget.hikaye.baslik} hikayesini başarıyla sesli okudun!',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 8),
            Text(
              '${widget.hikaye.xpOdul} XP kazandın!',
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.green,
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Tamam'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              Navigator.pop(context);
            },
            child: const Text('Ana Sayfaya Dön'),
          ),
        ],
      ),
    );
  }
} 