import 'package:flutter/material.dart';

class VeliPaneli extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
                    route: '/test-hedef',
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
                    label: 'AI Mentor',
                    icon: Icons.smart_toy,
                    color1: Color(0xFF00c6ff),
                    color2: Color(0xFF0072ff),
                    route: '/ai-mentor',
                  ),
                  const SizedBox(height: 18),
                  _buildMenuButton(
                    context,
                    label: 'AI Soru Analizi',
                    icon: Icons.psychology,
                    color1: Color(0xFFf857a6),
                    color2: Color(0xFFFF5858),
                    route: '/ai-analiz',
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
    required String route,
  }) {
    return GestureDetector(
      onTap: () => Navigator.pushNamed(context, route),
      child: Container(
        width: 300,
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
            Text(
              label,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.1,
              ),
            ),
          ],
        ),
      ),
    );
  }
}