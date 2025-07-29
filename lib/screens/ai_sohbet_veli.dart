import 'package:flutter/material.dart';
import '../services/ai_mentor_parent.dart';
import '../services/ai_memory.dart';
import '../services/ai_learner.dart';

class AiSohbetVeli extends StatefulWidget {
  const AiSohbetVeli({super.key});

  @override
  State<AiSohbetVeli> createState() => _AiSohbetVeliState();
}

class _AiSohbetVeliState extends State<AiSohbetVeli> {
  final TextEditingController _controller = TextEditingController();
  final List<Map<String, String>> _sohbet = [];
  final ScrollController _scrollController = ScrollController();
  String _parentId = 'parent_${DateTime.now().millisecondsSinceEpoch}';

  @override
  void initState() {
    super.initState();
    // Hoş geldin mesajı
    _sohbet.add({
      "rol": "ai",
      "mesaj": "Merhaba! Ben ÇözKazan AI Veli Danışmanı. Çocuğunuzun eğitimi, motivasyonu, ekran süresi, kitap okuma, test çözme gibi konularda size yardımcı olabilirim. Hangi konuda destek istiyorsunuz?"
    });
  }

  void _gonder() async {
    final mesaj = _controller.text.trim();
    if (mesaj.isEmpty) return;

    final cevap = await AiMentorParent.cevapVer(mesaj, parentId: _parentId);

    setState(() {
      _sohbet.add({"rol": "veli", "mesaj": mesaj});
      _sohbet.add({"rol": "ai", "mesaj": cevap});
      _controller.clear();
    });

    // Otomatik scroll
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
        title: const Text("🤝 AI Veli Danışmanı"),
        backgroundColor: Colors.teal,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.psychology),
            onPressed: () => _showPersonalizedAdvice(),
            tooltip: 'Kişisel Öneri',
          ),
          IconButton(
            icon: const Icon(Icons.help),
            onPressed: _showYardimDialog,
          ),
        ],
      ),
      body: Column(
        children: [
          // Hızlı soru butonları
          Container(
            padding: const EdgeInsets.all(8),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _buildHizliSoruButonu("Ekran süresi"),
                  _buildHizliSoruButonu("Kitap okuma"),
                  _buildHizliSoruButonu("Motivasyon"),
                  _buildHizliSoruButonu("Test çözme"),
                  _buildHizliSoruButonu("Disiplin"),
                ],
              ),
            ),
          ),
          
          // Sohbet alanı
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(8),
              itemCount: _sohbet.length,
              itemBuilder: (context, index) {
                final item = _sohbet[index];
                final isAI = item["rol"] == "ai";
                return _buildMesajBubble(item["mesaj"] ?? "", isAI, index == 0);
              },
            ),
          ),
          
          // Mesaj gönderme alanı
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.grey[100],
              border: Border(
                top: BorderSide(color: Colors.grey[300]!),
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: InputDecoration(
                      hintText: "Sorunuzu yazın...",
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(25),
                      ),
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                    ),
                    onSubmitted: (_) => _gonder(),
                  ),
                ),
                const SizedBox(width: 8),
                FloatingActionButton(
                  onPressed: _gonder,
                  backgroundColor: Colors.teal,
                  foregroundColor: Colors.white,
                  mini: true,
                  child: const Icon(Icons.send),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHizliSoruButonu(String soru) {
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: ElevatedButton(
        onPressed: () {
          _controller.text = soru;
          _gonder();
        },
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.teal[100],
          foregroundColor: Colors.teal[800],
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
        ),
        child: Text(soru),
      ),
    );
  }

  Widget _buildMesajBubble(String mesaj, bool isAI, bool isWelcome) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
      child: Row(
        mainAxisAlignment: isAI ? MainAxisAlignment.start : MainAxisAlignment.end,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (isAI) ...[
            CircleAvatar(
              radius: 16,
              backgroundColor: Colors.teal,
              child: const Icon(Icons.psychology, color: Colors.white, size: 16),
            ),
            const SizedBox(width: 8),
          ],
          Flexible(
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isAI 
                    ? (isWelcome ? Colors.teal[50] : Colors.blue[50])
                    : Colors.green[100],
                borderRadius: BorderRadius.circular(16),
                border: isWelcome ? Border.all(color: Colors.teal[200]!) : null,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (isWelcome) ...[
                    Row(
                      children: [
                        const Icon(Icons.psychology, color: Colors.teal, size: 16),
                        const SizedBox(width: 4),
                        const Text(
                          "AI Danışman",
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Colors.teal,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                  ],
                  Text(
                    mesaj,
                    style: TextStyle(
                      fontSize: isWelcome ? 16 : 14,
                      color: isWelcome ? Colors.teal[800] : Colors.black87,
                    ),
                  ),
                ],
              ),
            ),
          ),
          if (!isAI) ...[
            const SizedBox(width: 8),
            CircleAvatar(
              radius: 16,
              backgroundColor: Colors.green,
              child: const Icon(Icons.person, color: Colors.white, size: 16),
            ),
          ],
        ],
      ),
    );
  }

  void _showPersonalizedAdvice() async {
    final advice = await AiMentorParent.getPersonalizedAdvice(_parentId);
    
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(advice),
          backgroundColor: Colors.teal[400],
          duration: const Duration(seconds: 4),
        ),
      );
    }
  }

  void _showYardimDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("AI Veli Danışmanı"),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Bu AI danışmanı size şu konularda yardımcı olabilir:"),
            SizedBox(height: 8),
            Text("• Ekran süresi yönetimi"),
            Text("• Kitap okuma alışkanlığı"),
            Text("• Motivasyon ve ödül sistemi"),
            Text("• Test çözme alışkanlığı"),
            Text("• Disiplin ve davranış yönetimi"),
            Text("• Sınav kaygısı"),
            Text("• Dikkat ve odaklanma"),
            Text("• Ödev alışkanlığı"),
            SizedBox(height: 8),
            Text("Sadece sorunuzu yazın, AI size özel öneriler sunacaktır."),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Anladım'),
          ),
        ],
      ),
    );
  }
} 