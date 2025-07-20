import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFe0c3fc), Color(0xFF8ec5fc)],
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
                  const SizedBox(height: 32),
                  // Logo
                  Image.asset('assets/images/gobo.png', height: 120),
                  const SizedBox(height: 16),
                  Text(
                    'ÇÖZ KAZAN',
                    style: TextStyle(
                      fontSize: 36,
                      fontWeight: FontWeight.bold,
                      color: Colors.deepPurple[700],
                      letterSpacing: 2,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Birlikte öğren, birlikte geliş!',
                    style: TextStyle(
                      fontSize: 18,
                      color: Colors.deepPurple[400],
                    ),
                  ),
                  const SizedBox(height: 32),
                  _buildMenuButton(
                    context,
                    label: 'Çocuk Paneli',
                    icon: Icons.child_care,
                    color1: Color(0xFFa18cd1),
                    color2: Color(0xFFfbc2eb),
                    route: '/cocuk-paneli',
                  ),
                  const SizedBox(height: 20),
                  _buildMenuButton(
                    context,
                    label: 'Veli Paneli',
                    icon: Icons.family_restroom,
                    color1: Color(0xFF43cea2),
                    color2: Color(0xFF185a9d),
                    route: '/veli-paneli',
                  ),
                  const SizedBox(height: 20),
                  _buildMenuButton(
                    context,
                    label: 'Gelişim Günlüğü',
                    icon: Icons.show_chart,
                    color1: Color(0xFFf7971e),
                    color2: Color(0xFFffd200),
                    route: '/gelisim-gunlugu',
                  ),
                  const SizedBox(height: 20),
                  _buildMenuButton(
                    context,
                    label: 'AI Soru Analizi',
                    icon: Icons.psychology,
                    color1: Color(0xFF00c6ff),
                    color2: Color(0xFF0072ff),
                    route: '/ai-analiz',
                  ),
                  const SizedBox(height: 20),
                  _buildMenuButton(
                    context,
                    label: 'AI Mentor',
                    icon: Icons.smart_toy,
                    color1: Color(0xFFf857a6),
                    color2: Color(0xFFFF5858),
                    route: '/ai-mentor',
                  ),
                  const SizedBox(height: 40),
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
        height: 60,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(18),
          gradient: LinearGradient(
            colors: [color1, color2],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          boxShadow: [
            BoxShadow(
              color: color2.withOpacity(0.3),
              blurRadius: 10,
              offset: Offset(0, 6),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: Colors.white, size: 28),
            const SizedBox(width: 16),
            Text(
              label,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 22,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.2,
              ),
            ),
          ],
        ),
      ),
    );
  }
} 