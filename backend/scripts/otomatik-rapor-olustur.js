import mongoose from 'mongoose';
import GelisimRaporuService from '../services/gelisimRaporuService.js';
import User from '../models/User.js';
import { MONGODB_URI } from '../env.js';

// MongoDB bağlantısı
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log('MongoDB bağlantısı kuruldu');

// Otomatik rapor oluşturma fonksiyonu
async function otomatikRaporOlustur(frequency = 'weekly', includeGraphs = true, notifyParents = true) {
  try {
    console.log(`🚀 Otomatik rapor oluşturma başlatılıyor...`);
    console.log(`📊 Sıklık: ${frequency}`);
    console.log(`📈 Grafikler: ${includeGraphs ? 'Evet' : 'Hayır'}`);
    console.log(`📧 Veli Bildirimi: ${notifyParents ? 'Evet' : 'Hayır'}`);

    // Tüm çocuk kullanıcılarını getir
    const children = await User.find({ userType: 'child' });
    console.log(`👶 Toplam ${children.length} çocuk bulundu`);

    let basariliRapor = 0;
    let hataliRapor = 0;
    let gonderilenRapor = 0;

    for (const child of children) {
      try {
        console.log(`\n📋 ${child.username} için rapor oluşturuluyor...`);

        // Çocuğun velisini bul
        const parent = await User.findOne({ 
          userType: 'parent', 
          children: child._id 
        });

        if (!parent) {
          console.log(`⚠️  ${child.username} için veli bulunamadı, atlanıyor`);
          hataliRapor++;
          continue;
        }

        // Rapor oluştur
        const rapor = await GelisimRaporuService.otomatikRaporOlustur(
          child._id.toString(),
          parent._id.toString(),
          frequency
        );

        console.log(`✅ ${child.username} için ${frequency} rapor oluşturuldu`);
        console.log(`   📊 Performans: ${rapor.performansSeviyesi} (${rapor.genelPerformansSkoru}/100)`);
        console.log(`   🎯 Test Başarı: %${rapor.testBasariOrani.toFixed(1)}`);
        console.log(`   📚 Hikaye Tamamlama: %${rapor.hikayeTamamlamaOrani.toFixed(1)}`);
        console.log(`   💎 Toplam XP: ${rapor.toplamXp}`);

        basariliRapor++;

        // Veliye gönder
        if (notifyParents) {
          try {
            await GelisimRaporuService.raporuGonder(rapor._id.toString());
            console.log(`📧 Rapor veliye gönderildi`);
            gonderilenRapor++;
          } catch (error) {
            console.log(`❌ Rapor gönderilemedi: ${error.message}`);
          }
        }

        // Kısa bekleme (rate limiting)
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.log(`❌ ${child.username} için rapor oluşturulamadı: ${error.message}`);
        hataliRapor++;
      }
    }

    // Özet rapor
    console.log(`\n📊 OTOMATİK RAPOR OLUŞTURMA TAMAMLANDI`);
    console.log(`=========================================`);
    console.log(`✅ Başarılı Rapor: ${basariliRapor}`);
    console.log(`❌ Hatalı Rapor: ${hataliRapor}`);
    console.log(`📧 Gönderilen Rapor: ${gonderilenRapor}`);
    console.log(`📈 Başarı Oranı: %${((basariliRapor / children.length) * 100).toFixed(1)}`);

    return {
      basariliRapor,
      hataliRapor,
      gonderilenRapor,
      toplamCocuk: children.length,
      basariOrani: (basariliRapor / children.length) * 100
    };

  } catch (error) {
    console.error('❌ Otomatik rapor oluşturma hatası:', error);
    throw error;
  }
}

// Manuel çalıştırma için
async function main() {
  try {
    // Komut satırı argümanlarını al
    const args = process.argv.slice(2);
    let frequency = 'weekly';
    let includeGraphs = true;
    let notifyParents = true;

    // Argümanları parse et
    for (const arg of args) {
      if (arg.startsWith('frequency=')) {
        frequency = arg.split('=')[1];
      } else if (arg.startsWith('include_graphs=')) {
        includeGraphs = arg.split('=')[1] === 'true';
      } else if (arg.startsWith('notify_parents=')) {
        notifyParents = arg.split('=')[1] === 'true';
      }
    }

    // Geçerli frequency kontrolü
    if (!['daily', 'weekly', 'monthly'].includes(frequency)) {
      console.error('❌ Geçersiz frequency. Kullanılabilir: daily, weekly, monthly');
      process.exit(1);
    }

    console.log('🎯 Gelişim Raporu Otomasyonu Başlatılıyor...');
    console.log('=============================================');

    const sonuc = await otomatikRaporOlustur(frequency, includeGraphs, notifyParents);

    console.log('\n🎉 İşlem tamamlandı!');
    console.log('=============================================');

    // Sonuçları JSON olarak da yazdır
    console.log('\n📋 JSON Sonuç:');
    console.log(JSON.stringify(sonuc, null, 2));

  } catch (error) {
    console.error('❌ Ana fonksiyon hatası:', error);
    process.exit(1);
  } finally {
    // MongoDB bağlantısını kapat
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB bağlantısı kapatıldı');
  }
}

// Eğer bu dosya doğrudan çalıştırılıyorsa
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { otomatikRaporOlustur }; 