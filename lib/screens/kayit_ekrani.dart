import 'package:flutter/material.dart';
import '../services/api_service.dart';

class KayitEkrani extends StatefulWidget {
  const KayitEkrani({super.key});

  @override
  State<KayitEkrani> createState() => _KayitEkraniState();
}

class _KayitEkraniState extends State<KayitEkrani> {
  final _formKey = GlobalKey<FormState>();
  final _sifreController = TextEditingController();
  final _adController = TextEditingController();
  final _soyadController = TextEditingController();
  final _telefonController = TextEditingController();
  final _sehirController = TextEditingController();
  final _adresController = TextEditingController();
  final _sinifController = TextEditingController();
  String _seciliTip = 'veli';
  bool _yukleniyor = false;

  Future<void> _kayitOl() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _yukleniyor = true);

    try {
      final sonuc = await register(
        _adController.text,
        _soyadController.text,
        _telefonController.text,
        _sifreController.text,
        _sinifController.text,
      );

      final mesaj = (sonuc != null ? (sonuc['mesaj'] ?? '') : '').toLowerCase();
      final bool basarili = mesaj.contains('başar') && !mesaj.contains('başarısız');
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(basarili ? '✅ ${sonuc != null ? sonuc['mesaj'] : ''}' : '❌ ${sonuc != null ? (sonuc['hata'] ?? 'Hata oluştu') : 'Hata oluştu'}'),
          backgroundColor: basarili ? Colors.green : Colors.red,
        ),
      );
      
      if (basarili) {
        Navigator.pop(context);
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('🌐 Bağlantı hatası: $e'),
          backgroundColor: Colors.orange,
        ),
      );
    } finally {
      setState(() => _yukleniyor = false);
    }
  }

  @override
  void dispose() {
    _sifreController.dispose();
    _adController.dispose();
    _soyadController.dispose();
    _telefonController.dispose();
    _sehirController.dispose();
    _adresController.dispose();
    _sinifController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFFE1BEE7), // Açık mor
              Color(0xFFF8BBD0), // Açık pembe
            ],
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: EdgeInsets.all(16.0),
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(height: 40),
                  // Logo kaldırıldı
                  // Image.asset(
                  //   'assets/images/gobo.png',
                  //   width: 120,
                  //   height: 120,
                  //   fit: BoxFit.contain,
                  // ),
                  SizedBox(height: 20),
                  Text(
                    'Kayıt Ol',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Colors.deepPurple,
                    ),
                  ),
                  SizedBox(height: 24),

                  // Kullanıcı Tipi Seçimi
                  Container(
                    padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.9),
                      borderRadius: BorderRadius.circular(15),
                      border: Border.all(color: Colors.deepPurple.withValues(alpha: 0.3)),
                    ),
                    child: DropdownButtonFormField<String>(
                      value: _seciliTip,
                      decoration: InputDecoration(
                        labelText: 'Kullanıcı Tipi',
                        border: InputBorder.none,
                        prefixIcon: Icon(Icons.person_outline),
                      ),
                      items: [
                        DropdownMenuItem(value: 'veli', child: Text('Veli')),
                        DropdownMenuItem(value: 'cocuk', child: Text('Çocuk')),
                      ],
                      onChanged: (value) {
                        setState(() => _seciliTip = value!);
                      },
                    ),
                  ),
                  SizedBox(height: 16),

                  // Kullanıcı Adı
                  // TextFormField(
                  //   controller: _kullaniciAdiController,
                  //   decoration: InputDecoration(
                  //     labelText: 'Kullanıcı Adı',
                  //     border: OutlineInputBorder(
                  //       borderRadius: BorderRadius.circular(15),
                  //     ),
                  //     filled: true,
                  //     fillColor: Colors.white.withOpacity(0.9),
                  //     prefixIcon: Icon(Icons.person),
                  //   ),
                  //   validator: (value) {
                  //     if (value == null || value.isEmpty) {
                  //       return 'Kullanıcı adı gerekli';
                  //     }
                  //     return null;
                  //   },
                  // ),
                  // SizedBox(height: 16),

                  // Şifre
                  TextFormField(
                    controller: _sifreController,
                    decoration: InputDecoration(
                      labelText: 'Şifre',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(15),
                      ),
                      filled: true,
                      fillColor: Colors.white.withValues(alpha: 0.9),
                      prefixIcon: Icon(Icons.lock),
                    ),
                    obscureText: true,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Şifre gerekli';
                      }
                      if (value.length < 6) {
                        return 'Şifre en az 6 karakter olmalı';
                      }
                      return null;
                    },
                  ),
                  SizedBox(height: 16),

                  // Veli bilgileri (sadece veli seçildiğinde göster)
                  if (_seciliTip == 'veli') ...[
                    Text(
                      'Veli Bilgileri',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.deepPurple,
                      ),
                    ),
                    SizedBox(height: 16),

                    // Ad
                    TextFormField(
                      controller: _adController,
                      decoration: InputDecoration(
                        labelText: 'Ad',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(15),
                        ),
                        filled: true,
                        fillColor: Colors.white.withValues(alpha: 0.9),
                        prefixIcon: Icon(Icons.person_outline),
                      ),
                      validator: (value) {
                        if (_seciliTip == 'veli' && (value == null || value.isEmpty)) {
                          return 'Ad gerekli';
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: 16),

                    // Soyad
                    TextFormField(
                      controller: _soyadController,
                      decoration: InputDecoration(
                        labelText: 'Soyad',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(15),
                        ),
                        filled: true,
                        fillColor: Colors.white.withValues(alpha: 0.9),
                        prefixIcon: Icon(Icons.person_outline),
                      ),
                      validator: (value) {
                        if (_seciliTip == 'veli' && (value == null || value.isEmpty)) {
                          return 'Soyad gerekli';
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: 16),

                    // Telefon
                    TextFormField(
                      controller: _telefonController,
                      decoration: InputDecoration(
                        labelText: 'Telefon',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(15),
                        ),
                        filled: true,
                        fillColor: Colors.white.withValues(alpha: 0.9),
                        prefixIcon: Icon(Icons.phone),
                      ),
                      keyboardType: TextInputType.phone,
                      validator: (value) {
                        if (_seciliTip == 'veli' && (value == null || value.isEmpty)) {
                          return 'Telefon gerekli';
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: 16),

                    // Şehir
                    TextFormField(
                      controller: _sehirController,
                      decoration: InputDecoration(
                        labelText: 'Şehir',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(15),
                        ),
                        filled: true,
                        fillColor: Colors.white.withValues(alpha: 0.9),
                        prefixIcon: Icon(Icons.location_city),
                      ),
                      validator: (value) {
                        if (_seciliTip == 'veli' && (value == null || value.isEmpty)) {
                          return 'Şehir gerekli';
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: 16),

                    // Adres
                    TextFormField(
                      controller: _adresController,
                      decoration: InputDecoration(
                        labelText: 'Adres',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(15),
                        ),
                        filled: true,
                        fillColor: Colors.white.withValues(alpha: 0.9),
                        prefixIcon: Icon(Icons.home),
                      ),
                      maxLines: 3,
                      validator: (value) {
                        if (_seciliTip == 'veli' && (value == null || value.isEmpty)) {
                          return 'Adres gerekli';
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: 16),

                    // Sınıf
                    TextFormField(
                      controller: _sinifController,
                      decoration: InputDecoration(
                        labelText: 'Sınıf',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(15),
                        ),
                        filled: true,
                        fillColor: Colors.white.withValues(alpha: 0.9),
                        prefixIcon: Icon(Icons.class_),
                      ),
                      validator: (value) {
                        if (_seciliTip == 'veli' && (value == null || value.isEmpty)) {
                          return 'Sınıf gerekli';
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: 16),
                  ],

                  SizedBox(height: 24),

                  // Kayıt Ol Butonu
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: _yukleniyor ? null : _kayitOl,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.deepPurple,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(15),
                        ),
                        textStyle: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      child: _yukleniyor
                          ? CircularProgressIndicator(color: Colors.white)
                          : Text('Kayıt Ol'),
                    ),
                  ),
                  SizedBox(height: 16),

                  // Giriş Yap Linki
                  TextButton(
                    onPressed: () {
                      Navigator.pop(context);
                    },
                    child: Text(
                      'Zaten hesabın var mı? Giriş yap',
                      style: TextStyle(
                        color: Colors.deepPurple,
                        fontSize: 16,
                      ),
                    ),
                  ),
                  SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}