import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:io';
import 'package:path/path.dart' as path;

import 'hikayeler.dart';
import 'aile_notlari.dart';
import 'odul.dart';
import 'sosyal_gorevler.dart';
import '../constants.dart';

// HİKAYELERİ GÖNDER
Future<void> topluHikayeGonder(List<dynamic> hikayeListesi) async {
  final url = Uri.parse('$baseUrl/api/hikayeler');
  for (final hikaye in hikayeListesi) {
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'baslik': hikaye.baslik,
        'kategori': hikaye.kategori,
        'icerik': hikaye.icerik,
        'seviye': hikaye.seviye,
        'xpOdul': hikaye.xpOdul,
        'sesliOkumaDestegi': hikaye.sesliOkumaDestegi,
        'kelimeler': hikaye.kelimeler,
      }),
    );
    print(response.statusCode == 201
        ? 'Hikaye eklendi: ${hikaye.baslik}'
        : 'Hata: ${response.body}');
  }
}

// TESTLERİ GÖNDER
Future<void> topluTestGonder(List<dynamic> testListesi) async {
  final url = Uri.parse('$baseUrl/api/testsorusus');
  for (final test in testListesi) {
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'soru': test.soru,
        'secenekler': test.secenekler,
        'dogruCevap': test.dogruCevap,
        'ders': test.ders,
        'zorluk': test.zorluk,
        'sinif': test.sinif,
        'xp': test.xp,
      }),
    );
    print(response.statusCode == 201
        ? 'Test eklendi: ${test.soru}'
        : 'Hata: ${response.body}');
  }
}

// AİLE NOTLARINI GÖNDER
Future<void> topluAileNotuGonder(List<dynamic> aileNotuListesi) async {
  final url = Uri.parse('$baseUrl/api/ailenotus');
  for (final not in aileNotuListesi) {
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'gonderen': not.gonderen,
        'mesaj': not.mesaj,
        'tarih': not.tarih.toIso8601String(),
      }),
    );
    print(response.statusCode == 201
        ? 'Aile notu eklendi: ${not.mesaj}'
        : 'Hata: ${response.body}');
  }
}

// ÖDÜLLERİ GÖNDER
Future<void> topluOdulGonder(List<dynamic> odulListesi) async {
  final url = Uri.parse('$baseUrl/api/oduls');
  for (final odul in odulListesi) {
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'ad': odul.ad,
        'aciklama': odul.aciklama,
        'hedefXp': odul.hedefXp,
        'tamamlandi': odul.tamamlandi,
        'tamamlanmaTarihi': odul.tamamlanmaTarihi?.toIso8601String(),
      }),
    );
    print(response.statusCode == 201
        ? 'Ödül eklendi: ${odul.ad}'
        : 'Hata: ${response.body}');
  }
}

// SOSYAL GÖREVLERİ GÖNDER
Future<void> topluSosyalGorevGonder(List<dynamic> gorevListesi) async {
  final url = Uri.parse('$baseUrl/api/sosyalgorevs');
  for (final gorev in gorevListesi) {
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'baslik': gorev.baslik,
        'aciklama': gorev.aciklama,
        'xpOdulu': gorev.xpOdulu,
        'kategori': gorev.kategori,
        'tamamlandi': gorev.tamamlandi,
        'veliOnayi': gorev.veliOnayi,
        'tamamlanmaTarihi': gorev.tamamlanmaTarihi?.toIso8601String(),
        'olusturmaTarihi': gorev.olusturmaTarihi?.toIso8601String(),
        'manuelGorev': gorev.manuelGorev,
      }),
    );
    print(response.statusCode == 201
        ? 'Sosyal görev eklendi: ${gorev.baslik}'
        : 'Hata: ${response.body}');
  }
}

// TÜM VERİLERİ TEK SEFERDE AKTAR
Future<void> tumVerileriAktar() async {
  await topluHikayeGonder(HikayeVerileri.tumHikayeler);
  await topluTestGonder(TestVerileri.tumSorular);
  await topluAileNotuGonder(aileNotuListesi); // kendi listenin adını kullan
  await topluOdulGonder(odulListesi);         // kendi listenin adını kullan
  await topluSosyalGorevGonder(SosyalGorevVerileri.varsayilanGorevler);
} 