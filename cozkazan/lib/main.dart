import 'package:flutter/material.dart';
import 'screens/giris_ekrani.dart';
import 'screens/home_screen.dart';
import 'panels/veli_paneli.dart';
import 'panels/cocuk_paneli.dart';
import 'panels/gelisim_gunlugu.dart';

void main() {
  runApp(MaterialApp(
    debugShowCheckedModeBanner: false,
    initialRoute: '/home',
    routes: {
      '/': (context) => HomeScreen(),
      '/home': (context) => HomeScreen(),
      '/veli-paneli': (context) => VeliPaneli(),
      '/cocuk-paneli': (context) => CocukPaneli(),
      '/gelisim-gunlugu': (context) => GelisimGunlugu(),
    },
  ));
}