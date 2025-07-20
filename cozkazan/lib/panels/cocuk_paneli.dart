import 'package:flutter/material.dart';

class CocukPaneli extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Çocuk Paneli'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back),
          onPressed: () => Navigator.pushReplacementNamed(context, '/home'),
        ),
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFfbc2eb), Color(0xFFa6c1ee)],
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
                    'Hoş geldin, küçük kahraman! 🎉',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.purple[700],
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildMenuButton(
                    context,
                    label: 'Test Çöz',
                    icon: Icons.play_circle_fill,
                    color1: Color(0xFFFF5858),
                    color2: Color(0xFFFFAE42),
                    route: '/test-coz',
                  ),
                  const SizedBox(height: 18),
                  _buildMenuButton(
                    context,
                    label: 'Hikayeler',
                    icon: Icons.menu_book,
                    color1: Color(0xFFFFC371),
                    color2: Color(0xFFFF5F6D),
                    route: '/hikayeler',
                  ),
                  const SizedBox(height: 18),
                  _buildMenuButton(
                    context,
                    label: 'Ödüller',
                    icon: Icons.emoji_events,
                    color1: Color(0xFFFFE259),
                    color2: Color(0xFFFFA751),
                    route: '/oduller',
                  ),
                  const SizedBox(height: 18),
                  _buildMenuButton(
                    context,
                    label: 'AI Soru Analizi',
                    icon: Icons.psychology,
                    color1: Color(0xFF00c6ff),
                    color2: Color(0xFF0072ff),
                    route: '/ai-analiz',
                  ),
                  const SizedBox(height: 18),
                  _buildMenuButton(
                    context,
                    label: 'Sosyal Görevler',
                    icon: Icons.volunteer_activism,
                    color1: Color(0xFFf7971e),
                    color2: Color(0xFFffd200),
                    route: '/sosyal-gorevler',
                  ),
                  const SizedBox(height: 18),
                  _buildMenuButton(
                    context,
                    label: 'Aile Notları',
                    icon: Icons.notes,
                    color1: Color(0xFFf857a6),
                    color2: Color(0xFFFF5858),
                    route: '/aile-notlari',
                  ),
                  const SizedBox(height: 18),
                  _buildMenuButton(
                    context,
                    label: 'AI Mentor',
                    icon: Icons.smart_toy,
                    color1: Color(0xFFa8edea),
                    color2: Color(0xFFfed6e3),
                    route: '/ai-mentor',
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