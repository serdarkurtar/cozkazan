import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/gercek_zamanli_sohbet_service.dart';

class GercekZamanliSohbetScreen extends StatefulWidget {
  final String kullaniciId;
  final String kullaniciTipi;

  const GercekZamanliSohbetScreen({
    Key? key,
    required this.kullaniciId,
    required this.kullaniciTipi,
  }) : super(key: key);

  @override
  State<GercekZamanliSohbetScreen> createState() => _GercekZamanliSohbetScreenState();
}

class _GercekZamanliSohbetScreenState extends State<GercekZamanliSohbetScreen> {
  final TextEditingController _mesajController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  
  Map<String, dynamic>? _oturum;
  List<Map<String, dynamic>> _mesajlar = [];
  List<Map<String, dynamic>> _gunlukGorevler = [];
  List<Map<String, dynamic>> _oneriler = [];
  bool _yukleniyor = true;
  bool _mesajGonderiliyor = false;
  String? _hataMesaji;

  @override
  void initState() {
    super.initState();
    _oturumBaslat();
  }

  @override
  void dispose() {
    _mesajController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _oturumBaslat() async {
    try {
      setState(() {
        _yukleniyor = true;
        _hataMesaji = null;
      });

      // Önce aktif oturum var mı kontrol et
      final aktifOturum = await GercekZamanliSohbetService.aktifOturumGetir(
        widget.kullaniciId,
        widget.kullaniciTipi,
      );

      if (aktifOturum != null) {
        _oturum = aktifOturum;
        _mesajlar = List<Map<String, dynamic>>.from(aktifOturum['mesajlar'] ?? []);
        _gunlukGorevler = List<Map<String, dynamic>>.from(aktifOturum['gunlukGorevler'] ?? []);
        _oneriler = List<Map<String, dynamic>>.from(aktifOturum['oneriler'] ?? []);
      } else {
        // Yeni oturum başlat
        final yeniOturum = await GercekZamanliSohbetService.sohbetOturumuBaslat(
          widget.kullaniciId,
          widget.kullaniciTipi,
        );
        _oturum = yeniOturum;
        _mesajlar = List<Map<String, dynamic>>.from(yeniOturum['mesajlar'] ?? []);
        _gunlukGorevler = List<Map<String, dynamic>>.from(yeniOturum['gunlukGorevler'] ?? []);
        _oneriler = List<Map<String, dynamic>>.from(yeniOturum['oneriler'] ?? []);
      }

      setState(() {
        _yukleniyor = false;
      });

      _scrollToBottom();
    } catch (e) {
      setState(() {
        _yukleniyor = false;
        _hataMesaji = e.toString();
      });
    }
  }

  Future<void> _mesajGonder() async {
    final mesaj = _mesajController.text.trim();
    if (mesaj.isEmpty || _mesajGonderiliyor) return;

    try {
      setState(() {
        _mesajGonderiliyor = true;
      });

      // Kullanıcı mesajını ekle
      final kullaniciMesaji = {
        'gonderen': 'user',
        'mesaj': mesaj,
        'zaman': DateTime.now().toIso8601String(),
        'mesajTipi': 'text',
      };

      setState(() {
        _mesajlar.add(kullaniciMesaji);
      });

      _mesajController.clear();
      _scrollToBottom();

      // Asistan yanıtını al
      final guncellenenOturum = await GercekZamanliSohbetService.mesajGonder(mesaj);
      
      setState(() {
        _oturum = guncellenenOturum;
        _mesajlar = List<Map<String, dynamic>>.from(guncellenenOturum['mesajlar'] ?? []);
        _gunlukGorevler = List<Map<String, dynamic>>.from(guncellenenOturum['gunlukGorevler'] ?? []);
        _oneriler = List<Map<String, dynamic>>.from(guncellenenOturum['oneriler'] ?? []);
        _mesajGonderiliyor = false;
      });

      _scrollToBottom();
    } catch (e) {
      setState(() {
        _mesajGonderiliyor = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Mesaj gönderilemedi: $e')),
      );
    }
  }

  Future<void> _gorevTamamla(String gorevId) async {
    try {
      final guncellenenOturum = await GercekZamanliSohbetService.gorevTamamla(gorevId);
      
      setState(() {
        _oturum = guncellenenOturum;
        _gunlukGorevler = List<Map<String, dynamic>>.from(guncellenenOturum['gunlukGorevler'] ?? []);
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Görev tamamlandı! 🎉')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Görev tamamlanamadı: $e')),
      );
    }
  }

  Future<void> _oneriUygula(String oneriId) async {
    try {
      final guncellenenOturum = await GercekZamanliSohbetService.oneriUygula(oneriId);
      
      setState(() {
        _oturum = guncellenenOturum;
        _oneriler = List<Map<String, dynamic>>.from(guncellenenOturum['oneriler'] ?? []);
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Öneri uygulandı! ✅')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Öneri uygulanamadı: $e')),
      );
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${GercekZamanliSohbetService.kullaniciTipiTr(widget.kullaniciTipi)} Sohbet Asistanı'),
        backgroundColor: widget.kullaniciTipi == 'child' ? Colors.green : Colors.orange,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.info_outline),
            onPressed: _oturumBilgileriniGoster,
          ),
          IconButton(
            icon: const Icon(Icons.exit_to_app),
            onPressed: _oturumKapat,
          ),
        ],
      ),
      body: _yukleniyor
          ? const Center(child: CircularProgressIndicator())
          : _hataMesaji != null
              ? _hataWidget()
              : Column(
                  children: [
                    // Profil ve İstatistik Kartları
                    _profilKartlari(),
                    
                    // Ana İçerik
                    Expanded(
                      child: Row(
                        children: [
                          // Sohbet Alanı
                          Expanded(
                            flex: 2,
                            child: _sohbetAlani(),
                          ),
                          
                          // Yan Panel
                          if (MediaQuery.of(context).size.width > 800)
                            Expanded(
                              child: _yanPanel(),
                            ),
                        ],
                      ),
                    ),
                  ],
                ),
    );
  }

  Widget _hataWidget() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.error_outline, size: 64, color: Colors.red),
          const SizedBox(height: 16),
          Text(
            'Hata oluştu',
            style: Theme.of(context).textTheme.headlineSmall,
          ),
          const SizedBox(height: 8),
          Text(
            _hataMesaji!,
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.bodyMedium,
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: _oturumBaslat,
            child: const Text('Tekrar Dene'),
          ),
        ],
      ),
    );
  }

  Widget _profilKartlari() {
    if (_oturum == null) return const SizedBox.shrink();

    final profil = _oturum!['kullaniciProfili'] as Map<String, dynamic>;
    final oturumDurumu = _oturum!['oturumDurumu'] as Map<String, dynamic>;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey[100],
        border: Border(bottom: BorderSide(color: Colors.grey[300]!)),
      ),
      child: Row(
        children: [
          // Profil Bilgileri
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Kullanıcı: ${widget.kullaniciId}',
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                Text(
                  'Yaş: ${profil['yas'] ?? 'Belirtilmemiş'} | Sınıf: ${profil['sinif'] ?? 'Belirtilmemiş'}',
                  style: TextStyle(color: Colors.grey[600]),
                ),
                Text(
                  'Öğrenme Stili: ${GercekZamanliSohbetService.ogrenmeStiliTr(profil['ogrenmeStili'] ?? 'Belirtilmemiş')}',
                  style: TextStyle(color: Colors.grey[600]),
                ),
              ],
            ),
          ),
          
          // İstatistikler
          Row(
            children: [
              _istatistikKarti('Mesaj', '${oturumDurumu['toplamMesaj']}'),
              const SizedBox(width: 8),
              _istatistikKarti('Görev', '${_gunlukGorevler.length}'),
              const SizedBox(width: 8),
              _istatistikKarti('Tamamlanan', '${_gunlukGorevler.where((g) => g['tamamlandi'] == true).length}'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _istatistikKarti(String baslik, String deger) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey[300]!),
      ),
      child: Column(
        children: [
          Text(
            deger,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          Text(
            baslik,
            style: TextStyle(color: Colors.grey[600], fontSize: 12),
          ),
        ],
      ),
    );
  }

  Widget _sohbetAlani() {
    return Column(
      children: [
        // Mesaj Listesi
        Expanded(
          child: Container(
            margin: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.grey[300]!),
            ),
            child: _mesajlar.isEmpty
                ? _bosSohbetWidget()
                : ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.all(16),
                    itemCount: _mesajlar.length,
                    itemBuilder: (context, index) {
                      final mesaj = _mesajlar[index];
                      return _mesajWidget(mesaj);
                    },
                  ),
          ),
        ),
        
        // Mesaj Gönderme Alanı
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            border: Border(top: BorderSide(color: Colors.grey[300]!)),
          ),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _mesajController,
                  decoration: const InputDecoration(
                    hintText: 'Mesajınızı yazın...',
                    border: OutlineInputBorder(),
                  ),
                  onSubmitted: (_) => _mesajGonder(),
                ),
              ),
              const SizedBox(width: 8),
              ElevatedButton(
                onPressed: _mesajGonderiliyor ? null : _mesajGonder,
                style: ElevatedButton.styleFrom(
                  backgroundColor: widget.kullaniciTipi == 'child' ? Colors.green : Colors.orange,
                  foregroundColor: Colors.white,
                ),
                child: _mesajGonderiliyor
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Icon(Icons.send),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _bosSohbetWidget() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            widget.kullaniciTipi == 'child' ? Icons.child_care : Icons.family_restroom,
            size: 64,
            color: Colors.grey[400],
          ),
          const SizedBox(height: 16),
          Text(
            'Sohbete başlayın!',
            style: TextStyle(
              fontSize: 18,
              color: Colors.grey[600],
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            widget.kullaniciTipi == 'child'
                ? 'Asistan size yardımcı olmaya hazır!'
                : 'Çocuğunuzun gelişimi için öneriler alın!',
            style: TextStyle(color: Colors.grey[500]),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _mesajWidget(Map<String, dynamic> mesaj) {
    final gonderen = mesaj['gonderen'] as String;
    final mesajMetni = mesaj['mesaj'] as String;
    final zaman = DateTime.parse(mesaj['zaman'] as String);
    final mesajTipi = mesaj['mesajTipi'] as String? ?? 'text';
    final metadata = mesaj['metadata'] as Map<String, dynamic>?;

    final isUser = gonderen == 'user';
    final alignment = isUser ? Alignment.centerRight : Alignment.centerLeft;
    final backgroundColor = isUser 
        ? (widget.kullaniciTipi == 'child' ? Colors.green : Colors.orange)
        : Colors.grey[200];
    final textColor = isUser ? Colors.white : Colors.black;

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
        children: [
          if (!isUser) ...[
            CircleAvatar(
              radius: 16,
              backgroundColor: Colors.blue,
              child: Icon(
                Icons.smart_toy,
                size: 16,
                color: Colors.white,
              ),
            ),
            const SizedBox(width: 8),
          ],
          
          Flexible(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: backgroundColor,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    mesajMetni,
                    style: TextStyle(color: textColor),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        '${zaman.hour.toString().padLeft(2, '0')}:${zaman.minute.toString().padLeft(2, '0')}',
                        style: TextStyle(
                          color: textColor.withOpacity(0.7),
                          fontSize: 12,
                        ),
                      ),
                      if (metadata != null) ...[
                        const SizedBox(width: 8),
                        if (metadata['konuKategorisi'] != null)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: textColor.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              GercekZamanliSohbetService.konuKategorisiTr(metadata['konuKategorisi']),
                              style: TextStyle(
                                color: textColor,
                                fontSize: 10,
                              ),
                            ),
                          ),
                        if (metadata['duyguSkoru'] != null) ...[
                          const SizedBox(width: 4),
                          Text(
                            GercekZamanliSohbetService.duyguEmoji(metadata['duyguSkoru'].toDouble()),
                            style: const TextStyle(fontSize: 12),
                          ),
                        ],
                      ],
                    ],
                  ),
                ],
              ),
            ),
          ),
          
          if (isUser) ...[
            const SizedBox(width: 8),
            CircleAvatar(
              radius: 16,
              backgroundColor: widget.kullaniciTipi == 'child' ? Colors.green : Colors.orange,
              child: Icon(
                widget.kullaniciTipi == 'child' ? Icons.child_care : Icons.family_restroom,
                size: 16,
                color: Colors.white,
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _yanPanel() {
    return Container(
      margin: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Günlük Görevler
          Expanded(
            child: _gorevlerWidget(),
          ),
          
          const SizedBox(height: 16),
          
          // Öneriler
          Expanded(
            child: _onerilerWidget(),
          ),
        ],
      ),
    );
  }

  Widget _gorevlerWidget() {
    return Card(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                const Icon(Icons.task, color: Colors.blue),
                const SizedBox(width: 8),
                const Text(
                  'Günlük Görevler',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                const Spacer(),
                Text(
                  '${_gunlukGorevler.where((g) => g['tamamlandi'] == true).length}/${_gunlukGorevler.length}',
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
          Expanded(
            child: _gunlukGorevler.isEmpty
                ? const Center(
                    child: Text(
                      'Henüz görev yok',
                      style: TextStyle(color: Colors.grey),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: _gunlukGorevler.length,
                    itemBuilder: (context, index) {
                      final gorev = _gunlukGorevler[index];
                      return _gorevWidget(gorev);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _gorevWidget(Map<String, dynamic> gorev) {
    final tamamlandi = gorev['tamamlandi'] == true;
    final baslik = gorev['baslik'] as String;
    final aciklama = gorev['aciklama'] as String;
    final kategori = gorev['kategori'] as String;
    final puan = gorev['puan'] as int;
    final gorevId = gorev['gorevId'] as String;

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      color: tamamlandi ? Colors.green[50] : Colors.orange[50],
      child: ListTile(
        leading: Icon(
          tamamlandi ? Icons.check_circle : Icons.radio_button_unchecked,
          color: tamamlandi ? Colors.green : Colors.orange,
        ),
        title: Text(
          baslik,
          style: TextStyle(
            fontWeight: FontWeight.bold,
            decoration: tamamlandi ? TextDecoration.lineThrough : null,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(aciklama),
            const SizedBox(height: 4),
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: Colors.blue[100],
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    GercekZamanliSohbetService.gorevKategorisiTr(kategori),
                    style: const TextStyle(fontSize: 10),
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  '$puan puan',
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ],
        ),
        trailing: tamamlandi
            ? const Icon(Icons.check, color: Colors.green)
            : ElevatedButton(
                onPressed: () => _gorevTamamla(gorevId),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                ),
                child: const Text('Tamamla'),
              ),
      ),
    );
  }

  Widget _onerilerWidget() {
    return Card(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                const Icon(Icons.lightbulb, color: Colors.yellow),
                const SizedBox(width: 8),
                const Text(
                  'Öneriler',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                const Spacer(),
                Text(
                  '${_oneriler.where((o) => o['uygulandi'] == true).length}/${_oneriler.length}',
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
          Expanded(
            child: _oneriler.isEmpty
                ? const Center(
                    child: Text(
                      'Henüz öneri yok',
                      style: TextStyle(color: Colors.grey),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: _oneriler.length,
                    itemBuilder: (context, index) {
                      final oneri = _oneriler[index];
                      return _oneriWidget(oneri);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _oneriWidget(Map<String, dynamic> oneri) {
    final uygulandi = oneri['uygulandi'] == true;
    final baslik = oneri['baslik'] as String;
    final aciklama = oneri['aciklama'] as String;
    final kategori = oneri['kategori'] as String;
    final oneriId = oneri['oneriId'] as String;

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      color: uygulandi ? Colors.green[50] : Colors.yellow[50],
      child: ListTile(
        leading: Icon(
          uygulandi ? Icons.check_circle : Icons.lightbulb_outline,
          color: uygulandi ? Colors.green : Colors.yellow[700],
        ),
        title: Text(
          baslik,
          style: TextStyle(
            fontWeight: FontWeight.bold,
            decoration: uygulandi ? TextDecoration.lineThrough : null,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(aciklama),
            const SizedBox(height: 4),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: Colors.purple[100],
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                GercekZamanliSohbetService.konuKategorisiTr(kategori),
                style: const TextStyle(fontSize: 10),
              ),
            ),
          ],
        ),
        trailing: uygulandi
            ? const Icon(Icons.check, color: Colors.green)
            : ElevatedButton(
                onPressed: () => _oneriUygula(oneriId),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.purple,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                ),
                child: const Text('Uygula'),
              ),
      ),
    );
  }

  void _oturumBilgileriniGoster() {
    if (_oturum == null) return;

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Oturum Bilgileri'),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('Kullanıcı ID: ${widget.kullaniciId}'),
              Text('Kullanıcı Tipi: ${GercekZamanliSohbetService.kullaniciTipiTr(widget.kullaniciTipi)}'),
              Text('Oturum ID: ${_oturum!['sohbetOturumu']}'),
              Text('Durum: ${_oturum!['oturumDurumu']['aktif'] ? 'Aktif' : 'Pasif'}'),
              Text('Toplam Mesaj: ${_oturum!['oturumDurumu']['toplamMesaj']}'),
              Text('Ortalama Duygu: ${(_oturum!['oturumDurumu']['ortalamaDuyguSkoru'] * 100).toStringAsFixed(1)}%'),
              Text('Görev Tamamlama: ${_oturum!['gorevTamamlamaOrani'].toStringAsFixed(1)}%'),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Kapat'),
          ),
        ],
      ),
    );
  }

  Future<void> _oturumKapat() async {
    final onay = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Oturumu Kapat'),
        content: const Text('Oturumu kapatmak istediğinizden emin misiniz?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('İptal'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text('Kapat'),
          ),
        ],
      ),
    );

    if (onay == true) {
      try {
        await GercekZamanliSohbetService.oturumKapat();
        if (mounted) {
          Navigator.of(context).pop();
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Oturum kapatılamadı: $e')),
          );
        }
      }
    }
  }
} 