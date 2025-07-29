import 'package:flutter/material.dart';
import '../services/veli_kontrol_service.dart';
import 'package:dio/dio.dart';
import 'package:path_provider/path_provider.dart';
import 'dart:io';
import 'package:open_file/open_file.dart';
import '../constants.dart';

class VeliAyarlarEkrani extends StatefulWidget {
  const VeliAyarlarEkrani({super.key});

  @override
  State<VeliAyarlarEkrani> createState() => _VeliAyarlarEkraniState();
}

class _VeliAyarlarEkraniState extends State<VeliAyarlarEkrani> {
  final _yeniSifreController = TextEditingController();
  int _seciliSure = 30;
  bool _cocukModuAktif = false;
  bool _guncellemeYukleniyor = false;

  @override
  void initState() {
    super.initState();
    _ayarlariYukle();
  }

  Future<void> _ayarlariYukle() async {
    final sure = await VeliKontrolService.ekranSuresiAl();
    final cocukModu = await VeliKontrolService.cocukModuAktifMi();

    setState(() {
      _seciliSure = sure;
      _cocukModuAktif = cocukModu;
    });
  }

  Future<void> _sifreKaydet() async {
    if (_yeniSifreController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Şifre boş olamaz')),
      );
      return;
    }

    await VeliKontrolService.veliSifresiKaydet(_yeniSifreController.text);
    _yeniSifreController.clear();

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Şifre kaydedildi')),
    );
  }

  Future<void> _sureKaydet() async {
    await VeliKontrolService.ekranSuresiKaydet(_seciliSure);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Ekran süresi kaydedildi')),
    );
  }

  Future<void> _cocukModuToggle() async {
    await VeliKontrolService.cocukModuAyarla(!_cocukModuAktif);
    setState(() {
      _cocukModuAktif = !_cocukModuAktif;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(_cocukModuAktif ? 'Çocuk modu aktif' : 'Çocuk modu pasif')),
    );
  }

  Future<void> _sifreSifirla() async {
    await VeliKontrolService.veliSifresiSifirla();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Şifre varsayılan şifreye sıfırlandı: ${VeliKontrolService.getVarsayilanSifre()}')),
    );
  }

  Future<void> _guncellemeKontrolEt() async {
    setState(() => _guncellemeYukleniyor = true);
    final apkUrl = 'baseUrl/apk/app-latest.apk';
    try {
      final tempDir = await getTemporaryDirectory();
      final savePath = '${tempDir.path}/app-latest.apk';
      final dio = Dio();
      await dio.download(
        apkUrl,
        savePath,
        onReceiveProgress: (rec, total) {
          // İsterseniz ilerleme gösterebilirsiniz
        },
      );
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Güncelleme indirildi, yükleme başlatılıyor...')),
      );
      await OpenFile.open(savePath);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Güncelleme indirilemedi: $e')),
      );
    } finally {
      setState(() => _guncellemeYukleniyor = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Veli Ayarları'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFFE1BEE7),
              Color(0xFFF8BBD0),
            ],
          ),
        ),
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Card(
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Veli Şifresi',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 16),
                      TextFormField(
                        controller: _yeniSifreController,
                        decoration: InputDecoration(
                          labelText: 'Yeni Şifre',
                          border: OutlineInputBorder(),
                        ),
                        obscureText: true,
                      ),
                      SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: ElevatedButton(
                              onPressed: _sifreKaydet,
                              child: Text('Şifreyi Kaydet'),
                            ),
                          ),
                          SizedBox(width: 8),
                          Expanded(
                            child: ElevatedButton(
                              onPressed: _sifreSifirla,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.orange,
                              ),
                              child: Text('Şifreyi Sıfırla'),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              SizedBox(height: 16),
              Card(
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Ekran Süresi',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 16),
                      DropdownButtonFormField<int>(
                        value: _seciliSure,
                        decoration: InputDecoration(
                          labelText: 'Süre (Dakika)',
                          border: OutlineInputBorder(),
                        ),
                        items: [15, 30, 45, 60, 90, 120].map((sure) {
                          return DropdownMenuItem(
                            value: sure,
                            child: Text('$sure dakika'),
                          );
                        }).toList(),
                        onChanged: (value) {
                          setState(() => _seciliSure = value!);
                        },
                      ),
                      SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _sureKaydet,
                        child: Text('Süreyi Kaydet'),
                      ),
                    ],
                  ),
                ),
              ),
              SizedBox(height: 16),
              Card(
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Çocuk Modu',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 16),
                      SwitchListTile(
                        title: Text('Çocuk Modu Aktif'),
                        subtitle: Text(_cocukModuAktif
                            ? 'Çocuk uygulamadan çıkamaz'
                            : 'Çocuk serbest kullanabilir'),
                        value: _cocukModuAktif,
                        onChanged: (value) => _cocukModuToggle(),
                      ),
                    ],
                  ),
                ),
              ),
              SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: _guncellemeYukleniyor ? null : _guncellemeKontrolEt,
                icon: Icon(Icons.system_update),
                label: Text(_guncellemeYukleniyor ? 'İndiriliyor...' : 'Güncelleme Kontrol Et'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blueGrey,
                  foregroundColor: Colors.white,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}