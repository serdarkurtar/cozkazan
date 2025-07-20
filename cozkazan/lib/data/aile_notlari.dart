class AileNotu {
  final String id;
  final String gonderen; // 'veli' veya 'ogrenci'
  final String mesaj;
  final DateTime tarih;

  AileNotu({
    required this.id,
    required this.gonderen,
    required this.mesaj,
    required this.tarih,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'gonderen': gonderen,
      'mesaj': mesaj,
      'tarih': tarih.toIso8601String(),
    };
  }

  factory AileNotu.fromJson(Map<String, dynamic> json) {
    return AileNotu(
      id: json['id'],
      gonderen: json['gonderen'],
      mesaj: json['mesaj'],
      tarih: DateTime.parse(json['tarih']),
    );
  }
} 