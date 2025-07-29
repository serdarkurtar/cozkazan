import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:url_launcher/url_launcher.dart';
import 'dart:io';
import '../screens/hikaye_okuma_ekrani.dart';
import '../data/hikayeler.dart';

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
                    label: 'Admin Paneli',
                    icon: Icons.admin_panel_settings,
                    color1: Color(0xFF667eea),
                    color2: Color(0xFF764ba2),
                    onTap: () {
                      _openAdminPanel(context);
                    },
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

  void _openAdminPanel(BuildContext context) async {
    // Try to open the admin panel file directly
    final adminPanelPath = 'backend/public/admin-panel.html';
    final fileUri = Uri.file('${Directory.current.path}/$adminPanelPath');
    
    if (await canLaunchUrl(fileUri)) {
      await launchUrl(fileUri, mode: LaunchMode.externalApplication);
    } else {
      // Fallback: Show a dialog with instructions
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text('Admin Paneli'),
          content: Text('Admin panelini açmak için:\n\n1. Backend klasörüne gidin\n2. "public" klasörüne gidin\n3. "admin-panel.html" dosyasını tarayıcıda açın\n\nVeya backend sunucusunu başlatın ve http://localhost:3000/admin-panel.html adresine gidin.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text('Tamam'),
            ),
          ],
        ),
      );
    }
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