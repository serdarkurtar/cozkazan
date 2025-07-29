import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';
import 'screens/giris_ekrani.dart';
import 'screens/home_screen.dart';
import 'panels/veli_paneli.dart';
import 'panels/cocuk_paneli.dart';
import 'screens/gelisim_gunlugu_paneli.dart';
import 'screens/test_cozme_ekrani.dart';
import 'screens/hikaye_listesi_ekrani.dart';
import 'screens/odul_ekrani.dart';
import 'screens/sosyal_gorevler_ekrani.dart';
import 'screens/aile_notlari_ekrani.dart';
import 'screens/xp_hedef_ekrani.dart';
import 'screens/veli_istatistikleri_ekrani.dart';
import 'screens/veli_ayarlar_ekrani.dart';
import 'screens/veli_sosyal_gorevler_ekrani.dart';
import 'screens/ai_analiz_paneli.dart';
import 'screens/ai_mentor_screen.dart';
import 'screens/test_secim_ekrani.dart';
import 'screens/veli_test_ayar_ekrani.dart';
import 'screens/hikaye_detay_sayfasi.dart';
import 'screens/hikaye_okuma_ekrani.dart';
import 'screens/ai_sohbet_veli.dart';
import 'screens/ai_sohbet_cocuk.dart';
import 'screens/coklu_cocuk_yonetimi.dart';
import 'screens/kayit_ekrani.dart';
import 'screens/gercek_zamanli_sohbet_screen.dart';
import 'screens/duygu_analiz_ekrani.dart';
import 'screens/gelisim_raporu_ekrani.dart';
import 'screens/ai_simulasyon_ekrani.dart';
import 'screens/gelisim_grafik_ekrani.dart';
import 'screens/kahraman_siralama_ekrani.dart';
import 'screens/veli_uyari_ekrani.dart';
import 'data/hikayeler.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(MaterialApp(
    debugShowCheckedModeBanner: false,
    initialRoute: '/home',
    routes: {
      '/': (context) => HomeScreen(),
      '/home': (context) => HomeScreen(),
      '/veli-paneli': (context) => VeliPaneli(),
      '/cocuk-paneli': (context) => CocukPaneli(),
      '/gelisim-gunlugu': (context) => GelisimGunluguPaneli(),
      // Çocuk paneli alt ekranları
      '/test-coz': (context) => TestCozmeEkrani(
            testAdi: '',
          ),
      '/hikayeler': (context) => HikayeListesiEkrani(),
      '/oduller': (context) => OdulEkrani(),
      '/sosyal-gorevler': (context) => SosyalGorevlerEkrani(),
      '/aile-notlari': (context) => AileNotlariEkrani(kullaniciTipi: ''),
      '/ai-analiz': (context) => AiAnalizPaneli(),
      '/ai-sohbet': (context) => AiMentorScreen(),
      // Veli paneli alt ekranları
      '/test-hedef': (context) => XpHedefEkrani(),
      '/veli-istatistikleri': (context) => VeliIstatistikleriEkrani(),
      '/veli-ayarlar': (context) => VeliAyarlarEkrani(),
      '/veli-sosyal-gorevler': (context) => VeliSosyalGorevlerEkrani(),
      '/ekran-suresi': (context) => VeliAyarlarEkrani(),
      '/serbest-gun': (context) => VeliAyarlarEkrani(), // Placeholder, gerekirse ayrı ekran eklenir
      '/cocuk-basarisi': (context) => VeliIstatistikleriEkrani(),
      '/not-birak': (context) => AileNotlariEkrani(kullaniciTipi: 'veli'),
      '/test-secim': (context) => TestSecimEkrani(userId: '', sinif: ''),
      '/veli-test-ayarlari': (context) => VeliTestAyarEkrani(),
      '/hikaye-detay': (context) => HikayeDetaySayfasi(
            hikaye: HikayeVerileri.tumHikayeler.first,
            childId: 'default_child',
          ),
      '/ai-sohbet-veli': (context) => AiSohbetVeli(),
      '/ai-sohbet-cocuk': (context) => AiSohbetCocuk(),
      '/coklu-cocuk-yonetimi': (context) => CokluCocukYonetimi(),
      '/kayit': (context) => KayitEkrani(),
      '/gercek-zamanli-sohbet': (context) => GercekZamanliSohbetScreen(kullaniciId: 'test_user', kullaniciTipi: 'child'),
      '/duygu-analiz': (context) => DuyguAnalizEkrani(),
      '/gelisim-raporu': (context) => GelisimRaporuEkrani(),
      '/ai-simulasyon': (context) => AiSimulasyonEkrani(),
      '/gelisim-grafik': (context) => GelisimGrafikEkrani(),
      '/kahraman-siralama': (context) => KahramanSiralamaEkrani(),
      '/veli-uyari': (context) => VeliUyariEkrani(),
      // Diğer alt ekranlar eklenebilir
    },
  ));
}