import 'package:flutter/material.dart';
import '../screens/veli_test_ayar_ekrani.dart';
import '../screens/xp_hedef_ekrani.dart';
import '../screens/hikaye_okuma_ekrani.dart';
import '../data/hikayeler.dart';

class VeliPaneli extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Colors.blue),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFa1c4fd), Color(0xFFc2e9fb)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const SizedBox(height: 24),
                  Text(
                    'Hoş geldiniz, sevgili veli! 👨‍👩‍👧‍👦',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.blue[800],
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildMenuButton(
                    context,
                    label: 'Test Hedefi Belirle',
                    icon: Icons.track_changes,
                    color1: Color(0xFFf7971e),
                    color2: Color(0xFFffd200),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => VeliTestAyarEkrani(),
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 18),
                  _buildMenuButton(
                    context,
                    label: 'XP Hedefi Belirle',
                    icon: Icons.emoji_events,
                    color1: Color(0xFF8E2DE2),
                    color2: Color(0xFF4A00E0),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => XpHedefEkrani(),
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 18),
                  _buildMenuButton(
                    context,
                    label: 'Ekran Süresi Ayarla',
                    icon: Icons.timer,
                    color1: Color(0xFF43cea2),
                    color2: Color(0xFF185a9d),
                    route: '/ekran-suresi',
                  ),
                  const SizedBox(height: 18),
                  _buildMenuButton(
                    context,
                    label: 'Serbest Gün Tanımla',
                    icon: Icons.calendar_today,
                    color1: Color(0xFFa18cd1),
                    color2: Color(0xFFfbc2eb),
                    route: '/serbest-gun',
                  ),
                  const SizedBox(height: 18),
                  _buildMenuButton(
                    context,
                    label: 'Çocuk Başarısını Görüntüle',
                    icon: Icons.bar_chart,
                    color1: Color(0xFF43e97b),
                    color2: Color(0xFF38f9d7),
                    route: '/cocuk-basarisi',
                  ),
                  const SizedBox(height: 18),
                  _buildMenuButton(
                    context,
                    label: 'Not Bırak',
                    icon: Icons.edit_note,
                    color1: Color(0xFFb79891),
                    color2: Color(0xFF94716b),
                    route: '/not-birak',
                  ),
                  const SizedBox(height: 18),
                  _buildMenuButton(
                    context,
                    label: 'İstatistikler',
                    icon: Icons.insights,
                    color1: Color(0xFF7F7FD5),
                    color2: Color(0xFF86A8E7),
                    route: '/veli-istatistikleri',
                  ),
                  const SizedBox(height: 18),
                  _buildMenuButton(
                    context,
                    label: 'Ayarlar',
                    icon: Icons.settings,
                    color1: Color(0xFF43C6AC),
                    color2: Color(0xFF191654),
                    route: '/veli-ayarlar',
                  ),
                  const SizedBox(height: 18),
                  _buildMenuButton(
                    context,
                    label: 'Sosyal Görevler',
                    icon: Icons.volunteer_activism,
                    color1: Color(0xFFFFB75E),
                    color2: Color(0xFFED8F03),
                    route: '/veli-sosyal-gorevler',
                  ),
                  const SizedBox(height: 18),
                  _buildMenuButton(
                    context,
                    label: 'Test Seçimi',
                    icon: Icons.list_alt,
                    color1: Color(0xFF00B4DB),
                    color2: Color(0xFF0083B0),
                    route: '/test-secim',
                  ),
                  const SizedBox(height: 18),
                  _buildMenuButton(
                    context,
                    label: 'AI Sohbet (Veli)',
                    icon: Icons.psychology,
                    color1: Color(0xFF43E97B),
                    color2: Color(0xFF38F9D7),
                    route: '/ai-sohbet-veli',
                  ),
                  const SizedBox(height: 18),
                  _buildMenuButton(
                    context,
                    label: 'AI Sohbet (Çocuk)',
                    icon: Icons.child_care,
                    color1: Color(0xFFFFDEE9),
                    color2: Color(0xFFB5FFFC),
                    route: '/ai-sohbet-cocuk',
                  ),
                  const SizedBox(height: 18),
                  _buildMenuButton(
                    context,
                    label: 'Hikaye Listesi',
                    icon: Icons.menu_book,
                    color1: Color(0xFF2193B0),
                    color2: Color(0xFF6DD5ED),
                    route: '/hikayeler',
                  ),
                  const SizedBox(height: 18),
                  _buildMenuButton(
                    context,
                    label: 'Hikaye Detay',
                    icon: Icons.chrome_reader_mode,
                    color1: Color(0xFFee9ca7),
                    color2: Color(0xFFffdde1),
                    route: '/hikaye-detay',
                  ),
                  const SizedBox(height: 18),
                  _buildMenuButton(
                    context,
                    label: 'Hikaye Okuma',
                    icon: Icons.menu_book_outlined,
                    color1: Color(0xFFB993D6),
                    color2: Color(0xFF8CA6DB),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => HikayeOkumaEkrani(hikaye: ornekHikaye),
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 18),
                  _buildMenuButton(
                    context,
                    label: 'Çoklu Çocuk Yönetimi',
                    icon: Icons.group,
                    color1: Color(0xFF56CCF2),
                    color2: Color(0xFF2F80ED),
                    route: '/coklu-cocuk-yonetimi',
                  ),
                  const SizedBox(height: 18),
                  _buildMenuButton(
                    context,
                    label: 'Kayıt Ekranı',
                    icon: Icons.app_registration,
                    color1: Color(0xFFf7971e),
                    color2: Color(0xFFffd200),
                    route: '/kayit',
                  ),
                  const SizedBox(height: 18),
                  _buildMenuButton(
                    context,
                    label: 'Gerçek Zamanlı Sohbet',
                    icon: Icons.forum,
                    color1: Color(0xFF00c6ff),
                    color2: Color(0xFF0072ff),
                    route: '/gercek-zamanli-sohbet',
                  ),
                  const SizedBox(height: 18),
                  _buildMenuButton(
                    context,
                    label: 'Duygu Analizi',
                    icon: Icons.emoji_emotions,
                    color1: Color(0xFFffb347),
                    color2: Color(0xFFffcc33),
                    route: '/duygu-analiz',
                  ),
                  const SizedBox(height: 18),
                  _buildMenuButton(
                    context,
                    label: 'Gelişim Raporu',
                    icon: Icons.insert_chart,
                    color1: Color(0xFF43cea2),
                    color2: Color(0xFF185a9d),
                    route: '/gelisim-raporu',
                  ),
                  const SizedBox(height: 18),
                  _buildMenuButton(
                    context,
                    label: 'AI Simülasyon',
                    icon: Icons.smart_toy,
                    color1: Color(0xFF8EC5FC),
                    color2: Color(0xFFE0C3FC),
                    route: '/ai-simulasyon',
                  ),
                  const SizedBox(height: 18),
                  _buildMenuButton(
                    context,
                    label: 'Gelişim Grafik',
                    icon: Icons.show_chart,
                    color1: Color(0xFFf7971e),
                    color2: Color(0xFFffd200),
                    route: '/gelisim-grafik',
                  ),
                  const SizedBox(height: 18),
                  _buildMenuButton(
                    context,
                    label: 'Kahraman Sıralama',
                    icon: Icons.leaderboard,
                    color1: Color(0xFF00B4DB),
                    color2: Color(0xFF0083B0),
                    route: '/kahraman-siralama',
                  ),
                  const SizedBox(height: 18),
                  _buildMenuButton(
                    context,
                    label: 'Veli Uyarı & Öneri',
                    icon: Icons.warning,
                    color1: Color(0xFFff5858),
                    color2: Color(0xFFffae42),
                    route: '/veli-uyari',
                  ),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildMenuButton(BuildContext context, {
    required String label,
    required IconData icon,
    required Color color1,
    required Color color2,
    String? route,
    VoidCallback? onTap,
  }) {
    return GestureDetector(
      onTap: onTap ?? (route != null ? () => Navigator.pushNamed(context, route) : null),
      child: Container(
        width: 360,
        height: 56,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          gradient: LinearGradient(
            colors: [color1, color2],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          boxShadow: [
            BoxShadow(
              color: color2.withOpacity(0.25),
              blurRadius: 8,
              offset: Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: Colors.white, size: 26),
            const SizedBox(width: 14),
            FittedBox(
              fit: BoxFit.scaleDown,
              child: Text(
                label,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.1,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}