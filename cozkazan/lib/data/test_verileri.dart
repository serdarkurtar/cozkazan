class TestSorusu {
  final String soru;
  final List<String> secenekler;
  final int dogruCevap;
  final String ders;
  final String zorluk;
  final int sinif;
  final int xp;

  TestSorusu({
    required this.soru,
    required this.secenekler,
    required this.dogruCevap,
    required this.ders,
    required this.zorluk,
    required this.sinif,
    required this.xp,
  });

  // JSON'dan TestSorusu oluştur
  factory TestSorusu.fromJson(Map<String, dynamic> json) {
    return TestSorusu(
      soru: json['soru'] ?? '',
      secenekler: List<String>.from(json['secenekler'] ?? []),
      dogruCevap: json['dogruCevap'] ?? 0,
      ders: json['ders'] ?? '',
      zorluk: json['zorluk'] ?? '',
      sinif: json['sinif'] ?? 1,
      xp: json['xp'] ?? 0,
    );
  }

  // TestSorusu'nu JSON'a çevir
  Map<String, dynamic> toJson() {
    return {
      'soru': soru,
      'secenekler': secenekler,
      'dogruCevap': dogruCevap,
      'ders': ders,
      'zorluk': zorluk,
      'sinif': sinif,
      'xp': xp,
    };
  }
}

class Test {
  final String id;
  final String baslik;
  final String kategori;
  final String aciklama;
  final int seviye;
  final int xpOdul;
  final List<TestSorusu> sorular;
  final bool aktif;

  Test({
    required this.id,
    required this.baslik,
    required this.kategori,
    required this.aciklama,
    required this.seviye,
    required this.xpOdul,
    required this.sorular,
    this.aktif = true,
  });

  // JSON'dan Test oluştur
  factory Test.fromJson(Map<String, dynamic> json) {
    return Test(
      id: json['_id'] ?? json['id'] ?? '',
      baslik: json['baslik'] ?? '',
      kategori: json['kategori'] ?? '',
      aciklama: json['aciklama'] ?? '',
      seviye: json['seviye'] ?? 1,
      xpOdul: json['xpOdul'] ?? 0,
      sorular: (json['sorular'] as List<dynamic>?)
          ?.map((soru) => TestSorusu.fromJson(soru))
          .toList() ?? [],
      aktif: json['aktif'] ?? true,
    );
  }

  // Test'i JSON'a çevir
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'baslik': baslik,
      'kategori': kategori,
      'aciklama': aciklama,
      'seviye': seviye,
      'xpOdul': xpOdul,
      'sorular': sorular.map((soru) => soru.toJson()).toList(),
      'aktif': aktif,
    };
  }
}

class TestVerileri {
  static List<TestSorusu> tumSorular = [
    // ===== 1. SINIF MATEMATİK =====
    TestSorusu(soru: "1. sınıf Matematik Kolay: 2+2=?", secenekler: ["3", "4", "5", "6"], dogruCevap: 1, ders: "Matematik", zorluk: "Kolay", sinif: 1, xp: 10),
    TestSorusu(soru: "1. sınıf Matematik Orta: 5+7=?", secenekler: ["10", "11", "12", "13"], dogruCevap: 2, ders: "Matematik", zorluk: "Orta", sinif: 1, xp: 15),
    TestSorusu(soru: "1. sınıf Matematik Zor: 9-3=?", secenekler: ["5", "6", "7", "8"], dogruCevap: 1, ders: "Matematik", zorluk: "Zor", sinif: 1, xp: 20),

    // ===== 1. SINIF TÜRKÇE =====
    TestSorusu(soru: "1. sınıf Türkçe Kolay: 'Elma' kaç harf?", secenekler: ["3", "4", "5", "6"], dogruCevap: 1, ders: "Türkçe", zorluk: "Kolay", sinif: 1, xp: 10),
    TestSorusu(soru: "1. sınıf Türkçe Orta: 'Anne' kelimesinin ilk harfi?", secenekler: ["A", "N", "E", "M"], dogruCevap: 0, ders: "Türkçe", zorluk: "Orta", sinif: 1, xp: 15),
    TestSorusu(soru: "1. sınıf Türkçe Zor: 'Kedi' kelimesinin son harfi?", secenekler: ["K", "E", "D", "İ"], dogruCevap: 3, ders: "Türkçe", zorluk: "Zor", sinif: 1, xp: 20),

    // ===== 1. SINIF HAYAT BİLGİSİ =====
    TestSorusu(soru: "1. sınıf Hayat Bilgisi Kolay: Güneş hangi saatte doğar?", secenekler: ["Akşam", "Gece", "Sabah", "Öğlen"], dogruCevap: 2, ders: "Hayat Bilgisi", zorluk: "Kolay", sinif: 1, xp: 10),
    TestSorusu(soru: "1. sınıf Hayat Bilgisi Orta: Kaç mevsim vardır?", secenekler: ["2", "3", "4", "5"], dogruCevap: 2, ders: "Hayat Bilgisi", zorluk: "Orta", sinif: 1, xp: 15),
    TestSorusu(soru: "1. sınıf Hayat Bilgisi Zor: Hangi hayvan evcil hayvandır?", secenekler: ["Aslan", "Kedi", "Kaplan", "Kurt"], dogruCevap: 1, ders: "Hayat Bilgisi", zorluk: "Zor", sinif: 1, xp: 20),

    // ===== 1. SINIF FEN BİLGİSİ =====
    TestSorusu(soru: "1. sınıf Fen Bilgisi Kolay: Su hangi sıcaklıkta donar?", secenekler: ["0°C", "10°C", "20°C", "30°C"], dogruCevap: 0, ders: "Fen Bilgisi", zorluk: "Kolay", sinif: 1, xp: 10),
    TestSorusu(soru: "1. sınıf Fen Bilgisi Orta: Hangi madde gazdır?", secenekler: ["Su", "Taş", "Hava", "Demir"], dogruCevap: 2, ders: "Fen Bilgisi", zorluk: "Orta", sinif: 1, xp: 15),
    TestSorusu(soru: "1. sınıf Fen Bilgisi Zor: Hangi organ yemekleri sindirir?", secenekler: ["Kalp", "Akciğer", "Mide", "Karaciğer"], dogruCevap: 2, ders: "Fen Bilgisi", zorluk: "Zor", sinif: 1, xp: 20),

    // ===== 2. SINIF MATEMATİK =====
    TestSorusu(soru: "2. sınıf Matematik Kolay: 10+5=?", secenekler: ["13", "14", "15", "16"], dogruCevap: 2, ders: "Matematik", zorluk: "Kolay", sinif: 2, xp: 10),
    TestSorusu(soru: "2. sınıf Matematik Orta: 20-8=?", secenekler: ["10", "11", "12", "13"], dogruCevap: 2, ders: "Matematik", zorluk: "Orta", sinif: 2, xp: 15),
    TestSorusu(soru: "2. sınıf Matematik Zor: 7x6=?", secenekler: ["40", "42", "44", "46"], dogruCevap: 1, ders: "Matematik", zorluk: "Zor", sinif: 2, xp: 20),

    // ===== 2. SINIF TÜRKÇE =====
    TestSorusu(soru: "2. sınıf Türkçe Kolay: 'Ev' kelimesinin eş anlamlısı?", secenekler: ["Konut", "Oda", "Salon", "Mutfak"], dogruCevap: 0, ders: "Türkçe", zorluk: "Kolay", sinif: 2, xp: 10),
    TestSorusu(soru: "2. sınıf Türkçe Orta: 'Büyük' kelimesinin zıt anlamlısı?", secenekler: ["Küçük", "Uzun", "Geniş", "Yüksek"], dogruCevap: 0, ders: "Türkçe", zorluk: "Orta", sinif: 2, xp: 15),
    TestSorusu(soru: "2. sınıf Türkçe Zor: 'Güzel' kelimesinin eş anlamlısı?", secenekler: ["Hoş", "Yeni", "Eski", "Uzak"], dogruCevap: 0, ders: "Türkçe", zorluk: "Zor", sinif: 2, xp: 20),

    // ===== 2. SINIF HAYAT BİLGİSİ =====
    TestSorusu(soru: "2. sınıf Hayat Bilgisi Kolay: Hangi mevsimde kar yağar?", secenekler: ["Yaz", "Kış", "İlkbahar", "Sonbahar"], dogruCevap: 1, ders: "Hayat Bilgisi", zorluk: "Kolay", sinif: 2, xp: 10),
    TestSorusu(soru: "2. sınıf Hayat Bilgisi Orta: Hangi hayvan yumurtlar?", secenekler: ["Kedi", "Köpek", "Tavuk", "İnek"], dogruCevap: 2, ders: "Hayat Bilgisi", zorluk: "Orta", sinif: 2, xp: 15),
    TestSorusu(soru: "2. sınıf Hayat Bilgisi Zor: Hangi bitki meyve verir?", secenekler: ["Çam", "Elma ağacı", "Kaktüs", "Eğrelti"], dogruCevap: 1, ders: "Hayat Bilgisi", zorluk: "Zor", sinif: 2, xp: 20),

    // ===== 2. SINIF FEN BİLGİSİ =====
    TestSorusu(soru: "2. sınıf Fen Bilgisi Kolay: Hangi madde katıdır?", secenekler: ["Su", "Taş", "Hava", "Buhar"], dogruCevap: 1, ders: "Fen Bilgisi", zorluk: "Kolay", sinif: 2, xp: 10),
    TestSorusu(soru: "2. sınıf Fen Bilgisi Orta: Hangi organ oksijen alır?", secenekler: ["Kalp", "Akciğer", "Mide", "Karaciğer"], dogruCevap: 1, ders: "Fen Bilgisi", zorluk: "Orta", sinif: 2, xp: 15),
    TestSorusu(soru: "2. sınıf Fen Bilgisi Zor: Hangi hayvan süt verir?", secenekler: ["Kedi", "Köpek", "İnek", "Tavuk"], dogruCevap: 2, ders: "Fen Bilgisi", zorluk: "Zor", sinif: 2, xp: 20),

    // ===== 3. SINIF MATEMATİK =====
    TestSorusu(soru: "3. sınıf Matematik Kolay: 12+8=?", secenekler: ["18", "19", "20", "21"], dogruCevap: 2, ders: "Matematik", zorluk: "Kolay", sinif: 3, xp: 10),
    TestSorusu(soru: "3. sınıf Matematik Orta: 25-9=?", secenekler: ["14", "15", "16", "17"], dogruCevap: 2, ders: "Matematik", zorluk: "Orta", sinif: 3, xp: 15),
    TestSorusu(soru: "3. sınıf Matematik Zor: 7x8=?", secenekler: ["54", "56", "58", "60"], dogruCevap: 1, ders: "Matematik", zorluk: "Zor", sinif: 3, xp: 20),

    // ===== 3. SINIF TÜRKÇE =====
    TestSorusu(soru: "3. sınıf Türkçe Kolay: 'Köpek' kaç harf?", secenekler: ["4", "5", "6", "7"], dogruCevap: 1, ders: "Türkçe", zorluk: "Kolay", sinif: 3, xp: 10),
    TestSorusu(soru: "3. sınıf Türkçe Orta: 'Çiçek' kelimesinin ilk harfi?", secenekler: ["Ç", "İ", "C", "E"], dogruCevap: 0, ders: "Türkçe", zorluk: "Orta", sinif: 3, xp: 15),
    TestSorusu(soru: "3. sınıf Türkçe Zor: 'Karpuz' kelimesinin son harfi?", secenekler: ["K", "Z", "P", "U"], dogruCevap: 1, ders: "Türkçe", zorluk: "Zor", sinif: 3, xp: 20),

    // ===== 3. SINIF HAYAT BİLGİSİ =====
    TestSorusu(soru: "3. sınıf Hayat Bilgisi Kolay: Dünya'nın uydusu nedir?", secenekler: ["Mars", "Venüs", "Ay", "Güneş"], dogruCevap: 2, ders: "Hayat Bilgisi", zorluk: "Kolay", sinif: 3, xp: 10),
    TestSorusu(soru: "3. sınıf Hayat Bilgisi Orta: İnsan vücudunda en büyük organ hangisidir?", secenekler: ["Kalp", "Deri", "Akciğer", "Beyin"], dogruCevap: 1, ders: "Hayat Bilgisi", zorluk: "Orta", sinif: 3, xp: 15),
    TestSorusu(soru: "3. sınıf Hayat Bilgisi Zor: Geri dönüşüm neden önemlidir?", secenekler: ["Çevreyi korumak", "Daha çok çöp üretmek", "Su israfı", "Hava kirliliği"], dogruCevap: 0, ders: "Hayat Bilgisi", zorluk: "Zor", sinif: 3, xp: 20),

    // ===== 3. SINIF FEN BİLGİSİ =====
    TestSorusu(soru: "3. sınıf Fen Bilgisi Kolay: Hangi madde sıvıdır?", secenekler: ["Taş", "Su", "Demir", "Odun"], dogruCevap: 1, ders: "Fen Bilgisi", zorluk: "Kolay", sinif: 3, xp: 10),
    TestSorusu(soru: "3. sınıf Fen Bilgisi Orta: Hangi organ kanı pompalar?", secenekler: ["Akciğer", "Kalp", "Mide", "Karaciğer"], dogruCevap: 1, ders: "Fen Bilgisi", zorluk: "Orta", sinif: 3, xp: 15),
    TestSorusu(soru: "3. sınıf Fen Bilgisi Zor: Hangi hayvan yumurtlar?", secenekler: ["Kedi", "Köpek", "Tavuk", "İnek"], dogruCevap: 2, ders: "Fen Bilgisi", zorluk: "Zor", sinif: 3, xp: 20),

    // ===== 4. SINIF MATEMATİK =====
    TestSorusu(soru: "4. sınıf Matematik Kolay: 20+30=?", secenekler: ["40", "50", "60", "70"], dogruCevap: 1, ders: "Matematik", zorluk: "Kolay", sinif: 4, xp: 10),
    TestSorusu(soru: "4. sınıf Matematik Orta: 100-45=?", secenekler: ["55", "60", "65", "70"], dogruCevap: 0, ders: "Matematik", zorluk: "Orta", sinif: 4, xp: 15),
    TestSorusu(soru: "4. sınıf Matematik Zor: 12x11=?", secenekler: ["120", "121", "122", "123"], dogruCevap: 1, ders: "Matematik", zorluk: "Zor", sinif: 4, xp: 20),

    // ===== 4. SINIF TÜRKÇE =====
    TestSorusu(soru: "4. sınıf Türkçe Kolay: 'Araba' kaç harf?", secenekler: ["4", "5", "6", "7"], dogruCevap: 1, ders: "Türkçe", zorluk: "Kolay", sinif: 4, xp: 10),
    TestSorusu(soru: "4. sınıf Türkçe Orta: 'Çocuk' kelimesinin ilk harfi?", secenekler: ["Ç", "O", "C", "K"], dogruCevap: 0, ders: "Türkçe", zorluk: "Orta", sinif: 4, xp: 15),
    TestSorusu(soru: "4. sınıf Türkçe Zor: 'Karpuz' kelimesinin son harfi?", secenekler: ["K", "Z", "P", "U"], dogruCevap: 1, ders: "Türkçe", zorluk: "Zor", sinif: 4, xp: 20),

    // ===== 4. SINIF HAYAT BİLGİSİ =====
    TestSorusu(soru: "4. sınıf Hayat Bilgisi Kolay: Hangi mevsimde çiçekler açar?", secenekler: ["Kış", "İlkbahar", "Yaz", "Sonbahar"], dogruCevap: 1, ders: "Hayat Bilgisi", zorluk: "Kolay", sinif: 4, xp: 10),
    TestSorusu(soru: "4. sınıf Hayat Bilgisi Orta: Hangi organ kanı temizler?", secenekler: ["Akciğer", "Kalp", "Böbrek", "Karaciğer"], dogruCevap: 2, ders: "Hayat Bilgisi", zorluk: "Orta", sinif: 4, xp: 15),
    TestSorusu(soru: "4. sınıf Hayat Bilgisi Zor: Hangi bitki çiçek açar?", secenekler: ["Çam", "Gül", "Kaktüs", "Eğrelti"], dogruCevap: 1, ders: "Hayat Bilgisi", zorluk: "Zor", sinif: 4, xp: 20),

    // ===== 4. SINIF FEN BİLGİSİ =====
    TestSorusu(soru: "4. sınıf Fen Bilgisi Kolay: Hangi madde buharlaşır?", secenekler: ["Su", "Taş", "Demir", "Odun"], dogruCevap: 0, ders: "Fen Bilgisi", zorluk: "Kolay", sinif: 4, xp: 10),
    TestSorusu(soru: "4. sınıf Fen Bilgisi Orta: Hangi organ kemikleri korur?", secenekler: ["Kas", "Deri", "Kemik", "Eklem"], dogruCevap: 1, ders: "Fen Bilgisi", zorluk: "Orta", sinif: 4, xp: 15),
    TestSorusu(soru: "4. sınıf Fen Bilgisi Zor: Hangi hayvan ot yer?", secenekler: ["Kedi", "Köpek", "İnek", "Tavuk"], dogruCevap: 2, ders: "Fen Bilgisi", zorluk: "Zor", sinif: 4, xp: 20),
  ];

  // Test sorularını filtreleme
  static List<TestSorusu> getSorular({
    required int sinif,
    required String ders,
    required String zorluk,
  }) {
    return tumSorular.where((soru) =>
      soru.sinif == sinif &&
      soru.ders == ders &&
      soru.zorluk == zorluk
    ).toList();
  }

  // Rastgele sorular getirme
  static List<TestSorusu> getRastgeleSorular({
    required int sinif,
    required String ders,
    required String zorluk,
    int soruSayisi = 10,
  }) {
    List<TestSorusu> filtrelenmisSorular = getSorular(
      sinif: sinif,
      ders: ders,
      zorluk: zorluk,
    );
    
    filtrelenmisSorular.shuffle();
    
    if (filtrelenmisSorular.length <= soruSayisi) {
      return filtrelenmisSorular;
    } else {
      return filtrelenmisSorular.take(soruSayisi).toList();
    }
  }
} 