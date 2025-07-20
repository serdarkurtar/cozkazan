class SosyalGorev {
  final String id;
  final String baslik;
  final String aciklama;
  final int xpOdulu;
  final String kategori;
  final bool tamamlandi;
  final bool veliOnayi;
  final DateTime? tamamlanmaTarihi;
  final DateTime? olusturmaTarihi;
  final bool manuelGorev; // Veli tarafından manuel eklenen görev

  SosyalGorev({
    required this.id,
    required this.baslik,
    required this.aciklama,
    required this.xpOdulu,
    required this.kategori,
    this.tamamlandi = false,
    this.veliOnayi = false,
    this.tamamlanmaTarihi,
    this.olusturmaTarihi,
    this.manuelGorev = false,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'baslik': baslik,
      'aciklama': aciklama,
      'xpOdulu': xpOdulu,
      'kategori': kategori,
      'tamamlandi': tamamlandi,
      'veliOnayi': veliOnayi,
      'tamamlanmaTarihi': tamamlanmaTarihi?.toIso8601String(),
      'olusturmaTarihi': olusturmaTarihi?.toIso8601String(),
      'manuelGorev': manuelGorev,
    };
  }

  factory SosyalGorev.fromJson(Map<String, dynamic> json) {
    return SosyalGorev(
      id: json['id'],
      baslik: json['baslik'],
      aciklama: json['aciklama'],
      xpOdulu: json['xpOdulu'],
      kategori: json['kategori'],
      tamamlandi: json['tamamlandi'] ?? false,
      veliOnayi: json['veliOnayi'] ?? false,
      tamamlanmaTarihi: json['tamamlanmaTarihi'] != null 
          ? DateTime.parse(json['tamamlanmaTarihi']) 
          : null,
      olusturmaTarihi: json['olusturmaTarihi'] != null 
          ? DateTime.parse(json['olusturmaTarihi']) 
          : null,
      manuelGorev: json['manuelGorev'] ?? false,
    );
  }

  SosyalGorev copyWith({
    String? id,
    String? baslik,
    String? aciklama,
    int? xpOdulu,
    String? kategori,
    bool? tamamlandi,
    bool? veliOnayi,
    DateTime? tamamlanmaTarihi,
    DateTime? olusturmaTarihi,
    bool? manuelGorev,
  }) {
    return SosyalGorev(
      id: id ?? this.id,
      baslik: baslik ?? this.baslik,
      aciklama: aciklama ?? this.aciklama,
      xpOdulu: xpOdulu ?? this.xpOdulu,
      kategori: kategori ?? this.kategori,
      tamamlandi: tamamlandi ?? this.tamamlandi,
      veliOnayi: veliOnayi ?? this.veliOnayi,
      tamamlanmaTarihi: tamamlanmaTarihi ?? this.tamamlanmaTarihi,
      olusturmaTarihi: olusturmaTarihi ?? this.olusturmaTarihi,
      manuelGorev: manuelGorev ?? this.manuelGorev,
    );
  }
}

class SosyalGorevVerileri {
  static List<SosyalGorev> varsayilanGorevler = [
    // Sabah rutinleri
    SosyalGorev(
      id: 'sabah_1',
      baslik: 'Yatağımı Topla',
      aciklama: 'Sabah kalktığında yatağını düzgün bir şekilde topla',
      xpOdulu: 10,
      kategori: 'Sabah Rutinleri',
      olusturmaTarihi: DateTime.now(),
    ),
    SosyalGorev(
      id: 'sabah_2',
      baslik: 'Dişlerimi Fırçala',
      aciklama: 'Sabah ve akşam dişlerini fırçala',
      xpOdulu: 15,
      kategori: 'Kişisel Bakım',
      olusturmaTarihi: DateTime.now(),
    ),
    SosyalGorev(
      id: 'sabah_3',
      baslik: 'Kahvaltı Yap',
      aciklama: 'Sağlıklı bir kahvaltı yap',
      xpOdulu: 10,
      kategori: 'Beslenme',
      olusturmaTarihi: DateTime.now(),
    ),
    
    // Ev işleri
    SosyalGorev(
      id: 'ev_1',
      baslik: 'Odamı Temizle',
      aciklama: 'Odandaki eşyaları düzenle ve temizle',
      xpOdulu: 20,
      kategori: 'Ev İşleri',
      olusturmaTarihi: DateTime.now(),
    ),
    SosyalGorev(
      id: 'ev_2',
      baslik: 'Çöpleri At',
      aciklama: 'Evdeki çöpleri çöp kutusuna at',
      xpOdulu: 10,
      kategori: 'Ev İşleri',
      olusturmaTarihi: DateTime.now(),
    ),
    SosyalGorev(
      id: 'ev_3',
      baslik: 'Masanı Temizle',
      aciklama: 'Yemek yedikten sonra masanı temizle',
      xpOdulu: 10,
      kategori: 'Ev İşleri',
      olusturmaTarihi: DateTime.now(),
    ),
    
    // Sosyal davranışlar
    SosyalGorev(
      id: 'sosyal_1',
      baslik: 'Teşekkür Et',
      aciklama: 'Bugün en az 3 kez teşekkür et',
      xpOdulu: 15,
      kategori: 'Sosyal Davranışlar',
      olusturmaTarihi: DateTime.now(),
    ),
    SosyalGorev(
      id: 'sosyal_2',
      baslik: 'Yardım Et',
      aciklama: 'Birine yardım et',
      xpOdulu: 20,
      kategori: 'Sosyal Davranışlar',
      olusturmaTarihi: DateTime.now(),
    ),
    SosyalGorev(
      id: 'sosyal_3',
      baslik: 'Özür Dile',
      aciklama: 'Bir hata yaptıysan özür dile',
      xpOdulu: 15,
      kategori: 'Sosyal Davranışlar',
      olusturmaTarihi: DateTime.now(),
    ),
    
    // Eğitim
    SosyalGorev(
      id: 'egitim_1',
      baslik: 'Kitap Oku',
      aciklama: 'En az 15 dakika kitap oku',
      xpOdulu: 25,
      kategori: 'Eğitim',
      olusturmaTarihi: DateTime.now(),
    ),
    SosyalGorev(
      id: 'egitim_2',
      baslik: 'Ödev Yap',
      aciklama: 'Günlük ödevlerini tamamla',
      xpOdulu: 30,
      kategori: 'Eğitim',
      olusturmaTarihi: DateTime.now(),
    ),
    SosyalGorev(
      id: 'egitim_3',
      baslik: 'Yeni Kelime Öğren',
      aciklama: 'Bugün 3 yeni kelime öğren',
      xpOdulu: 20,
      kategori: 'Eğitim',
      olusturmaTarihi: DateTime.now(),
    ),
  ];

  static List<String> kategoriler = [
    'Sabah Rutinleri',
    'Kişisel Bakım',
    'Beslenme',
    'Ev İşleri',
    'Sosyal Davranışlar',
    'Eğitim',
    'Spor',
    'Sanat',
  ];
} 