import mongoose from 'mongoose';
import User from '../models/User.js';
import { MONGODB_URI } from '../env.js';

// MongoDB bağlantısı
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log('MongoDB bağlantısı kuruldu');

async function testKullanicilariOlustur() {
  try {
    console.log('🧪 Test kullanıcıları oluşturuluyor...');

    // Önce mevcut test kullanıcılarını temizle
    await User.deleteMany({ 
      username: { $in: ['test_veli', 'test_cocuk1', 'test_cocuk2'] } 
    });
    console.log('🗑️  Eski test kullanıcıları temizlendi');

    // Test velisi oluştur
    const testVeli = new User({
      username: 'test_veli',
      email: 'test_veli@example.com',
      password: 'test123',
      userType: 'parent',
      firstName: 'Test',
      lastName: 'Veli',
      isActive: true
    });

    await testVeli.save();
    console.log('✅ Test velisi oluşturuldu:', testVeli.username);

    // Test çocukları oluştur
    const testCocuk1 = new User({
      username: 'test_cocuk1',
      email: 'test_cocuk1@example.com',
      password: 'test123',
      userType: 'child',
      firstName: 'Test',
      lastName: 'Çocuk1',
      age: 8,
      grade: '3. Sınıf',
      parentId: testVeli._id,
      isActive: true
    });

    const testCocuk2 = new User({
      username: 'test_cocuk2',
      email: 'test_cocuk2@example.com',
      password: 'test123',
      userType: 'child',
      firstName: 'Test',
      lastName: 'Çocuk2',
      age: 10,
      grade: '4. Sınıf',
      parentId: testVeli._id,
      isActive: true
    });

    await testCocuk1.save();
    await testCocuk2.save();
    console.log('✅ Test çocukları oluşturuldu');

    // Velinin children array'ini güncelle
    testVeli.children = [testCocuk1._id, testCocuk2._id];
    await testVeli.save();
    console.log('✅ Veli-çocuk ilişkileri kuruldu');

    console.log('\n📊 Test Kullanıcıları Özeti:');
    console.log('=============================');
    console.log(`👨‍👩‍👧‍👦 Veli: ${testVeli.username} (${testVeli._id})`);
    console.log(`👶 Çocuk 1: ${testCocuk1.username} (${testCocuk1._id}) - ${testCocuk1.grade}`);
    console.log(`👶 Çocuk 2: ${testCocuk2.username} (${testCocuk2._id}) - ${testCocuk2.grade}`);

    return {
      veli: testVeli,
      cocuklar: [testCocuk1, testCocuk2]
    };

  } catch (error) {
    console.error('❌ Test kullanıcıları oluşturma hatası:', error);
    throw error;
  }
}

// Manuel çalıştırma için
async function main() {
  try {
    const kullanicilar = await testKullanicilariOlustur();
    console.log('\n🎉 Test kullanıcıları başarıyla oluşturuldu!');
    
    // JSON formatında da yazdır
    console.log('\n📋 JSON Formatı:');
    console.log(JSON.stringify({
      veli: {
        id: kullanicilar.veli._id.toString(),
        username: kullanicilar.veli.username,
        children: kullanicilar.veli.children.map(id => id.toString())
      },
      cocuklar: kullanicilar.cocuklar.map(cocuk => ({
        id: cocuk._id.toString(),
        username: cocuk.username,
        grade: cocuk.grade,
        parentId: cocuk.parentId.toString()
      }))
    }, null, 2));

  } catch (error) {
    console.error('❌ Ana fonksiyon hatası:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB bağlantısı kapatıldı');
  }
}

// Eğer bu dosya doğrudan çalıştırılıyorsa
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { testKullanicilariOlustur }; 