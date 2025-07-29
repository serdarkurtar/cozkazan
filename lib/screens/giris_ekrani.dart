import 'package:flutter/material.dart';
import '../services/api_service.dart';

class GirisEkrani extends StatefulWidget {
  @override
  _GirisEkraniState createState() => _GirisEkraniState();
}

class _GirisEkraniState extends State<GirisEkrani> {
  final emailController = TextEditingController();
  final sifreController = TextEditingController();
  String hata = '';

  void girisYap() async {
    final user = await login(emailController.text, sifreController.text);
    if (user != null) {
      Navigator.pushReplacementNamed(context, '/home');
    } else {
      setState(() {
        hata = "Giriş başarısız. Bilgileri kontrol edin.";
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Giriş')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(controller: emailController, decoration: InputDecoration(labelText: 'Email')),
            TextField(controller: sifreController, decoration: InputDecoration(labelText: 'Şifre'), obscureText: true),
            SizedBox(height: 16),
            ElevatedButton(onPressed: girisYap, child: Text('Giriş Yap')),
            if (hata.isNotEmpty) Text(hata, style: TextStyle(color: Colors.red)),
          ],
        ),
      ),
    );
  }
}